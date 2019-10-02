<template>
  <div id="app">
    <graph-view class="visualization" :graph="currentGraph" @loadMore="onLoadMore"></graph-view>
    <form
      ref="searchForm"
      id="searchForm"
      class="search-box no-print"
      @submit.prevent="searchFormSubmitHandler"
    >
      <a href="#" class="secondary open-sidebar" title="Menu">
        <i class="material-icons">menu</i>
      </a>
      <div class="ak-typeahead">
        <input
          v-model="searchString"
          autofocus
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="Type in what you like"
        />
        <ul v-if="suggestions.lenght > 0" class="suggestions">
          <li v-for="(suggestion, index) in suggestions" :key="index">
            <a class="suggestion" href="#"></a>
          </li>
        </ul>
      </div>
      <div class="search-button">
        <a
          href="#"
          class="search-icon"
          title="Search"
          @click="event=>searchFormSubmitHandler(event)"
        >
          <i class="material-icons">search</i>
        </a>
        <div v-if="false" class="drop-click-container">
          <span class="drop-click-name" title="category">dropdown</span>
          <select class="back-dropdown">
            <option value disabled></option>
          </select>
        </div>
      </div>
    </form>
    <slot></slot>
    <div class="log-message">
      <slot name="logger">{{logMessage}}</slot>
    </div>
    <div id="copyText">
      <slot name="copyRight">
        Made with
        <span class="heart">♥</span> by Chris
      </slot>
    </div>
  </div>
</template>

<script>
import queryState from "query-state";
import EventBus from "@/lib/util/event";
import { buildGraph } from "./lib/graph/graphBuilder";
import GraphView from "./components/GraphView.vue";

const qs = queryState();
export default {
  name: "Graph",
  components: {
    GraphView
  },
  props: {
    fileName: {
      type: String,
      default: "data"
    },
    client: {
      type: String,
      default: "json"
    },
    origin: { type: String, default: "api/v1/graphdata" }
  },
  data() {
    const searchString = qs.get("q") || "";
    let autofocus = true;
    const isInIFrame = window.self !== window.top;
    if (isInIFrame) autofocus = false;
    const autofocusOverride = qs.get("autofocus");
    if (autofocusOverride !== undefined) {
      autofocus = !!autofocusOverride;
    }
    return {
      request: null,
      logMessage: "Welcome...",
      autofocus,
      searchString,
      suggestions: []
    };
  },
  created() {
    qs.onChange(this.onQueryChange, this);
    this.startSearch();
  },
  mounted() {},
  methods: {
    searchFormSubmitHandler(event) {
      if (event) event.preventDefault();
      qs.set({ q: this.searchString });
      this.startSearch();
    },
    onLoadMore(nodeId) {
      if (this.request) {
        this.request.loadMore(nodeId);
      }
    },
    onQueryChange() {
      this.searchString = qs.get("q");
      this.startSearch();
    },
    startSearch() {
      const q = qs.get("q");
      let graphClient;
      if (!q) return;
      if (this.request) this.request.progress.cancel();
      if (this.client != "json") {
        graphClient = this.client;
      } else {
        graphClient = {
          type: this.client,
          fileName: this.fileName,
          origin: this.origin
        };
      }
      this.request = buildGraph(q, graphClient);
      this.request.progress.onProgress(msg => {
        this.logMessage = msg;
      });
    }
  },
  computed: {
    currentGraph() {
      if (this.request) {
        return this.request.graph;
      }
      return null;
    }
  }
};
</script>

<style >
@import "https://fonts.googleapis.com/icon?family=Material+Icons";
*,
*::before,
*::after {
  box-sizing: border-box;
}
body,
html {
  height: 100%;
}

body {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-family: Helvetica, sans-serif;
  position: fixed;
}

* {
  box-sizing: border-box;
}
.search-button {
  padding-right: 8px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.search-box,
.search-button {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.search-box {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0 rgba(0, 0, 0, 0.02);
  background: #fff;
  position: fixed;
  height: 48px;
  top: 8px;
  left: 6px;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: stretch;
  -ms-flex-pack: stretch;
  justify-content: stretch;
}

.ak-typeahead {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.ak-typeahead input {
  padding-left: 52px;
}

.ak-typeahead .suggestions,
.search-box {
  width: 392px;
}

.search-icon {
  color: rgba(0, 0, 0, 0.54);
  padding-right: 6px;
  padding-left: 8px;
  padding-top: 4px;
}

a:hover {
  color: #ff4081;
}

@media (max-width: 500px) {
  .search-box {
    right: 0;
    width: inherit;
    left: 0;
  }

  .open-sidebar {
    padding-right: 8px;
  }

  .ak-typeahead input {
    padding-left: 47px;
  }

  .ak-typeahead .suggestions {
    width: inherit;
    right: 0;
    left: 0;
  }
}

.ak-typeahead {
  height: 100%;
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
}

.ak-typeahead input::-ms-clear {
  display: none;
}

.suggestion {
  display: block;
  width: 100%;
  height: 42px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-left: 10px;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.87);
}

.suggestion.selected,
.suggestion:hover {
  background-color: #fff8e1;
  color: #ff4081;
}

.suggestions {
  position: absolute;
  top: 48px;
  width: 100%;
  padding: 0;
  background: #fff;
  list-style-type: none;
  margin: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input {
  height: 100%;
  width: 100%;
  padding-left: 10px;
  font-size: 18px;
  border: 0;
}

input:focus {
  outline: none;
}

input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.38);
}

input:-ms-input-placeholder {
  color: rgba(0, 0, 0, 0.38);
}

input::placeholder {
  color: rgba(0, 0, 0, 0.38);
}

.drop-click-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: relative;
}

.drop-click-container .back-dropdown {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}

.drop-click-container .drop-click-name {
  color: rgba(0, 0, 0, 0.87);
  border-bottom: 1px dotted #ff4081;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  white-space: nowrap;
}

.drop-click-container .drop-click-name.hover {
  color: #ff4081;
}

@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }
}
a.btn:hover {
  background-color: #fff8e1;
  color: #ff4081;
}

.shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.primary {
  color: rgba(0, 0, 0, 0.87);
}

.secondary {
  color: rgba(0, 0, 0, 0.54);
}

a.primary-action {
  color: #ff4081;
}
a {
  color: #4183c4;
  text-decoration: none;
  cursor: pointer;
}
a:hover {
  color: #ff4081;
}
.visualization {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#header {
  text-align: center;
  background: #6daee1;
  position: absolute;
  left: 0;
  width: 100%;
  height: 28px;
  color: white;
}
.footer {
  position: absolute;
  width: 100%;
  bottom: 9px;
  display: flex;
  justify-content: center;
}
#copyText {
  position: absolute;
  left: 10px;
  bottom: 9px;
  font-size: 9px;
  color: #999;
}
.close-about {
  float: right;
  margin-right: 14px;
  font-size: 12px;
}
.log-message {
  position: absolute;
  bottom: 42px;
  width: 100%;
  text-align: center;
  color: #ff4081;
  padding: 4px;
  background: rgba(255, 255, 255, 0.8);
}
@media only screen and (max-width: 600px) {
  #searchForm {
    width: 100%;
    top: 0;
    left: 0;
  }
  .window {
    left: 0;
    top: 56px;
    height: 35vh;
    width: 100%;
  }
  #searchString {
    font-size: 14px;
  }

  #about {
    left: 0;
    top: 56px;
    width: 100%;
  }

  .footer {
    padding-right: 14px;
    justify-content: flex-end;
  }
}
.heart {
  color: #ff4081;
}
</style>
