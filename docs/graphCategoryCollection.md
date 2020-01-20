<details>
<summary>In This Article</summary>
<li><a href="#graphcategorycollection">GraphCategoryCollection</a></li>
<li><a href="#graphcategorycollectionevents">GraphCategoryCollectionEvents</a></li>
</details>

# GraphCategoryCollection
```ts
/**
 * A collection of graph categories in a schema.
 */
export declare class GraphCategoryCollection extends BaseCollection<GraphCategory> {
    private constructor();
    /**
     * Gets the schema that owns the collection.
     */
    get schema(): GraphSchema;
    /**
     * Gets the number of categories in the collection.
     */
    get size(): number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphCategoryCollectionEvents): EventSubscription;
    /**
     * Determines whether the collection contains the specified category.
     */
    has(category: GraphCategory | GraphCategoryIdLike): boolean;
    /**
     * Gets the category with the provided id.
     */
    get(id: GraphCategoryIdLike): GraphCategory | undefined;
    /**
     * Gets the category with the provided id. If one does not exist, a new category is created.
     */
    getOrCreate(id: GraphCategoryIdLike, metadataFactory?: () => GraphMetadata): GraphCategory;
    /**
     * Adds a category to the collection.
     */
    add(category: GraphCategory): this;
    /**
     * Removes a category from the collection.
     */
    delete(category: GraphCategory): boolean;
    /**
     * Removes a category from the collection.
     */
    delete(category: GraphCategoryIdLike): GraphCategory | false;
    /**
     * Removes a category from the collection.
     */
    delete(category: GraphCategory | GraphCategoryIdLike): GraphCategory | boolean;
    /**
     * Removes all categories from the collection.
     */
    clear(): void;
    /**
     * Creates an iterator for the values in the collection.
     */
    values(categoryIds?: Iterable<GraphCategoryIdLike>): IterableIterator<GraphCategory>;
    /**
     * Creates an iterator for the categories in the collection based on the provided base category.
     */
    basedOn(base: GraphCategory | GraphCategoryIdLike): IterableIterator<GraphCategory>;
    /**
     * Creates an iterator for the values in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphCategory>;
}
```

### See Also
* [BaseCollection](baseCollection.md#basecollection)
* [EventSubscription](events.md#eventsubscription)
* [GraphCategory](graphCategory.md#graphcategory)
* [GraphCategoryIdLike](graphCategory.md#graphcategoryidlike)
* [GraphCategoryCollectionEvents](#graphcategorycollectionevents)
* [GraphSchema](graphSchema.md#graphschema)
* [Graph](graph.md#graph)
* [API Documentation](index.md)

# GraphCategoryCollectionEvents
```ts
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
```

### See Also
* [GraphCategory](graphCategory.md#graphcategory)
* [GraphCategoryCollection](#graphcategorycollection)
* [API Documentation](index.md)
