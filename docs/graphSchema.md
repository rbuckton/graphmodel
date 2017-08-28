# GraphSchema
```ts
/**
 * A GraphSchema defines a related set of graph categories and properties.
 */
export declare class GraphSchema {
    constructor(name: string, ...schemas: GraphSchema[]);
    /**
     * Gets the graph that owns the schema.
     */
    readonly graph: Graph | undefined;
    /**
     * Gets the name of the schema.
     */
    readonly name: string;
    /**
     * Gets the child schemas of this schema.
     */
    readonly schemas: GraphSchemaCollection;
    /**
     * Gets the categories defined by this schema.
     */
    readonly categories: GraphCategoryCollection;
    /**
     * Gets the properties defined by this schema.
     */
    readonly properties: GraphPropertyCollection;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphSchemaEvents): GraphSchemaSubscription;
    /**
     * Determines whether this schema contains the provided schema as a child or grandchild.
     */
    hasSchema(schema: GraphSchema): boolean;
    /**
     * Adds a child schema to this schema.
     */
    addSchema(schema: GraphSchema): this;
    /**
     * Creates an iterator for all schemas within this schema (including this schema).
     */
    allSchemas(): IterableIterator<GraphSchema>;
    /**
     * Finds a category in this schema or its descendants.
     */
    findCategory(id: string): GraphCategory | undefined;
    /**
     * Creates an iterator for the categories in this schema or its descendants with the provided ids.
     */
    findCategories(...categoryIds: string[]): IterableIterator<GraphCategory>;
    /**
     * Finds a property in this schema or its descendants.
     */
    findProperty(id: string): GraphProperty | undefined;
    /**
     * Creates an iterator for the properties in this schema or its descendants with the provided ids.
     */
    findProperties(...propertyIds: string[]): IterableIterator<GraphProperty>;
}
export interface GraphSchemaEvents {
    /**
     * An event raised when the schema or one of its child schemas has changed.
     */
    onChanged?: () => void;
}
export interface GraphSchemaSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
```

### See Also
* [GraphCategory](graphCategory.md)
* [GraphProperty](graphProperty.md)
* [GraphSchemaCollection](graphSchemaCollection.md)
* [Graph](graph.md)
* [API Documentation](index.md)