# GraphLink
```ts
/**
 * Represents a link between two nodes in the graph.
 */
export declare class GraphLink<P extends object = any> extends GraphObject<P> {
    private constructor();
    /**
     * The source of the link.
     */
    readonly source: GraphNode<P>;
    /**
     * The target of the link.
     */
    readonly target: GraphNode<P>;
    /**
     * An optional index for the link (default `0`).
     */
    readonly index: number;
    /**
     * Gets the graph that this object belongs to.
     */
    readonly owner: Graph<P>;
    /**
     * Gets the document schema for this object.
     */
    readonly schema: GraphSchema<P>;
    /**
     * Creates an iterator for the links related to this link.
     * @param searchDirection Either `"source"` to find related links across the incoming links of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how links are traversed and which links are yielded during iteration.
     */
    related(searchDirection: "source" | "target", traversal?: GraphLinkTraversal<P>): IterableIterator<GraphLink<P>>;
}
export interface GraphLinkTraversal<P extends object = any> {
    /**
     * A callback used to determine whether a link should be traversed. If not specified, all links are traversed.
     */
    traverseLink?: (this: void, link: GraphLink<P>) => boolean;
    /**
     * A callback used to determine whether a link should be yielded. If not specified, all links are yielded.
     */
    acceptLink?: (this: void, link: GraphLink<P>) => boolean;
}
```

### See Also
* [GraphObject](graphObject.md)
* [GraphNode](graphNode.md)
* [GraphLinkCollection](graphLinkCollection.md)
* [Graph](graph.md)
* [API Documentation](index.md)