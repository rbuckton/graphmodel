# GraphLinkCollection
```ts
/**
 * A collection of links within a Graph.
 */
export declare class GraphLinkCollection {
    private constructor();
    /**
     * Gets the graph to which this collection belongs.
     */
    readonly graph: Graph;
    /**
     * Gets the number of links in the collection.
     */
    readonly size: number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphLinkCollectionEvents): GraphLinkCollectionSubscription;
    /**
     * Determines whether the collection contains the specified link.
     */
    has(link: GraphLink): boolean;
    /**
     * Gets the link for the provided source and target.
     */
    get(sourceId: string, targetId: string, index?: number): GraphLink | undefined;
    /**
     * Gets the link for the provided source and target. If one is not found, a new link is created.
     */
    getOrCreate(source: string | GraphNode, target: string | GraphNode, index?: number): GraphLink;
    /**
     * Gets the link for the provided source and target. If one is not found, a new link is created.
     */
    getOrCreate(source: string | GraphNode, target: string | GraphNode, category: GraphCategory): GraphLink;
    /**
     * Adds a link to the collection.
     */
    add(link: GraphLink): this;
    /**
     * Removes a link from the collection.
     */
    delete(link: GraphLink): boolean;
    /**
     * Removes the link with the specified source, target, and category from the collection.
     */
    delete(sourceId: string, targetId: string, category: GraphCategory): GraphLink;
    /**
     * Removes all links from the collection.
     */
    clear(): void;
    /**
     * Creates an iterator for the values in the collection.
     */
    values(): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for the values in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each link between a source and a target node.
     */
    between(source: GraphNode, target: GraphNode): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each incoming link to a node.
     */
    to(node: string | GraphNode, ...categories: GraphCategory[]): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each outgoing link from a node.
     */
    from(node: string | GraphNode, ...categories: GraphCategory[]): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each node with the specified property key and value.
     */
    byProperty<V>(key: GraphProperty<V>, value: V): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for each link with any of the specified categories.
     */
    byCategory(...categories: GraphCategory[]): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each link matching the provided callback.
     */
    filter(cb: (link: GraphLink) => boolean): IterableIterator<GraphLink>;
}
export interface GraphLinkCollectionEvents {
    /**
     * An event raised when a link is added to the collection.
     */
    onAdded?: (this: void, link: GraphLink) => void;
    /**
     * An event raised when a link is removed from the collection.
     */
    onDeleted?: (this: void, link: GraphLink) => void;
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
* [API Documentation](index.md)