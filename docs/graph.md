<details>
<summary>In This Article</summary>
<li><a href="#graph">Graph</a></li>
<ul style="margin:0">
    <li><a href="#examples">Examples</a></li>
</ul>
</details>

# Graph
```ts
/**
 * A directed graph consisting of nodes and links.
 */
export declare class Graph extends GraphObject {
    constructor();
    /**
     * Gets the graph that this object belongs to.
     */
    get owner(): Graph;
    /**
     * Gets the document schema for this object.
     */
    get schema(): GraphSchema;
    /**
     * Gets the collection of links in the graph.
     */
    get links(): GraphLinkCollection;
    /**
     * Gets the collection of nodes in the graph.
     */
    get nodes(): GraphNodeCollection;
    /**
     * Adds a new schema to the graph.
     */
    addSchema(schema: GraphSchema): this;
    /**
     * Copies the schemas from another graph.
     */
    copySchemas(graph: Graph): boolean;
    /**
     * Imports a link (along with its source and target nodes) into the graph.
     */
    importLink(link: GraphLink): GraphLink;
    /**
     * Imports a node into the graph.
     * @param depth The depth of outgoing links to import (default `0`).
     */
    importNode(node: GraphNode, depth?: number): GraphNode;
    /**
     * Clears the links and nodes of the graph.
     */
    clear(): void;
    /**
     * Renames a node.
     * @param newId The new id for the node.
     */
    renameNode(node: GraphNode, newId: string): GraphNode;
    /**
     * Renames a node.
     * @param nodeId The id of the node to rename.
     * @param newId The new id for the node.
     */
    renameNode(nodeId: GraphNodeIdLike, newId: GraphNodeIdLike): GraphNode | undefined;
}
```

### Examples
```ts
import { Graph } from "graphmodel";
const graph = new Graph();
const nodeA = graph.nodes.getOrCreate("nodeA");
const nodeB = graph.nodes.getOrCreate("nodeB");
const linkAToB = graph.links.getOrCreate(nodeA, nodeB);
```

### See Also
* [GraphObject](graphObject.md)
* [GraphSchema](graphSchema.md)
* [GraphNode](graphNode.md)
* [GraphNodeCollection](graphNodeCollection.md)
* [GraphLink](graphLink.md)
* [GraphLinkCollection](graphLinkCollection.md)
* [API Documentation](index.md)