# GraphPropertyCollection
```ts
/**
 * A collection of graph properties in a schema.
 */
export declare class GraphPropertyCollection<P extends object = any> {
    private constructor();
    /**
     * Gets the schema that owns the collection.
     */
    readonly schema: GraphSchema<P>;
    /**
     * Gets the number of properties in the collection.
     */
    readonly size: number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphPropertyCollectionEvents<P>): GraphPropertyCollectionSubscription;
    /**
     * Determines whether the collection contains the specified property.
     */
    has(property: GraphProperty<P>): boolean;
    /**
     * Gets the property with the specified id.
     */
    get<K extends keyof P>(id: K): GraphProperty<P, K> | undefined;
    /**
     * Gets the property with the specified id. If one does not exist, a new property is created.
     */
    getOrCreate<K extends keyof P>(id: K): GraphProperty<P, K>;
    /**
     * Adds a property to the collection.
     */
    add<K extends keyof P>(property: GraphProperty<P, K>): this;
    /**
     * Removes a property from the collection.
     */
    delete(property: GraphProperty): boolean;
    /**
     * Removes all properties from the collection.
     */
    clear(): void;
    /**
     * Gets the properties in the collection.
     */
    values(): IterableIterator<GraphProperty<P, keyof P>>;
    /**
     * Gets the properties in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphProperty<P, keyof P>>;
}
export interface GraphPropertyCollectionEvents<P extends object = any> {
    /**
     * An event raised when a property is added to the collection.
     */
    onAdded?: (category: GraphProperty<P, keyof P>) => void;
    /**
     * An event raised when a property is removed from the collection.
     */
    onDeleted?: (category: GraphProperty<P, keyof P>) => void;
}
export interface GraphPropertyCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
```

### See Also
* [GraphProperty](graphProperty.md)
* [GraphSchema](graphSchema.md)
* [Graph](graph.md)
* [API Documentation](index.md)