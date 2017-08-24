# GraphNodeCollection
```ts
/**
 * A collection of nodes within a Graph.
 */
export declare class GraphNodeCollection<P extends object = any> {
    private constructor();
    /**
     * Gets the graph to which this collection belongs.
     */
    readonly graph: Graph<P>;
    /**
     * Gets the number of nodes in the collection.
     */
    readonly size: number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphNodeCollectionEvents<P>): GraphNodeCollectionSubscription;
    /**
     * Determines whether the collection contains the specified npde.
     */
    has(node: GraphNode<P>): boolean;
    /**
     * Gets the node with the provided id.
     */
    get(id: string): GraphNode<P> | undefined;
    /**
     * Gets the node with the provided id. If it does not exist, a new node is created.
     */
    getOrCreate(id: string, category?: GraphCategory<P>): GraphNode<P>;
    /**
     * Adds a node to the collection.
     */
    add(node: GraphNode<P>): this;
    /**
     * Removes a node from the collection.
     */
    delete(node: GraphNode<P>): boolean;
    /**
     * Removes the node with the specified id from the collection.
     */
    delete(nodeId: string): GraphNode<P>;
    /**
     * Removes all nodes from the collection.
     */
    clear(): void;
    /**
     * Creates an iterator for the values in the collection.
     */
    values(): IterableIterator<GraphNode<P>>;
    /**
     * Creates an iterator for the values in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphNode<P>>;
    /**
     * Creates an iterator for each node with the specified property key and value.
     */
    byProperty<K extends keyof P>(key: K | GraphProperty<P, K>, value: P[K]): IterableIterator<GraphNode<P>>;
    /**
     * Creates an iterator for each node with any of the specified categories.
     */
    byCategory(...categories: GraphCategory<P>[]): IterableIterator<GraphNode<P>>;
    /**
     * Creates an iterator for each node matching the provided callback.
     */
    filter(cb: (node: GraphNode<P>) => boolean): IterableIterator<GraphNode<P>>;
}
export interface GraphNodeCollectionEvents<P extends object = any> {
    /**
     * An event raised when a node is added to the collection.
     */
    onAdded?: (node: GraphNode<P>) => void;
    /**
     * An event raised when a node is removed from the collection.
     */
    onDeleted?: (node: GraphNode<P>) => void;
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