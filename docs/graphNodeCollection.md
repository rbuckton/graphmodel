<details>
<summary>In This Article</summary>
<li><a href="#graphnodecollection">GraphNodeCollection</a></li>
<li><a href="#graphnodecollectionevents">GraphNodeCollectionEvents</a></li>
</details>

# GraphNodeCollection
```ts
/**
 * A collection of nodes within a Graph.
 */
export declare class GraphNodeCollection extends BaseCollection<GraphNode> {
    private constructor();
    /**
     * Gets the graph to which this collection belongs.
     */
    get graph(): Graph;
    /**
     * Gets the number of nodes in the collection.
     */
    get size(): number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphNodeCollectionEvents): EventSubscription;
    /**
     * Determines whether the collection contains the specified npde.
     */
    has(node: GraphNode | GraphNodeIdLike): boolean;
    /**
     * Gets the node with the provided id.
     */
    get(id: GraphNodeIdLike): GraphNode | undefined;
    /**
     * Gets the node with the provided id. If it does not exist, a new node is created.
     */
    getOrCreate(id: GraphNodeIdLike, category?: GraphCategory): GraphNode;
    /**
     * Adds a node to the collection.
     */
    add(node: GraphNode): this;
    /**
     * Removes a node from the collection.
     */
    delete(node: GraphNode): boolean;
    /**
     * Removes the node with the specified id from the collection.
     */
    delete(node: GraphNodeIdLike): GraphNode | false;
    /**
     * Removes the specified node from the collection.
     */
    delete(node: GraphNode | GraphNodeIdLike): GraphNode | boolean;
    /**
     * Removes all nodes from the collection.
     */
    clear(): void;
    /**
     * Yields each node in the graph that has no incoming links.
     */
    rootNodes(): IterableIterator<GraphNode>;
    /**
     * Yields each node in the graph that has no outgoing links.
     */
    leafNodes(): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for each node with the specified property key and value.
     */
    byProperty<V>(key: GraphProperty<V>, value: V | undefined): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for each node with the specified property key and value.
     */
    byProperty(key: GraphPropertyIdLike | GraphProperty, value: any): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for each node with any of the specified categories.
     */
    byCategory(...categories: (GraphCategoryIdLike | GraphCategory)[]): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for the node ids in the collection.
     */
    keys(): IterableIterator<GraphNodeIdLike>;
    /**
     * Creates an iterator for the values in the collection.
     */
    values(): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for the values in the collection.
     */
    entries(): IterableIterator<[GraphNodeIdLike, GraphNode]>;
    /**
     * Creates an iterator for the values in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphNode>;
}
```

### See Also
* [BaseCollection](baseCollection.md#basecollection)
* [EventSubscription](events.md#eventsubscription)
* [GraphNodeCollectionEvents](#graphnodecollectionevents)
* [GraphNode](graphNode.md#graphnode)
* [GraphNodeIdLike](graphNode.md#graphnodeidlike)
* [GraphCategory](graphCategory.md#graphcategory)
* [GraphCategoryIdLike](graphCategory.md#graphcategoryidlike)
* [GraphProperty](graphProperty.md#graphproperty)
* [Graph](graph.md#graph)
* [API Documentation](index.md)

# GraphNodeCollectionEvents
```ts
export interface GraphNodeCollectionEvents {
    /**
     * An event raised when a node is added to the collection.
     */
    onAdded?: (node: GraphNode) => void;
    /**
     * An event raised when a node is removed from the collection.
     */
    onDeleted?: (node: GraphNode) => void;
}
```
### See Also
* [GraphNode](graphNode.md#graphnode)
* [API Documentation](index.md)
