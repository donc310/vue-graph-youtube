import GraphComponent from "./App.vue"
const component = {
    GraphComponent,
    install(Vue) {
        if (this.installed) {
            return
        }
        this.installed = true
        Vue.component('graph-component', GraphComponent)
    }
}

export default component

export { GraphComponent }
