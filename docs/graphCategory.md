<details>
<summary>In This Article</summary>
<li><a href="#graphcategory">GraphCategory</a></li>
<li><a href="#graphcategoryidlike">GraphCategoryIdLike</a></li>
</details>

# GraphCategory
```ts
/**
 * Graph catagories are used to categorize graph objects such as nodes or links.
 */
export declare class GraphCategory extends GraphMetadataContainer {
    /**
     * For internal use only. Instances should be created via 
     * `GraphSchema.categories.getOrCreate()`.
     */
    private constructor();
    /**
     * Gets the unique id of the category.
     */
    get id(): GraphCategoryIdLike;
    /**
     * Gets or sets the category this category is based on.
     */
    get basedOn(): GraphCategory | undefined;
    set basedOn(value: GraphCategory | undefined);
    /**
     * Determines whether this category is based on the specified category.
     */
    isBasedOn(category: GraphCategoryIdLike | GraphCategory): boolean;
}
```

### See Also
* [GraphMetadataContainer](graphMetadataContainer.md)
* [GraphCategoryCollection](graphCategoryCollection.md)
* [GraphObject](graphObject.md)
* [GraphCategoryIdLike](#graphcategoryidlike)
* [Graph](graph.md)
* [API Documentation](index.md)

# GraphCategoryIdLike
```ts
/**
 * Represents a valid id for a category.
 */
export declare type GraphCategoryIdLike = string | symbol;
```

### See Also
* [GraphCategory](#graphcategory)
* [API Documentation](index.md)
