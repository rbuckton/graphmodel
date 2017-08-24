# GraphSchema
```ts
/**
 * A GraphSchema defines a related set of graph categories and properties.
 */
export declare class GraphSchema<P extends object = any> {
    constructor(name: string, ...schemas: GraphSchema<P>[]);
    /**
     * Gets the graph that owns the schema.
     */
    readonly graph: Graph<P> | undefined;
    /**
     * Gets the name of the schema.
     */
    readonly name: string;
    /**
     * Gets the child schemas of this schema.
     */
    readonly schemas: GraphSchemaCollection<P>;
    /**
     * Gets the categories defined by this schema.
     */
    readonly categories: GraphCategoryCollection<P>;
    /**
     * Gets the properties defined by this schema.
     */
    readonly properties: GraphPropertyCollection<P>;
    /**
     * The underlying data type for the properties in the schema. This will never have a value and is only used for type checking and type inference purposes.
     */
    readonly ["[[Properties]]"]: P;
    /**
     * Determines whether this schema contains the provided schema as a child or grandchild.
     */
    hasSchema(schema: GraphSchema<P>): boolean;
    /**
     * Adds a child schema to this schema.
     */
    addSchema(schema: GraphSchema<P>): this;
    /**
     * Creates an iterator for all schemas within this schema (including this schema).
     */
    allSchemas(): IterableIterator<GraphSchema<P>>;
    /**
     * Finds a category in this schema or its descendants.
     */
    findCategory(id: string): GraphCategory<P> | undefined;
    /**
     * Creates an iterator for the categories in this schema or its descendants with the provided ids.
     */
    findCategories(...categoryIds: string[]): IterableIterator<GraphCategory<P>>;
    /**
     * Finds a property in this schema or its descendants.
     */
    findProperty<K extends keyof P>(id: K): GraphProperty<P, K> | undefined;
    /**
     * Creates an iterator for the properties in this schema or its descendants with the provided ids.
     */
    findProperties<K extends keyof P>(...propertyIds: K[]): IterableIterator<GraphProperty<P, K>>;
}
```

### See Also
* [GraphCategory](graphCategory.md)
* [GraphProperty](graphProperty.md)
* [GraphSchemaCollection](graphSchemaCollection.md)
* [Graph](graph.md)