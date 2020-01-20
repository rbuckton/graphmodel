<details>
<summary>In This Article</summary>
<li><a href="#graphlink">GraphLink</a></li>
<li><a href="#graphlinktraversal">GraphLinkTraversal</a></li>
</details>

# GraphLink
```ts
/**
 * Represents a link between two nodes in the graph.
 */
export declare class GraphLink extends GraphObject {
    private constructor();
    /**
     * Gets the graph that this object belongs to.
     */
    get owner(): Graph;
    /**
     * Gets the document schema for this object.
     */
    get schema(): GraphSchema;
    /**
     * The source of the link.
     */
    get source(): GraphNode;
    /**
     * The target of the link.
     */
    get target(): GraphNode;
    /**
     * An optional index for the link (default `0`).
     */
    get index(): number;
    /**
     * Gets a value indicating whether this is a containment link.
     */
    get isContainment(): boolean;
    /**
     * Gets or sets a descriptive label to associate with this link.
     */
    get label(): string | undefined;
    set label(label: string | undefined);
    /**
     * Creates an iterator for the links related to this link.
     * @param searchDirection Either `"source"` to find related links across the incoming
     * links of sources, or `"target"` to find related links across the outgoing links of 
     * targets.
     * @param traversal An object that specifies callbacks used to control how links are 
     * traversed and which links are yielded during iteration.
     */
    related(searchDirection: "source" | "target", traversal?: GraphLinkTraversal): IterableIterator<GraphLink>;
    /**
     * Removes this link from the graph.
     */
    deleteSelf(): boolean;
}
```

### See Also
* [GraphObject](graphObject.md#graphobject)
* [GraphNode](graphNode.md#graphnode)
* [GraphLinkCollection](graphLinkCollection.md#graphlinkcollection)
* [GraphLinkTraversal](#graphlinktraversal)
* [Graph](graph.md#graph)
* [API Documentation](index.md)

# GraphLink
```ts
export interface GraphLinkTraversal {
    /**
     * A callback used to determine whether a link should be traversed. If not specified, all links are traversed.
     */
    traverseLink?: (this: void, link: GraphLink) => boolean;
    /**
     * A callback used to determine whether a link should be yielded. If not specified, all links are yielded.
     */
    acceptLink?: (this: void, link: GraphLink) => boolean;
}
```

### See Also
* [GraphLink](#graphlink)
* [API Documentation](index.md)
