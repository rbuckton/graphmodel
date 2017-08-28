# GraphSchemaCollection
```ts
/**
 * A collection of child schemas in a schema.
 */
export declare class GraphSchemaCollection {
    private constructor();
    /**
     * The schema that owns the collection.
     */
    readonly schema: GraphSchema;
    /**
     * Gets the number of schemas in the collection.
     */
    readonly size: number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphSchemaCollectionEvents): GraphSchemaCollectionSubscription;
    /**
     * Determines whether the collection contains the specified schema.
     */
    has(schema: GraphSchema): boolean;
    /**
     * Gets the property with the specified name.
     */
    get(name: string): GraphSchema | undefined;
    /**
     * Adds a schema to the collection.
     */
    add(schema: GraphSchema): this;
    /**
     * Gets the schemas in the collection.
     */
    values(): IterableIterator<GraphSchema>;
    /**
     * Gets the schemas in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphSchema>;
}
export interface GraphSchemaCollectionEvents {
    /**
     * An event raised when a schema is added to the collection.
     */
    onAdded?: (schema: GraphSchema) => void;
}
export interface GraphSchemaCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
```

### See Also
* [GraphSchema](graphSchema.md)
* [Graph](graph.md)
* [API Documentation](index.md)