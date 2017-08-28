# GraphNodeCollection
```ts
/**
 * A collection of nodes within a Graph.
 */
export declare class GraphNodeCollection {
    private constructor();
    /**
     * Gets the graph to which this collection belongs.
     */
    readonly graph: Graph;
    /**
     * Gets the number of nodes in the collection.
     */
    readonly size: number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphNodeCollectionEvents): GraphNodeCollectionSubscription;
    /**
     * Determines whether the collection contains the specified npde.
     */
    has(node: GraphNode): boolean;
    /**
     * Gets the node with the provided id.
     */
    get(id: string): GraphNode | undefined;
    /**
     * Gets the node with the provided id. If it does not exist, a new node is created.
     */
    getOrCreate(id: string, category?: GraphCategory): GraphNode;
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
    delete(nodeId: string): GraphNode;
    /**
     * Removes all nodes from the collection.
     */
    clear(): void;
    /**
     * Creates an iterator for the values in the collection.
     */
    values(): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for the values in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for each node with the specified property key and value.
     */
    byProperty<V>(key: GraphProperty<V>, value: V): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for each node with any of the specified categories.
     */
    byCategory(...categories: GraphCategory[]): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for each node matching the provided callback.
     */
    filter(cb: (node: GraphNode) => boolean): IterableIterator<GraphNode>;
}
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
export interface GraphNodeCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
```

### See Also
* [GraphNode](graphNode.md)
* [GraphCategory](graphCategory.md)
* [GraphProperty](graphProperty.md)
* [Graph](graph.md)
* [API Documentation](index.md)