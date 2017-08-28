# GraphPropertyCollection
```ts
/**
 * A collection of graph properties in a schema.
 */
export declare class GraphPropertyCollection {
    private constructor();
    /**
     * Gets the schema that owns the collection.
     */
    readonly schema: GraphSchema;
    /**
     * Gets the number of properties in the collection.
     */
    readonly size: number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphPropertyCollectionEvents): GraphPropertyCollectionSubscription;
    /**
     * Determines whether the collection contains the specified property.
     */
    has(property: GraphProperty): boolean;
    /**
     * Gets the property with the specified id.
     */
    get(id: string): GraphProperty | undefined;
    /**
     * Gets the property with the specified id. If one does not exist, a new property is created.
     */
    getOrCreate<V = any>(id: string): GraphProperty<V>;
    /**
     * Adds a property to the collection.
     */
    add(property: GraphProperty): this;
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
    values(propertyIds?: Iterable<string>): IterableIterator<GraphProperty>;
    /**
     * Gets the properties in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphProperty>;
}
export interface GraphPropertyCollectionEvents {
    /**
     * An event raised when a property is added to the collection.
     */
    onAdded?: (category: GraphProperty) => void;
    /**
     * An event raised when a property is removed from the collection.
     */
    onDeleted?: (category: GraphProperty) => void;
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