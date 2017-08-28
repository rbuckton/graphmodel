# GraphProperty
```ts
/**
 * Graph properties are used to annotate graph objects such as nodes or links.
 */
export declare class GraphProperty<V = any> {
    private constructor();
    /**
     * The unique id of the property.
     */
    readonly id: string;
    /**
     * The underlying data type of the property. This will never have a value and is only used for type checking and type inference purposes.
     */
    readonly ["[[DataType]]"]: V;
}
```

### See Also
* [GraphPropertyCollection](graphPropertyCollection.ts)
* [GraphObject](graphObject.ts)
* [Graph](graph.ts)
* [API Documentation](index.md)