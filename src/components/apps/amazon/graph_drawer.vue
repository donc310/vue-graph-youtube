<template>
  <div>
    <a class="list-results shadow btn no-print" @click="hideDetails" href="#" title="show the list of found products">
      <i class="material-icons">list</i>
      <span class="label">List results</span>
    </a>
  </div>
</template>
<script>
export default {
    name:'drawer',
    methods: {
      hideDetails(){
        this.$emit('closeClick', 'drawer')
      }
    },
}
</script>
<style>

</style>

