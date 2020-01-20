<details>
<summary>In This Article</summary>
<li><a href="#graphschema">GraphSchema</a></li>
<li><a href="#graphschemanamelike">GraphSchemaNameLike</a></li>
<li><a href="#graphschemaevents">GraphSchemaEvents</a></li>
</details>

# GraphSchema
```ts
/**
 * A GraphSchema defines a related set of graph categories and properties.
 */
export declare class GraphSchema {
    constructor(name: GraphSchemaNameLike);
    /**
     * Gets the graph that owns the schema.
     */
    get graph(): Graph | undefined;
    /**
     * Gets the name of the schema.
     */
    get name(): GraphSchemaNameLike;
    /**
     * Gets the child schemas of this schema.
     */
    get schemas(): GraphSchemaCollection;
    /**
     * Gets the categories defined by this schema.
     */
    get categories(): GraphCategoryCollection;
    /**
     * Gets the properties defined by this schema.
     */
    get properties(): GraphPropertyCollection;
    /**
     * Gets the data types defined by this schema.
     */
    get dataTypes(): DataTypeCollection;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphSchemaEvents): EventSubscription;
    /**
     * Determines whether this schema contains the provided schema as a child or grandchild.
     */
    hasSchema(schema: GraphSchema | GraphSchemaNameLike): boolean;
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
    findCategory(id: GraphCategoryIdLike): GraphCategory | undefined;
    /**
     * Creates an iterator for the categories in this schema or its descendants with the provided ids.
     */
    findCategories(...categoryIds: GraphCategoryIdLike[]): IterableIterator<GraphCategory>;
    /**
     * Finds a property in this schema or its descendants.
     */
    findProperty(id: GraphPropertyIdLike): GraphProperty | undefined;
    /**
     * Creates an iterator for the properties in this schema or its descendants with the provided ids.
     */
    findProperties(...propertyIds: GraphPropertyIdLike[]): IterableIterator<GraphProperty>;
    /**
     * Finds a data type in this schema or its descendants.
     */
    findDataType(name: DataTypeNameLike, packageQualifier?: string): DataType | undefined;
}
```

### See Also
* [EventSubscription](events.md#eventsubscription)
* [DataType](dataType.md#datatype)
* [DataTypeCollection](dataTypeCollection.md#datatypecollection)
* [DataTypeNameLike](dataType.md#datatypenamelike)
* [GraphCategory](graphCategory.md#graphcategory)
* [GraphCategoryCollection](graphCategoryCollection.md#graphcategorycollection)
* [GraphCategoryIdLike](graphCategory.md#graphcategoryidlike)
* [GraphProperty](graphProperty.md#graphproperty)
* [GraphPropertyCollection](graphPropertyCollection.md#graphpropertycollection)
* [GraphPropertyIdLike](graphProperty.md#graphpropertyidlike)
* [GraphSchemaCollection](graphSchemaCollection.md#graphschemacollection)
* [GraphSchemaEvents](#graphschemaevents)
* [GraphSchemaNameLike](#graphschemanamelike)
* [Graph](graph.md#graph)
* [API Documentation](index.md)

# GraphSchemaNameLike
```ts
/**
 * Represents a valid value for the name of a GraphSchema.
 */
export declare type GraphSchemaNameLike = string | symbol;
```

### See Also
* [GraphSchema](#graphschema)
* [API Documentation](index.md)

# GraphSchemaEvents
```ts
export interface GraphSchemaEvents {
    /**
     * An event raised when the schema or one of its child schemas has changed.
     */
    onChanged?: () => void;
}
```

### See Also
* [GraphSchema](#graphschema)
* [API Documentation](index.md)
