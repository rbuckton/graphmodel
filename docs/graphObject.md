# GraphObject
```ts
/**
 * The base definition of an extensible graph object.
 */
export declare abstract class GraphObject<P extends object = any> {
    constructor(owner?: Graph<P>, category?: GraphCategory<P>);
    /**
     * Gets the graph that this object belongs to.
     */
    readonly owner: Graph<P> | undefined;
    /**
     * Gets the document schema for this object.
     */
    readonly schema: GraphSchema<P> | undefined;
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
    subscribe(events: GraphObjectEvents<P>): GraphObjectSubscription;
    /**
     * Determines whether the object has the specified category or categories.
     */
    hasCategory(category: string | GraphCategory<P> | Iterable<GraphCategory<P>>): boolean;
    /**
     * Determines whether the object has any of the categories in the provided Set.
     * @param match Either `"exact"` to only match any category in the set, or `"inherited"` to match any category or any of its base categories in the set.
     */
    hasCategoryInSet(categorySet: ReadonlySet<GraphCategory<P>>, match: "exact" | "inherited"): boolean;
    /**
     * Adds a category to the object.
     */
    addCategory(category: GraphCategory<P>): this;
    /**
     * Deletes a category from the object.
     */
    deleteCategory(category: GraphCategory<P>): boolean;
    /**
     * Determines whether the object has the specified property.
     */
    has<K extends keyof P>(key: K | GraphProperty<P, K>): boolean;
    /**
     * Gets the value for the specified property.
     */
    get<K extends keyof P>(key: K | GraphProperty<P, K>): P[K] | undefined;
    /**
     * Sets the value for the specified property.
     */
    set<K extends keyof P>(key: K | GraphProperty<P, K>, value: P[K]): this;
    /**
     * Removes the specified property from the object.
     */
    delete<K extends keyof P>(key: K | GraphProperty<P, K>): boolean;
    /**
     * Creates an iterator for the properties in the object.
     */
    keys(): IterableIterator<GraphProperty<P, keyof P>>;
    /**
     * Creates an iterator for the entries in the object.
     */
    entries(): IterableIterator<[GraphProperty<P, keyof P>, P[keyof P]]>;
    /**
     * Creates an iterator for the categories in the object.
     */
    categories(): IterableIterator<GraphCategory<P>>;
    /**
     * Creates an iterator for the entries in the object.
     */
    [Symbol.iterator](): IterableIterator<[GraphProperty<P, keyof P>, P[keyof P]]>;
}
export interface GraphObjectEvents<P extends object = any> {
    /**
     * An event raised when a category is added or removed from an object.
     */
    onCategoryChanged?: (change: "add" | "delete", category: GraphCategory<P>) => void;
    /**
     * An event raised when a property changes on the object.
     */
    onPropertyChanged?: (name: keyof P) => void;
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