# GraphSchemaCollection
```ts
/**
 * A collection of child schemas in a schema.
 */
export declare class GraphSchemaCollection<P extends object = any> {
    private constructor();
    /**
     * The schema that owns the collection.
     */
    readonly schema: GraphSchema<P>;
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
    has(schema: GraphSchema<P>): boolean;
    /**
     * Gets the property with the specified name.
     */
    get(name: string): GraphSchema<any> | undefined;
    /**
     * Adds a schema to the collection.
     */
    add(schema: GraphSchema<P>): this;
    /**
     * Gets the schemas in the collection.
     */
    values(): IterableIterator<GraphSchema<any>>;
    /**
     * Gets the schemas in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphSchema<any>>;
}
export interface GraphSchemaCollectionEvents<P extends object = any> {
    /**
     * An event raised when a schema is added to the collection.
     */
    onAdded?: (schema: GraphSchema<P>) => void;
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