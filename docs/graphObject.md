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
    readonly owner: Graph | undefined;
    /**
     * Gets the document schema for this object.
     */
    readonly schema: GraphSchema | undefined;
    /**
     * Gets the number of categories in the object.
     */
    readonly categoryCount: number;
    /**
     * Gets the number of properties in the object.
     */
    readonly propertyCount: number;
    /**
     * Creates a subscription for a set of named events.
     */
    subscribe(events: GraphObjectEvents): GraphObjectSubscription;
    /**
     * Determines whether the object has the specified category or categories.
     */
    hasCategory(category: string | GraphCategory | Iterable<GraphCategory>): boolean;
    /**
     * Determines whether the object has any of the categories in the provided Set.
     * @param match Either `"exact"` to only match any category in the set, or `"inherited"` to match any category or any of its base categories in the set.
     */
    hasCategoryInSet(categorySet: ReadonlySet<GraphCategory>, match: "exact" | "inherited"): boolean;
    /**
     * Adds a category to the object.
     */
    addCategory(category: GraphCategory): this;
    /**
     * Deletes a category from the object.
     */
    deleteCategory(category: GraphCategory): boolean;
    /**
     * Determines whether the object has the specified property.
     */
    has(key: string | GraphProperty): boolean;
    /**
     * Gets the value for the specified property.
     */
    get<V>(key: GraphProperty<V>): V | undefined;
    get(key: string | GraphProperty): any;
    /**
     * Sets the value for the specified property.
     */
    set<V>(key: GraphProperty<V>, value: V | undefined): this;
    set(key: string | GraphProperty, value: any): this;
    /**
     * Removes the specified property from the object.
     */
    delete(key: string | GraphProperty): boolean;
    /**
     * Copies the categories of another graph object to this one.
     */
    copyCategories(other: GraphObject): boolean;
    /**
     * Copies the properties and values of another graph object to this one.
     */
    copyProperties(other: GraphObject): boolean;
    /**
     * Creates an iterator for the properties in the object.
     */
    keys(): IterableIterator<GraphProperty>;
    /**
     * Creates an iterator for the entries in the object.
     */
    entries(): IterableIterator<[GraphProperty, any]>;
    /**
     * Creates an iterator for the categories in the object.
     */
    categories(): IterableIterator<GraphCategory>;
    /**
     * Creates an iterator for the entries in the object.
     */
    [Symbol.iterator](): IterableIterator<[GraphProperty, any]>;
}
export interface GraphObjectEvents {
    /**
     * An event raised when a category is added or removed from an object.
     */
    onCategoryChanged?: (change: "add" | "delete", category: GraphCategory) => void;
    /**
     * An event raised when a property changes on the object.
     */
    onPropertyChanged?: (name: string) => void;
}
export interface GraphObjectSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
```

### See Also
* [GraphCategory](graphCategory.md)
* [GraphProperty](graphProperty.md)
* [GraphSchema](graphSchema.md)
* [Graph](graph.md)
* [API Documentation](index.md)