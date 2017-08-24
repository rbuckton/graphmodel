# GraphNode
```ts
/**
 * Represents a node in the directed graph.
 */
export declare class GraphNode<P extends object = any> extends GraphObject<P> {
    private constructor();
    /**
     * The unique identifier for the node.
     */
    readonly id: string;
    /**
     * Gets the graph that this object belongs to.
     */
    readonly owner: Graph<P>;
    /**
     * Gets the document schema for this object.
     */
    readonly schema: GraphSchema<P>;
    /**
     * Gets the number of incoming links.
     */
    readonly incomingLinkCount: number;
    /**
     * Gets the number of outgoing links.
     */
    readonly outgoingLinkCount: number;
    /**
     * Gets the number of both incoming and outgoing links.
     */
    readonly linkCount: number;
    /**
     * Creates an iterator for links that have this node as their target.
     */
    incomingLinks(...linkCategories: GraphCategory<P>[]): IterableIterator<GraphLink<P>>;
    /**
     * Creates an iterator for links that have this node as their source.
     */
    outgoingLinks(...linkCategories: GraphCategory<P>[]): IterableIterator<GraphLink<P>>;
    /**
     * Creates an iterator for links that have this node as either their source or their target.
     */
    links(...linkCategories: GraphCategory<P>[]): IterableIterator<GraphLink<P>>;
    /**
     * Finds the first node related to this node.
     * @param searchDirection Either `"source"` to find related links across the incoming links of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how nodes and links are traversed and which node should be returned.
     */
    firstRelated(searchDirection: "source" | "target", traversal?: GraphNodeTraversal<P>): GraphNode<P> | undefined;
    /**
     * Creates an iterator for the nodes related to this node.
     * @param searchDirection Either `"source"` to find related links across the incoming links of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how nodes and links are traversed and which nodes are yielded during iteration.
     */
    related(searchDirection: "source" | "target", {traverseLink, traverseNode, acceptNode}?: GraphNodeTraversal<P>): IterableIterator<GraphNode<P>>;
    /**
     * Creates an iterator for the sources linked to this node.
     * @param linkCategories When specified, links must have at least one of the provided categories.
     */
    sources(...linkCategories: GraphCategory<P>[]): IterableIterator<GraphNode<P>>;
    /**
     * Creates an iterator for the targets linked to this node.
     * @param linkCategories When specified, links must have at least one of the provided categories.
     */
    targets(...linkCategories: GraphCategory<P>[]): IterableIterator<GraphNode<P>>;
    /**
     * Creates a copy of the node (including its links) with a new id.
     */
    copy(newId: string): GraphNode<P>;
}
export interface GraphNodeTraversal<P extends object = any> {
    /**
     * A callback used to determine whether a link should be traversed. If not specified, all links are traversed.
     */
    traverseLink?: (link: GraphLink<P>) => boolean;
    /**
     * A callback used to determine whether a node should be traversed. If not specified, all nodes are traversed.
     */
    traverseNode?: (node: GraphNode<P>) => boolean;
    /**
     * A callback used to determine whether a node should be yielded. If not specified, all nodes are yielded.
     */
    acceptNode?: (node: GraphNode<P>) => boolean;
}
```

### See Also
* [GraphObject](graphObject.md)
* [GraphLink](graphLink.md)
* [GraphCategory](graphCategory.md)
* [GraphNodeCollection](graphNodeCollection.md)
* [Graph](graph.md)
* [API Documentation](index.md)