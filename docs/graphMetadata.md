# GraphMetadataContainer
```ts
/**
 * Graph metadata defines information about a GraphProperty or GraphCategory.
 */
export declare class GraphMetadata<V = any> extends GraphObject {
    constructor(options?: GraphMetadataOptions<V>);
    /**
     * Gets the default value for a property. Only used for a GraphMetadata associated with a property.
     */
    readonly defaultValue: V | undefined;
    /**
     * Gets the flags that control the behavior of a property or category.
     */
    readonly flags: GraphMetadataFlags;
    /**
     * Gets a value indicating whether the property can be changed once it is set.
     */
    readonly isImmutable: boolean;
    /**
     * Gets a value indicating whether the property can be removed.
     */
    readonly isRemovable: boolean;
    /**
     * Gets a value indicating whether the property can be shared.
     */
    readonly isSharable: boolean;
    /**
     * Creates a copy of the metadata.
     */
    copy(): GraphMetadata<any>;
}
export interface GraphMetadataOptions<V = any> {
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
    properties?: Iterable<[GraphProperty, any]>;
}
export declare const enum GraphMetadataFlags {
    None = 0,
    Immutable = 1,
    Removable = 2,
    Sharable = 32,
    Default = 34,
}
```

### See Also
* [GraphObject](graphObject.md)
* [GraphMetadataContainer](graphMetadataContainer.md)
* [GraphCategoryCollection](graphCategoryCollection.md)
* [GraphPropertyCollection](graphPropertyCollection.md)
* [API Documentation](index.md)