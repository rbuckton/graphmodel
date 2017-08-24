# GraphLinkCollection
```ts
/**
 * A collection of links within a Graph.
 */
export declare class GraphLinkCollection<P extends object = any> {
    private constructor();
    /**
     * Gets the graph to which this collection belongs.
     */
    readonly graph: Graph<P>;
    /**
     * Gets the number of links in the collection.
     */
    readonly size: number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphLinkCollectionEvents<P>): GraphLinkCollectionSubscription;
    /**
     * Determines whether the collection contains the specified link.
     */
    has(link: GraphLink<P>): boolean;
    /**
     * Gets the link for the provided source and target.
     */
    get(sourceId: string, targetId: string, index?: number): GraphLink<P> | undefined;
    /**
     * Gets the link for the provided source and target. If one is not found, a new link is created.
     */
    getOrCreate(source: string | GraphNode<P>, target: string | GraphNode<P>, index?: number): GraphLink<P>;
    /**
     * Gets the link for the provided source and target. If one is not found, a new link is created.
     */
    getOrCreate(source: string | GraphNode<P>, target: string | GraphNode<P>, category: GraphCategory<P>): GraphLink<P>;
    /**
     * Adds a link to the collection.
     */
    add(link: GraphLink<P>): this;
    /**
     * Removes a link from the collection.
     */
    delete(link: GraphLink<P>): boolean;
    /**
     * Removes the link with the specified source, target, and category from the collection.
     */
    delete(sourceId: string, targetId: string, category: GraphCategory<P>): GraphLink<P>;
    /**
     * Removes all links from the collection.
     */
    clear(): void;
    /**
     * Creates an iterator for the values in the collection.
     */
    values(): IterableIterator<GraphLink<P>>;
    /**
     * Creates an iterator for the values in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphLink<P>>;
    /**
     * Creates an iterator for each link between a source and a target node.
     */
    between(source: GraphNode<P>, target: GraphNode<P>): IterableIterator<GraphLink<P>>;
    /**
     * Creates an iterator for each incoming link to a node.
     */
    to(node: string | GraphNode<P>, ...categories: GraphCategory<P>[]): IterableIterator<GraphLink<P>>;
    /**
     * Creates an iterator for each outgoing link from a node.
     */
    from(node: string | GraphNode<P>, ...categories: GraphCategory<P>[]): IterableIterator<GraphLink<P>>;
    /**
     * Creates an iterator for each link with the specified property key and value.
     */
    byProperty<K extends keyof P>(key: K | GraphProperty<P, K>, value: P[K]): IterableIterator<GraphLink<P>>;
    /**
     * Creates an iterator for each link with any of the specified categories.
     */
    byCategory(...categories: GraphCategory<P>[]): IterableIterator<GraphLink<P>>;
    /**
     * Creates an iterator for each link matching the provided callback.
     */
    filter(cb: (link: GraphLink<P>) => boolean): IterableIterator<GraphLink<P>>;
}
export interface GraphLinkCollectionEvents<P extends object = any> {
    /**
     * An event raised when a link is added to the collection.
     */
    onAdded?: (this: void, link: GraphLink<P>) => void;
    /**
     * An event raised when a link is removed from the collection.
     */
    onDeleted?: (this: void, link: GraphLink<P>) => void;
}
export interface GraphLinkCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
```

### See Also
* [GraphLink](graphLink.md)
* [GraphNode](graphNode.md)
* [GraphCategory](graphCategory.md)
* [GraphProperty](graphProperty.md)
* [Graph](graph.md)