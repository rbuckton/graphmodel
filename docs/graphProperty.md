<details>
<summary>In This Article</summary>
<li><a href="#graphproperty">GraphProperty</a></li>
<li><a href="#graphpropertyidlike">GraphPropertyIdLike</a></li>
</details>

# GraphProperty
```ts
/**
 * Graph properties are used to annotate graph objects such as nodes or links.
 */
export declare class GraphProperty<V = any> extends GraphMetadataContainer<V> {
    private constructor();
    /**
     * The unique id of the property.
     */
    get id(): GraphPropertyIdLike;
    /**
     * Gets the name of the underlying data type for this property;
     */
    get dataType(): DataType<V> | undefined;
}
```

### See Also
* [DataType](dataType.md#datatype)
* [GraphPropertyIdLike](#graphpropertyidlike)
* [GraphMetadataContainer](graphMetadataContainer.md#graphmetadatacontainer)
* [GraphPropertyCollection](graphPropertyCollection.ts#graphpropertycollection)
* [GraphObject](graphObject.ts#graphobject)
* [Graph](graph.ts#graph)
* [API Documentation](index.md)

# GraphPropertyIdLike
```ts
/**
 * Represents a valid value for the id of a GraphProperty.
 */
export declare type GraphPropertyIdLike = string | symbol;
```

### See Also
* [GraphProperty](#graphproperty)
* [API Documentation](index.md)