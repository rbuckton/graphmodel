<details>
<summary>In This Article</summary>
<li><a href="#graphpropertycollection">GraphPropertyCollection</a></li>
<li><a href="#graphpropertycollectionevents">GraphPropertyCollectionEvents</a></li>
</details>

# GraphPropertyCollection
```ts
/**
 * A collection of graph properties in a schema.
 */
export declare class GraphPropertyCollection extends BaseCollection<GraphProperty> {
    private constructor();
    /**
     * Gets the schema that owns the collection.
     */
    get schema(): GraphSchema;
    /**
     * Gets the number of properties in the collection.
     */
    get size(): number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphPropertyCollectionEvents): EventSubscription;
    /**
     * Determines whether the collection contains the specified property.
     */
    has(property: GraphProperty | GraphPropertyIdLike): boolean;
    /**
     * Gets the property with the specified id.
     */
    get(id: GraphPropertyIdLike): GraphProperty | undefined;
    /**
     * Gets the property with the specified id. If one does not exist, a new property is created.
     */
    getOrCreate<V = any>(id: GraphPropertyIdLike, metadataFactory?: () => GraphMetadata<V>): GraphProperty<V>;
    /**
     * Gets the property with the specified id. If one does not exist, a new property is created.
     */
    getOrCreate<V = any>(id: GraphPropertyIdLike, dataType?: DataType<V> | readonly DataType<V>[], metadataFactory?: () => GraphMetadata<V>): GraphProperty<V>;
    /**
     * Gets the property with the specified id. If one does not exist, a new property is created.
     */
    getOrCreate<D extends DataTypeNameLike, Q extends string, V extends TypeOfDataTypeName<D, Q> = TypeOfDataTypeName<D, Q>>(id: GraphPropertyIdLike, dataType: D, packageQualifier: Q, metadataFactory?: () => GraphMetadata<V>): GraphProperty<V>;
    /**
     * Gets the property with the specified id. If one does not exist, a new property is created.
     */
    getOrCreate<D extends readonly DataTypeNameLike[], V extends TypeOfDataTypeName<D[number]> = TypeOfDataTypeName<D[number]>>(id: GraphPropertyIdLike, dataType: D, metadataFactory?: () => GraphMetadata<V>): GraphProperty<V>;
    /**
     * Adds a property to the collection.
     */
    add(property: GraphProperty): this;
    /**
     * Removes a property from the collection.
     */
    delete(property: GraphProperty): boolean;
    /**
     * Removes a property from the collection.
     */
    delete(property: GraphPropertyIdLike): GraphProperty | false;
    /**
     * Removes a property from the collection.
     */
    delete(property: GraphProperty | GraphPropertyIdLike): GraphProperty | boolean;
    /**
     * Removes all properties from the collection.
     */
    clear(): void;
    /**
     * Gets the property keys in the collection.
     */
    keys(): IterableIterator<GraphPropertyIdLike>;
    /**
     * Gets the properties in the collection.
     */
    values(propertyIds?: Iterable<GraphPropertyIdLike>): IterableIterator<GraphProperty>;
    /**
     * Gets the property entries in the collection.
     */
    entries(): IterableIterator<[GraphPropertyIdLike, GraphProperty]>;
    /**
     * Gets the properties in the collection.
     */
    [Symbol.iterator](): IterableIterator<GraphProperty>;
}
```

### See Also
* [BaseCollection](baseCollection.md#basecollection)
* [DataType](dataType.md#datatype)
* [DataTypeNameLike](dataType.md#datatypenamelike)
* [EventSubscription](events.md#eventsubscription)
* [GraphMetadata](graphMetadata.md#graphmetadata)
* [GraphProperty](graphProperty.md#graphproperty)
* [GraphPropertyCollectionEvents](#graphpropertycollectionevents)
* [GraphPropertyIdLike](graphProperty.md#graphpropertyidlike)
* [GraphSchema](graphSchema.md#graphschema)
* [Graph](graph.md#graph)
* [TypeOfDataTypeName](dataType.md#typeofdatatypename)
* [API Documentation](index.md)

# GraphPropertyCollection
```ts
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
```

### See Also
* [GraphPropertyCollection](#graphpropertycollection)
* [GraphProperty](graphProperty.md#graphproperty)
* [API Documentation](index.md)
