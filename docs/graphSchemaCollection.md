<details>
<summary>In This Article</summary>
<li><a href="#graphschemacollection">GraphSchemaCollection</a></li>
<li><a href="#graphschemacollectionevents">GraphSchemaCollectionEvents</a></li>
</details>

# GraphSchemaCollection
```ts
/**
 * A collection of child schemas in a schema.
 */
export declare class GraphSchemaCollection extends BaseCollection<GraphSchema> {
    private constructor();
    /**
     * Gets the schema that owns the collection.
     */
    get schema(): GraphSchema;
    /**
     * Gets the number of schemas in the collection.
     */
    get size(): number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphSchemaCollectionEvents): EventSubscription;
    /**
     * Determines whether the collection contains the specified schema.
     */
    has(schema: GraphSchema | GraphSchemaNameLike): boolean;
    /**
     * Gets the property with the specified name.
     */
    get(name: GraphSchemaNameLike): GraphSchema | undefined;
    /**
     * Adds a schema to the collection.
     */
    add(schema: GraphSchema): this;
    /**
     * Gets the schema names in the collection.
     */
    keys(): IterableIterator<GraphSchemaNameLike>;
    /**
     * Gets the schemas in the collection.
     */
    values(): IterableIterator<GraphSchema>;
    /**
     * Gets the schemas in the collection.
     */
    entries(): IterableIterator<[GraphSchemaNameLike, GraphSchema]>;
    /**
     * Gets the schemas in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphSchema>;
}
```

### See Also
* [BaseCollection](baseCollection.md#basecollection)
* [EventSubscription](events.md#eventsubscription)
* [GraphSchema](graphSchema.md#graphschema)
* [GraphSchemaNameLike](graphSchema.md#graphschemanamelike)
* [Graph](graph.md#graph)
* [API Documentation](index.md)

# GraphSchemaCollectionEvents
```ts
export interface GraphSchemaCollectionEvents {
    /**
     * An event raised when a schema is added to the collection.
     */
    onAdded?: (schema: GraphSchema) => void;
}
```

### See Also
* [GraphSchema](graphSchema.md#graphschema)
* [GraphSchemaCollection](#graphschemacollection)
* [API Documentation](index.md)
