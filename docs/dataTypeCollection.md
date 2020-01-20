<details>
<summary>In This Article</summary>
<li><a href="#datatypecollection">DataTypeCollection</a></li>
<li><a href="#datatypecollectionevents">DataTypeCollectionEvents</a></li>
</details>

# DataTypeCollection
```ts
/**
 * A collection of graph properties in a schema.
 */
export declare class DataTypeCollection extends BaseCollection<DataType> {
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
    subscribe(events: DataTypeCollectionEvents): EventSubscription;
    /**
     * Determines whether the collection contains the specified data type.
     */
    has(type: DataTypeNameLike, packageQualifier?: string): boolean;
    /**
     * Determines whether the collection contains the specified data type.
     */
    has(type: DataTypeNameLike | DataType): boolean;
    /**
     * Gets the data type with the specified id.
     */
    get(name: DataTypeNameLike, packageQualifier?: string): DataType | undefined;
    /**
     * Gets the data type with the specified name. If one does not exist, a new 
     * data type is created.
     */
    getOrCreate<V = any>(
        name: DataTypeNameLike,
        validator?: ((value: any) => value is V) | ((value: any) => boolean)
    ): DataType<V>;
    /**
     * Gets the data type with the specified name. If one does not exist, a new 
     * data type is created.
     */
    getOrCreate<V = any>(
        name: DataTypeNameLike,
        packageQualifier?: string,
        validator?: ((value: any) => value is V) | ((value: any) => boolean)
    ): DataType<V>;
    /**
     * Gets the data type for the provided class. If one does not exist, a new 
     * data type is created.
     */
    getOrCreateClass<V = any>(ctor: new (...args: any) => V, packageQualifier?: string): DataType<V>;
    /**
     * Adds a data type to the collection.
     */
    add(dataType: DataType): this;
    /**
     * Removes a data type from the collection.
     */
    delete(dataType: DataType): boolean;
    /**
     * Removes a data type from the collection.
     */
    delete(dataType: DataTypeNameLike, packageQualifier?: string): DataType | false;
    /**
     * Removes a data type from the collection.
     */
    delete(dataType: DataType | DataTypeNameLike): DataType | boolean;
    /**
     * Removes all data types from the collection.
     */
    clear(): void;
    /**
     * Gets the data types in the collection.
     */
    values(): IterableIterator<DataType>;
    /**
     * Gets the data types in the collection.
     */
    [Symbol.iterator](): IterableIterator<DataType>;
}
```

### See Also
* [BaseCollection](baseCollection.md)
* [DataType](dataType.md#datatype)
* [DataTypeNameLike](dataType.md#datatypenamelike)
* [DataTypeCollectionEvents](#datatypecollectionevents)
* [EventSubscription](events.md#eventsubscription)
* [GraphSchema](graphSchema.md#graphschema)
* [API Documentation](index.md)

# DataTypeCollectionEvents
```ts
export interface DataTypeCollectionEvents {
    /**
     * An event raised when a data type is added to the collection.
     */
    onAdded?: (type: DataType) => void;
    /**
     * An event raised when a data type is removed from the collection.
     */
    onDeleted?: (type: DataType) => void;
}
```

### See Also
* [DataType](dataType.md#datatype)
* [DataTypeCollection](#datatypecollection)
* [API Documentation](index.md)
