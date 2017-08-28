# GraphMetadataContainer
```ts
/**
 * The base class for an object that can have associated graph metadata.
 */
export declare abstract class GraphMetadataContainer<V = any> {
    constructor(metadataFactory?: () => GraphMetadata<V>);
    /**
     * Creates a new metadata object for the container.
     */
    createDefaultMetadata(): GraphMetadata<V>;
    /**
     * Gets the metadata for this container within a graph.
     */
    getMetadata(owner: Graph): GraphMetadata<V>;
}
```

### See Also
* [GraphMetadata](graphMetadata.md)
* [GraphCategory](graphCategory.md)
* [GraphProperty](graphProperty.md)
* [API Documentation](index.md)