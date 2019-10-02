<template>
  <graph-component :fileName="fileName" :client="client">
    <graph-app></graph-app>
    <template v-slot:logger></template>
    <template v-slot:copyRight></template>
  </graph-component>
</template>
<script>
import GraphApp from "./components/app/App";
export default {
  name: "CORE_APP",
  components: {
    GraphApp
  },
  data() {
    return {
      fileName: "data",
      client:"json"
    };
  }
};
</script>
<style>
</style>