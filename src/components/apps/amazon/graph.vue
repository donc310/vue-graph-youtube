<template>
  <div>
    <div>
      <graphoverview
        :products="computedProducts"
        v-if="showOverview"
        @closeClick="handleCloseClick($event)"
        @productClicked="handleProductClick($event)"
        @closeDetail="closeDetails($event)"
      ></graphoverview>
      <graphdrawer v-if="showDrawer" @closeClick="handleCloseClick($event)"></graphdrawer>
      <graphdetail
        :product="selectedProduct"
        @closeDetail="closeDetails($event)"
        v-if="showDetails"
      ></graphdetail>
    </div>
  </div>
</template>
<script>
import GraphOview from "./graph_overview";
import GraphDrawer from "./graph_drawer";
import GraphDetail from "./graph_detail";
import EventBus from "../../../lib/util/event";

export default {
  components: {
    graphoverview: GraphOview,
    graphdrawer: GraphDrawer,
    graphdetail: GraphDetail
  },
  data() {
    return {
      products: [],
      showDrawer: true,
      showOverview: false,
      showDetails: false,
      selectedProduct: {}
    };
  },
  mounted() {
    var vm = this;
    EventBus.$on("CORE::NODE_SELECTED", nodeId => {
      vm.handleProductClick(nodeId);
    });
    EventBus.$on("CORE::NODES_UPDATE", nodes => {
      vm.products = nodes;
    });
    EventBus.$on("CORE::BEFORE_INIT", () => {
      vm.showOverview = true;
      vm.showDetails = false;
    });
    EventBus.$on("CORE::BEFORE_DISPOSE", () => {
      vm.showOverview = true;
      vm.showDetails = false;
    });
  },
  methods: {
    handleCloseClick(event) {
      if (event === "drawer") {
        this.showOverview = true;
        this.showDrawer = false;
      }
      if (event === "overview") {
        this.showDrawer = true;
        this.showOverview = false;
      }
    },
    handleProductClick(nodeId) {
      if (this.computedProducts.length === 0) return;
      this.selectedProduct = this.computedProducts.find(product => {
        return product.asin === `${nodeId}`;
      });
      this.showOverview = false;
      this.showDetails = true;
    },
    closeDetails(event) {
      this.showDetails = false;
      this.showOverview = true;
    }
  },
  computed: {
    computedProducts() {
      if (this.products.length === 0) return [];
      return this.products.map(product => {
        return Object.assign(
          {},
          { asin: product.id, title: product.data.title },
          product.data.info
        );
      });
    }
  },
  ready: function() {}
};
</script>
<style >
@import "./style/style.css";
@import "https://fonts.googleapis.com/icon?family=Material+Icons";
</style>


