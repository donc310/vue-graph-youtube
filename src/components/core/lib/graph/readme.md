

1. A graph is created using

```
var createGraph = require('ngraph.graph');
var g = createGraph();
```

2. The graph g can be grown in two ways. You can add one node at a time:

```
g.addNode('hello');
g.addNode('world');

```

You can associate arbitrary data with a node via optional second argument of addNode() method:

```
// Node 'world' is associated with a string object 'custom data'
g.addNode('world', 'custom data');

// You can associate arbitrary objects with node:
g.addNode('server', {
status: 'on',
ip: '127.0.0.1'
});

// to get data back use `data` property of node:
var server = g.getNode('server');
console.log(server.data); // prints associated object
```

3. You can also use addLink() method to grow a graph. Calling this method with nodes which are not present in the graph creates them:

```
g.addLink('space', 'bar'); // now graph 'g' has two new nodes: 'space' and 'bar'

```

If the nodes are already present in the graph 'addLink()' makes them connected:

```
// Only a link between 'hello' and 'bar' is created. No new nodes.
g.addLink('hello', 'world');
```