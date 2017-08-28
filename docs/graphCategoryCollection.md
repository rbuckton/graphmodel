# GraphCategoryCollection
```ts
/**
 * A collection of graph categories in a schema.
 */
export declare class GraphCategoryCollection {
    private constructor();
    /**
     * Gets the schema that owns the collection.
     */
    readonly schema: GraphSchema;
    /**
     * Gets the number of categories in the collection.
     */
    readonly size: number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphCategoryCollectionEvents): GraphCategoryCollectionSubscription;
    /**
     * Determines whether the collection contains the specified category.
     */
    has(category: GraphCategory): boolean;
    /**
     * Gets the category with the provided id.
     */
    get(id: string): GraphCategory | undefined;
    /**
     * Gets the category with the provided id. If one does not exist, a new category is created.
     */
    getOrCreate(id: string): GraphCategory;
    /**
     * Adds a category to the collection.
     */
    add(category: GraphCategory): this;
    /**
     * Removes a category from the collection.
     */
    delete(category: GraphCategory): boolean;
    /**
     * Removes all categories from the collection.
     */
    clear(): void;
    /**
     * Creates an iterator for the values in the collection.
     */
    values(categoryIds?: Iterable<string>): IterableIterator<GraphCategory>;
    /**
     * Creates an iterator for the values in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphCategory>;
    /**
     * Creates an iterator for the categories in the collection based on the provided base category.
     */
    basedOn(base: GraphCategory): IterableIterator<GraphCategory>;
}
export interface GraphCategoryCollectionEvents {
    /**
     * An event raised when a category is added to the collection.
     */
    onAdded?: (category: GraphCategory) => void;
    /**
     * An event raised when a category is removed from the collection.
     */
    onDeleted?: (category: GraphCategory) => void;
}
export interface GraphCategoryCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
```

### See Also
* [GraphCategory](graphCategory.md)
* [GraphSchema](graphSchema.md)
* [Graph](graph.md)
* [API Documentation](index.md)