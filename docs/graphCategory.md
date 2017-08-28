# GraphCategory
```ts
/**
 * Graph catagories are used to categorize graph objects such as nodes or links.
 */
export declare class GraphCategory {
    private constructor();
    /**
     * Gets the unique id of the category.
     */
    readonly id: string;
    /**
     * Gets or sets the category this category is based on.
     */
    basedOn: GraphCategory | undefined;
    /**
     * Determines whether this category is based on the specified category.
     */
    isBasedOn(category: string | GraphCategory): boolean;
}
```

### See Also
* [GraphCategoryCollection](graphCategoryCollection.md)
* [GraphObject](graphObject.md)
* [Graph](graph.md)
* [API Documentation](index.md)