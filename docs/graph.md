# Graph
```ts
/**
 * A directed graph consisting of nodes and links.
 */
export declare class Graph<P extends object = any> extends GraphObject<P> {
    constructor(...schemas: GraphSchema<P>[]);
    /**
     * Gets the collection of links in the graph.
     */
    readonly links: GraphLinkCollection<P>;
    /**
     * Gets the collection of nodes in the graph.
     */
    readonly nodes: GraphNodeCollection<P>;
    /**
     * Gets the graph that this object belongs to.
     */
    readonly owner: this;
    /**
     * Gets the document schema for this object.
     */
    readonly schema: GraphSchema<P>;
    /**
     * Adds a new schema to the graph.
     */
    addSchema(schema: GraphSchema<P>): this;
    /**
     * Copies the schemas from another graph.
     */
    copySchemas(graph: Graph<P>): boolean;
    /**
     * Imports a link (along with its source and target nodes) into the graph.
     */
    importLink(link: GraphLink<P>): GraphLink<P>;
    /**
     * Imports a node into the graph.
     */
    importNode(node: GraphNode<P>): GraphNode<P>;
    /**
     * Imports a subset of nodes into the graph.
     * @param depth The depth of outgoing links to import.
     */
    importSubset(node: GraphNode<P>, depth: number): GraphNode<P>;
    /**
     * Clears the links and nodes of the graph.
     */
    clear(): void;
    /**
     * Renames a node.
     * @param newId The new id for the node.
     */
    renameNode(node: GraphNode<P>, newId: string): GraphNode<P>;
    /**
     * Renames a node.
     * @param nodeId The id of the node to rename.
     * @param newId The new id for the node.
     */
    renameNode(nodeId: string, newId: string): GraphNode<P> | undefined;
}
```

### See Also
* [GraphObject](graphObject.md)
* [GraphSchema](graphSchema.md)
* [GraphNode](graphNode.md)
* [GraphNodeCollection](graphNodeCollection.md)
* [GraphLink](graphLink.md)
* [GraphLinkCollection](graphLinkCollection.md)
* [API Documentation](index.md)