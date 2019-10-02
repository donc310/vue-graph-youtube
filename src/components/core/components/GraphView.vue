<template>
  <div>
    <svg>
      <g ref="scene">
        <g ref="linksContainer">
          <path
            v-for="(edge ,index) in edges"
            :key="index"
            stroke="#999"
            :data-from="edge.fromId"
            :data-to="edge.toId"
            marker-end="url(#Triangle)"
          />
        </g>
        <g ref="nodeContainer">
          <image
            v-for="(node, index)  in nodes"
            :key="index"
            :width="node.width"
            :height="node.height"
            class="node-thumbnail"
            :data-id="node.id"
            :xlink:href="node.data.image.url"
          />
        </g>
      </g>
      <defs>
        <marker
          id="Triangle"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="10"
          markerHeight="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#999" />
        </marker>
      </defs>
    </svg>
    <div class="item-tooltip" v-if="tooltip.visible" :style="style">
      <img :src="tooltip.icon" />
      <div class="tooltip-details">
        <h4>{{tooltip.text}}</h4>
        <div class="footer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import panZoom from "panzoom";
import createLayout from "ngraph.forcelayout";
import { getFromTo } from "../lib/util/geom";
import clap from "../lib/util/clap";
import EventBus from "@/lib/util/event.js";

export default {
  name: "GraphView",
  props: ["graph"],
  data() {
    return {
      nodes: [],
      edges: [],
      tooltip: {
        visible: false,
        text: "",
        x: 0,
        y: 0
      }
    };
  },
  watch: {
    graph(newGraph, oldGraph) {
      if (oldGraph) {
        EventBus.$emit("CORE::BEFORE_DISPOSE");
        this.disposeGraph();
      }
      EventBus.$emit("CORE::BEFORE_INIT");
      this.initializeGraph(newGraph);
    },
    nodes(newNodes, oldNodes) {
      var nodes = newNodes.map(node => {
        return {
          id: node.id,
          data: node.data
        };
      });
      EventBus.$emit("CORE::NODES_UPDATE", nodes);
    }
  },
  mounted() {
    const { scene } = this.$refs;
    this.zoomHandle = panZoom(scene);
    const rect = this.$el.getBoundingClientRect();
    this.zoomHandle.moveTo(rect.width / 2, rect.height / 2);
    this.initEvents(scene);
    this.initializeGraph(this.graph);
  },
  methods: {
    handleMouseEnter(e) {
      const nodeId = getNodeIdFromDOM(e.target);
      if (!nodeId) return;
      this.clearHighligh();
      forAll(
        this.$refs.scene,
        `path[data-from="${nodeId}"], path[data-to="${nodeId}"]`,
        addClass("hl")
      );
      const { title } = this.graph.getNode(nodeId).data;
      this.showTooltip(e.target, title);
    },
    handleMouseClick(e) {
      const nodeId = getNodeIdFromDOM(e.target);
      if (!nodeId) return;
      if (e.shiftKey) {
        this.$emit("loadMore", nodeId);
      } else {
        EventBus.$emit("CORE::NODE_SELECTED", nodeId);
      }
    },
    showTooltip(el, text) {
      const rect = el.getBoundingClientRect();
      const { tooltip } = this;
      tooltip.icon = el.href.baseVal;
      tooltip.text = text;
      tooltip.x = rect.left + rect.width / 2;
      tooltip.y = rect.top - 42 / 2;
      tooltip.visible = true;
    },
    handleMouseLeave() {
      this.clearHighligh();
      this.tooltip.visible = false;
    },
    clearHighligh() {
      forAll(this.$refs.scene, ".hl", removeClass("hl"));
    },
    onGraphChanged(changes) {
      this.iterations = 0;
      changes.forEach(change => {
        if (change.changeType === "add") {
          if (change.node) this.addNode(change.node);
          if (change.link) this.addLink(change.link);
        } else {
          //throw new Error("Not implemented")
        }
      });
      this.frame();
    },
    addNode(graphNode) {
      const { id, data } = graphNode;
      const pos = this.layout.getNodePosition(id);
      this.nodes.push({
        pos,
        id,
        data,
        width: data.width,
        height: data.height
      });
    },
    addLink(graphLink) {
      const { id, fromId, toId } = graphLink;
      const pos = this.layout.getLinkPosition(id);
      const fromHeight = this.graph.getNode(fromId).data.height;
      const toHeight = this.graph.getNode(toId).data.height;
      this.edges.push({ pos, fromId, toId, fromHeight, toHeight });
    },
    disposeGraph() {
      if (this.graph) {
        this.graph.off("changed", this.onGraphChanged, this);
        this.nodes = [];
        this.edges = [];
      }
      if (this.layout) {
        this.layout.dispose();
        this.layout = null;
      }
      if (this.layoutLoop) {
        cancelAnimationFrame(this.layoutLoop);
        this.layoutLoop = null;
      }
    },
    initEvents(scene) {
      scene.addEventListener(
        "mouseenter",
        this.handleMouseEnter.bind(this),
        true
      );
      scene.addEventListener(
        "mouseleave",
        this.handleMouseLeave.bind(this),
        true
      );
      this.clapDispose = clap(scene, this.handleMouseClick.bind(this), true);
    },
    initializeGraph(newGraph) {
      if (!newGraph) return;
      this.layout = createLayout(newGraph, {
        springLength: 80,
        springCoeff: 0.0004,
        dragCoeff: 0.05,
        gravity: -50,
        theta: 0.5
      });
      this.nodes = [];
      this.edges = [];
      const graph = newGraph;
      graph.forEachNode(node => {
        this.addNode(node);
      });
      graph.forEachLink(link => {
        this.addLink(link);
      });
      graph.on("changed", this.onGraphChanged, this);
      this.boundFrame = this.frame.bind(this);
      this.frame();
    },
    frame() {
      if (!this.layout) return;

      this.layout.step();
      this.edges.forEach(edge => {
        let ui = edge.ui;
        if (!ui) {
          ui = this.$refs.linksContainer.querySelector(
            `path[data-from="${edge.fromId}"][data-to="${edge.toId}"]`
          );
          edge.ui = ui;
        }
        if (ui)
          ui.setAttributeNS(
            null,
            "d",
            computeLinkPath(edge.pos, edge.fromHeight, edge.toHeight)
          );
      });

      this.nodes.forEach(node => {
        let ui = node.ui;
        if (!ui) {
          ui = this.$refs.nodeContainer.querySelector(`[data-id="${node.id}"]`);
          node.ui = ui;
        }
        if (ui) {
          ui.setAttributeNS(null, "x", node.pos.x - node.width / 2);
          ui.setAttributeNS(null, "y", node.pos.y - node.height / 2);
        }
      });

      this.iterations += 1;
      if (this.layout.lastMove > 20 || this.iterations < 100) {
        // we assume we are note converged yet.
        this.layoutLoop = requestAnimationFrame(this.boundFrame);
      }
    }
  },
  destroyed() {
    if (this.zoomHandle) {
      this.zoomHandle.dispose();
    }
    this.disposeGraph();
    if (this.clapDispose) {
      this.clapDispose();
    }
  },
  computed: {
    style() {
      return { left: this.tooltip.x + "px", top: this.tooltip.y + "px" };
    }
  }
};

function computeLinkPath(edge, fromHeight, toHeight) {
  const { from, to } = getFromTo(edge, fromHeight, toHeight);
  let data = "M";

  data += Math.round(from.x) + "," + Math.round(from.y);
  data += "L" + Math.round(to.x) + "," + Math.round(to.y);

  return data;
}

function getNodeIdFromDOM(el) {
  const isNode = el && el.classList.contains("node-thumbnail");
  if (!isNode) return;

  return el.getAttribute("data-id");
}

function forAll(scene, query, action) {
  Array.from(scene.querySelectorAll(query)).forEach(action);
}

function addClass(className) {
  return el => el.classList.add(className);
}

function removeClass(className) {
  return el => el.classList.remove(className);
}
</script>

<style scoped>
svg {
  width: 100%;
  height: 100%;
}
path.hl {
  stroke: RGB(51, 182, 121);
  stroke-width: 2px;
}
.node-thumbnail {
  cursor: pointer;
}
.tooltip {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  pointer-events: none;
  transform: translate(-50%, 0);
  white-space: nowrap;
}
.item-tooltip {
  position: fixed;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  z-index: 3;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 320px;
  height: 80px;
  background: #fff;
}

.item-tooltip img {
  height: 80px;
  width: auto;
}

.tooltip-details {
  position: relative;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  overflow: hidden;
}

.tooltip-details h4 {
  font-size: 15px;
  line-height: 16px;
  font-weight: 400;
  margin: 0;
  padding: 10px;
}

.tooltip-details .footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 10px;
  background: -webkit-linear-gradient(hsla(0, 0%, 100%, 0.4), #fff);
  background: linear-gradient(hsla(0, 0%, 100%, 0.4), #fff);
}

@media (max-width: 500px) {
  .item-tooltip {
    right: 0;
    width: inherit;
  }
}
</style>

