
## ABOUT
This sample app uses [vue-graph-template](https://github.com/donc310/vue-graph-template) template along with a json 

file containing a list  of youtube videos.  SEARCHES: `baby`,`help`


## DEMO
LINK : <a href="https://ngraph-youtube.herokuapp.com/#?q=baby">https://ngraph-youtube.herokuapp.com/#?q=baby</a>

## HOW IT WORKS
The app listens for the  `CORE::NODE_SELECTED` event emmitted by the main component to display a youtube video

```
mounted() {
EventBus.$on("CORE::NODE_SELECTED", selected_node => {});
}
 
```
## Project setup

```
npm install
```

### Compiles and minifies for production

```
npm run build
```

### Start

```
npm run start
```
App should be running in <a href="http://localhost:5000">http://localhost:5000</a>