# GraphProperty
```ts
/**
 * Graph properties are used to annotate graph objects such as nodes or links.
 */
export declare class GraphProperty<P extends object = any, K extends keyof P = keyof P> {
    private constructor();
    /**
     * The unique id of the property.
     */
    readonly id: K;
    /**
     * The underlying data type of the property. This will never have a value and is only used for type checking and type inference purposes.
     */
    readonly ["[[DataType]]"]: P[K];
}
```

### See Also
* [GraphPropertyCollection](graphPropertyCollection.ts)
* [GraphObject](graphObject.ts)
* [Graph](graph.ts)