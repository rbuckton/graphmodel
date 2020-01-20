<details>
<summary>In This Article</summary>
<li><a href="#graphtransactionscope">GraphTransactionScope</a></li>
<ul style="margin:0">
    <li><a href="#examples">Examples</a></li>
</ul>
</details>

# GraphTransactionScope
```ts
/**
 * Indicates a scope for transactional changes to a `Graph`.
 */
export declare class GraphTransactionScope implements Disposable {
    /**
     * Starts a new graph transaction scope, which allows you to
     * conditionally commit or roll-back changes to a `Graph`.
     */
    constructor();
    /**
     * Marks the scope as successfully completed. When the scope
     * is disposed, changes will be committed.
     */
    setComplete(): void;
    /**
     * Disposes of the scope and indicates changes should be committed
     * (if `setComplete()` was called), or rolled back (if `setComplete` was not
     * called).
     */
    dispose(): void;
    /**
     * Disposes of the scope and indicates changes should be committed
     * (if `setComplete()` was called), or rolled back (if `setComplete()` was
     * not called).
     *
     * NOTE: This is an alias for `dispose()`.
     */
    [Disposable.dispose](): void;
}
```

### Examples

#### Basic Usage
```ts
import { Graph, GraphTransactionScope } from "graphmodel";

const graph = new Graph();
const nodeA = graph.nodes.getOrCreate("A");
const nodeB = graph.nodes.getOrCreate("B");
const scope = new GraphTransactionScope();
try {
    // Creates an uncommitted link between A and B
    graph.links.getOrCreate(nodeA, nodeB);

    // Other operations...

    // We've successfully reached the end of the block,
    // indicate the changes should be committed.
    scope.setComplete();
}
finally {
    // If no exceptions occurred above, commits the link.
    scope.dispose();
}
```

#### Using `@esfx/disposable`
```ts
import { Graph, GraphTransactionScope } from "graphmodel";

import { Disposable } from "@esfx/disposable";

const graph = new Graph();
const nodeA = graph.nodes.getOrCreate("A");
const nodeB = graph.nodes.getOrCreate("B");

// NOTE: `Disposable.use` will call `[Disposable.dispose]()` for you when
// the callback completes.
Disposable.use(new GraphTransactionScope(), scope => {
    // Creates an uncommitted link between A and B
    graph.links.getOrCreate(nodeA, nodeB);

    // Other operations...

    // We've successfully reached the end of the block,
    // indicate the changes should be committed.
    scope.setComplete();

    // If no exceptions occurred above, commits the link.
});
```

### See Also
* [Disposable](https://esfx.js.org/esfx/api/disposable/disposable_interface.html#disposable_Disposable_Interface)
* [Graph](graph.md#graph)
* [API Documentation](index.md)
