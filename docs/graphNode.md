# GraphNode
```ts
/**
 * Represents a node in the directed graph.
 */
export declare class GraphNode extends GraphObject {
    private constructor();
    /**
     * Gets the graph that this object belongs to.
     */
    readonly owner: Graph;
    /**
     * Gets the document schema for this object.
     */
    readonly schema: GraphSchema;
    /**
     * The unique identifier for the node.
     */
    readonly id: string;
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
    incomingLinks(...linkCategories: GraphCategory[]): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for links that have this node as their source.
     */
    outgoingLinks(...linkCategories: GraphCategory[]): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for links that have this node as either their source or their target.
     */
    links(...linkCategories: GraphCategory[]): IterableIterator<GraphLink>;
    /**
     * Finds the first node related to this node.
     * @param searchDirection Either `"source"` to find related links across the incoming links of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how nodes and links are traversed and which node should be returned.
     */
    firstRelated(searchDirection: "source" | "target", traversal?: GraphNodeTraversal): GraphNode | undefined;
    /**
     * Creates an iterator for the nodes related to this node.
     * @param searchDirection Either `"source"` to find related links across the incoming links of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how nodes and links are traversed and which nodes are yielded during iteration.
     */
    related(searchDirection: "source" | "target", {traverseLink, traverseNode, acceptNode}?: GraphNodeTraversal): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for the sources linked to this node.
     * @param linkCategories When specified, links must have at least one of the provided categories.
     */
    sources(...linkCategories: GraphCategory[]): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for the targets linked to this node.
     * @param linkCategories When specified, links must have at least one of the provided categories.
     */
    targets(...linkCategories: GraphCategory[]): IterableIterator<GraphNode>;
    /**
     * Creates a copy of the node (including its links) with a new id.
     */
    copy(newId: string): GraphNode;
}
export interface GraphNodeTraversal {
    /**
     * A callback used to determine whether a link should be traversed. If not specified, all links are traversed.
     */
    traverseLink?: (link: GraphLink) => boolean;
    /**
     * A callback used to determine whether a node should be traversed. If not specified, all nodes are traversed.
     */
    traverseNode?: (node: GraphNode) => boolean;
    /**
     * A callback used to determine whether a node should be yielded. If not specified, all nodes are yielded.
     */
    acceptNode?: (node: GraphNode) => boolean;
}
```

### See Also
* [GraphObject](graphObject.md)
* [GraphLink](graphLink.md)
* [GraphCategory](graphCategory.md)
* [GraphNodeCollection](graphNodeCollection.md)
* [Graph](graph.md)
* [API Documentation](index.md)