<details>
<summary>In This Article</summary>
<li><a href="#graphmetadata">GraphMetadata</a></li>
<li><a href="#graphmetadataoptions">GraphMetadataOptions</a></li>
<li><a href="#graphmetadataflags">GraphMetadataFlags</a></li>
</details>

# GraphMetadata
```ts
/**
 * Graph metadata defines information about a GraphProperty or GraphCategory.
 */
export declare class GraphMetadata<V = any> extends GraphObject {
    constructor(options?: GraphMetadataOptions<V>);
    /**
     * Gets or sets a descriptive label for the property.
     */
    get label(): string;
    set label(value: string);
    /**
     * Gets or sets a description for the property.
     */
    get description(): string;
    set description(value: string);
    /**
     * Gets or sets a group for the property.
     */
    get group(): string;
    set group(value: string);
    /**
     * Gets or sets the default value for a property. Only used for a GraphMetadata associated with a property.
     */
    get defaultValue(): V | undefined;
    set defaultValue(value: V | undefined);
    /**
     * Gets or sets the flags that control the behavior of a property or category.
     */
    get flags(): GraphMetadataFlags;
    set flags(flags: GraphMetadataFlags);
    /**
     * Gets a value indicating whether the property can be changed once it is set.
     */
    get isImmutable(): boolean;
    /**
     * Gets a value indicating whether the property can be removed.
     */
    get isRemovable(): boolean;
    /**
     * Gets a value indicating whether the property can be serialized.
     */
    get isSerializable(): boolean;
    /**
     * Gets a value indicating whether the property can be shared.
     */
    get isSharable(): boolean;
    /**
     * Creates a copy of the metadata.
     */
    copy(): GraphMetadata<V>;
}
```

### See Also
* [GraphObject](graphObject.md#graphobject)
* [GraphMetadataOptions](#graphmetadataoptions)
* [GraphMetadataFlags](#graphmetadataflags)
* [GraphMetadataContainer](graphMetadataContainer.md#graphmetadatacontainer)
* [GraphCategoryCollection](graphCategoryCollection.md#graphcategorycollection)
* [GraphPropertyCollection](graphPropertyCollection.md#graphpropertycollection)
* [API Documentation](index.md)

# GraphMetadataOptions
```ts
export interface GraphMetadataOptions<V = any> {
    /**
     * A descriptive label for the property.
     */
    label?: string;
    /**
     * A description for the property.
     */
    description?: string;
    /**
     * A group for the property.
     */
    group?: string;
    /**
     * The default value for a graph property. Only used for a GraphMetadata associated with a property.
     */
    defaultValue?: V;
    /**
     * Flags that control the behavior of a property or category.
     */
    flags?: GraphMetadataFlags;
    /**
     * Properties to define on the metadata object. Only used for a GraphMetadata associated with a category.
     */
    properties?: Iterable<readonly [GraphProperty, any]>;
}
```

### See Also
* [GraphMetadata](#graphmetadata)
* [GraphMetadataFlags](#graphmetadataflags)
* [GraphProperty](graphProperty.md#graphproperty)
* [API Documentation](index.md)

# GraphMetadataFlags
```ts
export declare const enum GraphMetadataFlags {
    None = 0,
    Immutable = 1,
    Removable = 2,
    Sharable = 32,
    Default = Removable | Sharable | Serializable,
}
```

### See Also
* [GraphMetadata](#graphmetadata)
* [GraphMetadataOptions](#graphmetadataoptions)
* [API Documentation](index.md)
