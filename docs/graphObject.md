<details>
<summary>In This Article</summary>
<li><a href="#graphobject">GraphObject</a></li>
<li><a href="#graphobjectevents">GraphObjectEvents</a></li>
</details>

# GraphObject
```ts
/**
 * The base definition of an extensible graph object.
 */
export declare abstract class GraphObject {
    constructor(owner?: Graph, category?: GraphCategory);
    /**
     * Gets the graph that this object belongs to.
     */
    get owner(): Graph | undefined;
    /**
     * Gets the document schema for this object.
     */
    get schema(): GraphSchema | undefined;
    get isPseudo(): boolean;
    set isPseudo(value: boolean);
    /**
     * Gets the number of categories in the object.
     */
    get categoryCount(): number;
    /**
     * Gets the number of properties in the object.
     */
    get propertyCount(): number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphObjectEvents): EventSubscription;
    /**
     * Determines whether the object has the specified category or categories.
     */
    hasCategory(category: GraphCategoryIdLike | GraphCategory | Iterable<GraphCategory | GraphCategoryIdLike>): boolean;
    /**
     * Determines whether the object has any of the categories in the provided Set.
     * @param match Either `"exact"` to only match any category in the set, or
     * `"inherited"` to match any category or any of its base categories in the set.
     */
    hasCategoryInSet(categories: Iterable<GraphCategory | GraphCategoryIdLike>, match: "exact" | "inherited"): boolean;
    /**
     * Adds a category to the object.
     */
    addCategory(category: GraphCategory): this;
    /**
     * Deletes a category from the object.
     */
    deleteCategory(category: GraphCategory): boolean;
    /**
     * Deletes a category from the object.
     */
    deleteCategory(category: GraphCategoryIdLike): GraphCategory | false;
    /**
     * Deletes a category from the object.
     */
    deleteCategory(category: GraphCategory | GraphCategoryIdLike): GraphCategory | boolean;
    /**
     * Determines whether the object has the specified property or has a category that defines
     * the specified property.
     */
    has(key: GraphPropertyIdLike | GraphProperty): boolean;
    /**
     * Determines whether the object has the specified property.
     */
    hasOwn(property: GraphProperty | GraphPropertyIdLike): boolean;
    /**
     * Gets the value for the specified property.
     */
    get<V>(key: GraphProperty<V>): V | undefined;
    /**
     * Gets the value for the specified property.
     */
    get(key: GraphPropertyIdLike | GraphProperty): any;
    /**
     * Sets the value for the specified property.
     */
    set<V>(key: GraphProperty<V>, value: V | undefined): this;
    /**
     * Sets the value for the specified property.
     */
    set(key: GraphPropertyIdLike | GraphProperty, value: any): this;
    /**
     * Removes the specified property from the object.
     */
    delete(key: GraphPropertyIdLike | GraphProperty): boolean;
    /**
     * Copies the categories of another graph object to this one.
     */
    copyCategories(other: GraphObject): boolean;
    /**
     * Copies the properties and values of another graph object to this one.
     */
    copyProperties(other: GraphObject): boolean;
    /**
     * Creates an iterator for the categories in the object.
     */
    categories(): IterableIterator<GraphCategory>;
    /**
     * Creates an iterator for the properties in the object.
     */
    keys(): IterableIterator<GraphProperty>;
    /**
     * Creates an iterator for the properties in the object.
     */
    values(): IterableIterator<any>;
    /**
     * Creates an iterator for the entries in the object.
     */
    entries(): IterableIterator<[GraphProperty, any]>;
    /**
     * Creates an iterator for the entries in the object.
     */
    [Symbol.iterator](): IterableIterator<[GraphProperty, any]>;
}
```

### See Also
* [EventSubscription](events.md#eventsubscription)
* [GraphObjectEvents](#graphobjectevents)
* [GraphCategory](graphCategory.md#graphcategory)
* [GraphCategoryIdLike](graphCategory.md#graphcategoryidlike)
* [GraphProperty](graphProperty.md#graphproperty)
* [GraphPropertyIdLike](graphProperty.md#graphpropertyidlike)
* [GraphSchema](graphSchema.md#graphschema)
* [Graph](graph.md#graph)
* [API Documentation](index.md)

# GraphObjectEvents
```ts
export interface GraphObjectEvents {
    /**
     * An event raised when a category is added or removed from an object.
     */
    onCategoryChanged?: (change: "add" | "delete", category: GraphCategory) => void;
    /**
     * An event raised when a property changes on the object.
     */
    onPropertyChanged?: (name: GraphPropertyIdLike) => void;
}
```

### See Also
* [GraphCategory](graphCategory.md#graphcategory)
* [GraphPropertyIdLike](graphProperty.md#graphpropertyidlike)
* [API Documentation](index.md)
