<details>
<summary>In This Article</summary>
<li><a href="#graphlinkcollection">GraphLinkCollection</a></li>
<li><a href="#graphlinkcollectionevents">GraphLinkCollectionEvents</a></li>
</details>

# GraphLinkCollection
```ts
/**
 * A collection of links within a Graph.
 */
export declare class GraphLinkCollection extends BaseCollection<GraphLink> {
    private constructor();
    /**
     * Gets the graph to which this collection belongs.
     */
    get graph(): Graph;
    /**
     * Gets the number of links in the collection.
     */
    get size(): number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphLinkCollectionEvents): EventSubscription;
    /**
     * Determines whether the collection contains the specified link.
     */
    has(link: GraphLink): boolean;
    /**
     * Gets the link for the provided source and target.
     */
    get(source: GraphNode | GraphNodeIdLike, target: GraphNode | GraphNodeIdLike, index?: number): GraphLink | undefined;
    /**
     * Gets the link for the provided source and target. If one is not found, a new link
     * is created.
     */
    getOrCreate(source: GraphNodeIdLike | GraphNode, target: GraphNodeIdLike | GraphNode, index?: number): GraphLink;
    /**
     * Gets the link for the provided source and target. If one is not found, a new link
     * is created.
     */
    getOrCreate(source: GraphNodeIdLike | GraphNode, target: GraphNodeIdLike | GraphNode, category: GraphCategory): GraphLink;
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
    delete(sourceId: GraphNodeIdLike, targetId: GraphNodeIdLike, category: GraphCategory): GraphLink | false;
    /**
     * Removes all links from the collection.
     */
    clear(): void;
    /**
     * Creates an iterator for each link between a source and a target node.
     */
    between(source: GraphNode, target: GraphNode): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each incoming link to a node.
     */
    to(node: GraphNodeIdLike | GraphNode, ...linkCategories: (GraphCategory | GraphCategoryIdLike)[]): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each outgoing link from a node.
     */
    from(node: GraphNodeIdLike | GraphNode, ...linkCategories: (GraphCategory | GraphCategoryIdLike)[]): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each link with the specified property key and value.
     */
    byProperty<V>(key: GraphProperty<V>, value: V): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each link with the specified property key and value.
     */
    byProperty(key: GraphPropertyIdLike | GraphProperty, value: any): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each link with any of the specified categories.
     */
    byCategory(...linkCategories: (GraphCategory | GraphCategoryIdLike)[]): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for the values in the collection.
     */
    values(): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for the values in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphLink>;
}
```

### See Also
* [BaseCollection](baseCollection.md#basecollection)
* [EventSubscription](events.md#eventsubscription)
* [GraphLink](graphLink.md#graphlink)
* [GraphLinkCollectionEvents](#graphlinkcollectionevents)
* [GraphNode](graphNode.md#graphnode)
* [GraphNodeIdLike](graphNode.md#graphnodeidlike)
* [GraphCategory](graphCategory.md#graphcategory)
* [GraphCategoryIdLike](graphCategory.md#graphcategoryidlike)
* [GraphProperty](graphProperty.md#graphproperty)
* [GraphPropertyIdLike](graphProperty.md#graphpropertyidlike)
* [Graph](graph.md#graph)
* [API Documentation](index.md)

# GraphLinkCollectionEvents
```ts
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
```

### See Also
* [GraphLink](graphLink.md#graphlink)
* [GraphLinkCollection](#graphlinkcollection)
* [API Documentation](index.md)
