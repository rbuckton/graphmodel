<details>
<summary>In This Article</summary>
<li><a href="#graphnode">GraphNode</a></li>
<li><a href="#graphnodeidlike">GraphNodeIdLike</a></li>
<li><a href="#graphnodetraversal">GraphNodeTraversal</a></li>
</details>

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
    get owner(): Graph;
    /**
     * Gets the document schema for this object.
     */
    get schema(): GraphSchema;
    /**
     * The unique identifier for the node.
     */
    get id(): GraphNodeIdLike;
    /**
     * Gets a value indicating whether this node is a container (i.e., has any outgoing containment links).
     */
    get isContainer(): boolean;
    /**
     * Gets a value indicating whether this node is contained by another node (i.e., has any incoming containment links).
     */
    get isContained(): boolean;
    /**
     * Gets or sets a descriptive label to associate with this node.
     */
    get label(): string | undefined;
    set label(label: string | undefined);
    /**
     * Gets the number of incoming links.
     */
    get incomingLinkCount(): number;
    /**
     * Gets the number of outgoing links.
     */
    get outgoingLinkCount(): number;
    /**
     * Gets the number of both incoming and outgoing links.
     */
    get linkCount(): number;
    /**
     * Creates an iterator for links that have this node as their target.
     */
    incomingLinks(...linkCategories: GraphCategory[]): IterableIterator<GraphLink>;
    /**
     * Returns `true` if the node has at least one incoming link with one of the provided
     * categories; otherwise, `false`.
     */
    hasIncomingLinks(...linkCategories: GraphCategory[]): boolean;
    /**
     * Gets an incoming link from a source node to this node, if one exists.
     */
    getIncomingLink(source: GraphNodeIdLike | GraphNodeIdLike, index?: number): GraphLink | undefined;
    /**
     * Deletes any incoming links to this node that have any of the provided categories.
     * If no categories are provided, all incoming links are deleted.
     * @returns The number of links that were deleted.
     */
    deleteIncomingLinks(...linkCategories: GraphCategory[]): number;
    /**
     * Creates an iterator for links that have this node as their source.
     */
    outgoingLinks(...linkCategories: GraphCategory[]): IterableIterator<GraphLink>;
    /**
     * Returns `true` if the node has at least one outgoing link with one of the provided
     * categories; otherwise, `false`.
     */
    hasOutgoingLinks(...linkCategories: GraphCategory[]): boolean;
    /**
     * Gets an outgoing link from this node to a target node, if one exists.
     */
    getOutgoingLink(target: GraphNodeIdLike | GraphNodeIdLike, index?: number): GraphLink | undefined;
    /**
     * Deletes any outgoing links from this node that have any of the provided categories.
     * If no categories are provided, all outgoing links are deleted.
     * @returns The number of links that were deleted.
     */
    deleteOutgoingLinks(...linkCategories: GraphCategory[]): number;
    /**
     * Creates an iterator for links that have this node as either their source or their target.
     */
    links(...linkCategories: GraphCategory[]): IterableIterator<GraphLink>;
    /**
     * Deletes any links to or from this node that have any of the provided categories.
     * If no categories are provided, all links are deleted.
     * @returns The number of links that were deleted.
     */
    deleteLinks(...linkCategories: GraphCategory[]): number;
    /**
     * Removes this node from the graph.
     */
    deleteSelf(): boolean;
    /**
     * Finds the first node related to this node.
     * @param searchDirection Either `"source"` to find related links across the incoming links
     * of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how nodes and links
     * are traversed and which node should be returned.
     */
    firstRelated(searchDirection: "source" | "target", traversal?: GraphNodeTraversal): GraphNode | undefined;
    /**
     * Creates an iterator for the nodes related to this node.
     * @param searchDirection Either `"source"` to find related links across the incoming links
     * of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how nodes and links
     * are traversed and which nodes are yielded during iteration.
     */
    related(searchDirection: "source" | "target", traversal?: GraphNodeTraversal): IterableIterator<GraphNode>;
    /**
     * Yields each node that either contains this node (if `searchDirection` is `"source"`), or is
     * contained by this node (if `searchDirection` is `"target"`).
     */
    relatedContainmentNodes(searchDirection: "source" | "target"): IterableIterator<GraphNode>;
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
     * Yields each node that contains this node
     */
    ancestors(): IterableIterator<GraphNode>;
    /**
     * Yields each node this node contains
     */
    descendants(): IterableIterator<GraphNode>;
    /**
     * Walks all incoming links to this node to determine if there are any circularities.
     * @param linkCategory The category of links to traverse.
     */
    hasCircularity(...linkCategories: GraphCategory[]): boolean;
    /**
     * Creates a copy of the node (including its links) with a new id.
     */
    copy(newId: GraphNodeIdLike): GraphNode;
}
```

### See Also
* [GraphNodeIdLike](#graphnodeidlike)
* [GraphNodeTraversal](#graphnodetraversal)
* [GraphObject](graphObject.md#graphobject)
* [GraphLink](graphLink.md#graphlink)
* [GraphCategory](graphCategory.md#graphcategory)
* [GraphNodeCollection](graphNodeCollection.md#graphnodecollection)
* [Graph](graph.md#graph)
* [API Documentation](index.md)

# GraphNodeIdLike
```ts
/**
 * Represents a valid value for the id of a GraphNode.
 */
export declare type GraphNodeIdLike = string | symbol;
```

### See Also
* [GraphNode](#graphnode)
* [API Documentation](index.md)

# GraphNodeTraversal
```ts
export interface GraphNodeTraversal {
    /**
     * A callback used to determine whether a link should be traversed.
     * If not specified, all links are traversed.
     */
    traverseLink?: (link: GraphLink) => boolean;
    /**
     * A callback used to determine whether a node should be traversed.
     * If not specified, all nodes are traversed.
     */
    traverseNode?: (node: GraphNode) => boolean;
    /**
     * A callback used to determine whether a node should be yielded.
     * If not specified, all nodes are yielded.
     */
    acceptNode?: (node: GraphNode) => boolean;
}
```

### See Also
* [GraphNode](#graphnode)
* [GraphLink](graphLink.md#graphlink)
* [API Documentation](index.md)
