<details>
<summary>In This Article</summary>
<li><a href="#basecollection">BaseCollection</a></li>
</details>

# BaseCollection
```ts
export declare abstract class BaseCollection<T> {
    abstract values(): IterableIterator<T>;
    /**
     * Returns `true` if every element in the collection matches the
     * provided callback; otherwise, `false`.
     */
    every(callbackfn: (value: T) => boolean): boolean;
    /**
     * Returns `true` if at least one element in the collection matches
     * the provided callback; otherwise, `false`.
     */
    some(callbackfn?: (value: T) => boolean): boolean;
    /**
     * Calls the provided callback once for each element in the collection.
     */
    forEach(callbackfn: (value: T) => void): void;
    /**
     * Yields the result of calling the provided callback once for each
     * element in the collection.
     */
    map<U>(callbackfn: (value: T) => U): IterableIterator<U>;
    /**
     * Yields each element in the collection that matches the provided callback.
     */
    filter<S extends T>(callbackfn: (value: T) => value is S): IterableIterator<S>;
    /**
     * Yields each element in the collection that matches the provided callback.
     */
    filter(callbackfn: (value: T) => boolean): IterableIterator<T>;
    /**
     * Calls the specified callback function for each elements in the collection.
     * The return value of the callback is the accumulated result, and is provided
     * as an argument in the next call to the callback.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: T) => U, initialValue: U): U;
    /**
     * Finds the first matching element in the collection.
     */
    find<S extends T>(callbackfn: (value: T) => value is S): S | undefined;
    /**
     * Finds the first matching element in the collection.
     */
    find(callbackfn: (value: T) => boolean): T | undefined;
}
```

### See Also
* [DataTypeCollection](dataTypeCollection.md)
* [GraphCategoryCollection](graphCategoryCollection.md)
* [GraphLinkCollection](graphLinkCollection.md)
* [GraphNodeCollection](graphNodeCollection.md)
* [GraphPropertyCollection](graphPropertyCollection.md)
* [GraphSchemaCollection](graphSchemaCollection.md)
* [API Documentation](index.md)