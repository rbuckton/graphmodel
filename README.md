# JavaScript library for modeling directed graphs

`graphmodel` is a library for modeling directed graphs, based loosely on the [Visual Studio GraphModel API](https://msdn.microsoft.com/en-us/library/microsoft.visualstudio.graphmodel.aspx).

## Installation

```
npm install graphmodel
```

## Usage

```js
import { Graph } from "graphmodel";

// create a graph
const graph = new Graph();

// add nodes
const sourceNode = graph.nodes.getOrCreate("source");
const targetNode = graph.nodes.getOrCreate("target");

// add links
const link = graph.links.getOrCreate(sourceNode, targetNode);

// find targets
for (const target of sourceNode.targets()) {}

// find sources
for (const source of targetNode.sources()) {}

// add data to nodes/links
sourceNode.set("key", value);
link.set("key", value);
```

## Advanced Usage

```js
import { Graph } from "graphmodel";

const fileSystem = new Graph();

// node categories
const file = fileSystem.schema.categories.getOrCreate("file");
const folder = fileSystem.schema.categories.getOrCreate("folder");

// link categories
const child = fileSystem.schema.categories.getOrCreate("child");
const symlink = fileSystem.schema.categories.getOrCreate("symlink");

// add the '/' directory
const root = fileSystem.nodes.getOrCreate("/", folder);

// add the '/home' directory
const home = fileSystem.nodes.getOrCreate("home", folder);
fileSystem.links.getOrCreate(root, home, child);

// add a '/home/profile' file
const profile = fileSystem.nodes.getOrCreate("profile", file);
fileSystem.links.getOrCreate(home, profile, child);

// add a symbolic link from '/home/profile' to '/home/profile2'
const profile2 = fileSystem.nodes.getOrCreate("profile2", file);
fileSystem.links.getOrCreate(home, profile2, child);
fileSystem.links.getOrCreate(profile, profile2, symlink);

// find all files beneath '/'
const files = root.related("target", {
    traverseLink: link => link.hasCategory(child),
    traverseNode: node => node.hasCategory(folder),
    acceptNode: node => node.hasCategory(file)
});

// find all containing folders of '/home/profile'
const folders = profile.related("source", {
    traverseLink: link => link.hasCategory(child),
    traverseNode: node => node.hasCategory(folder),
    acceptNode: node => node.hasCategory(folder)
});

// resolve symbolic link for '/home/profile2'
const target = profile2.firstRelated("source", {
    traverseLink: link => link.hasCategory(symlink)
});
```

## API Overview

### Graph
```ts
export declare class Graph<P extends object = any> {
    constructor(...schemas: GraphSchema<P>[]);
    readonly links: GraphLinkCollection<P>;
    readonly nodes: GraphNodeCollection<P>;
    readonly schema: GraphSchema<P>;
    importSchemas(graph: Graph<P>): boolean;
    importLink(link: GraphLink<P>): GraphLink<P>;
    importNode(node: GraphNode<P>): GraphNode<P>;
    importSubset(node: GraphNode<P>, depth: number): GraphNode<P>;
    rename(node: GraphNode<P>, newId: string): GraphNode<P>;
    rename(node: string, newId: string): GraphNode<P> | undefined;
    rename(node: string | GraphNode<P>, newId: string): GraphNode<P> | undefined;
    clear(): void;
}
```

### GraphSchema
```ts
export declare class GraphSchema<P extends object = any> {
    constructor(name: string, ...schemas: GraphSchema<P>[]);
    readonly graph: Graph<P> | undefined;
    readonly categories: GraphCategoryCollection<P>;
    readonly schemas: GraphSchemaCollection<P>;
    readonly name: string;
    hasSchema(schema: GraphSchema<P>): boolean;
    addSchema(schema: GraphSchema<P>): this;
    allSchemas(): IterableIterator<GraphSchema<P>>;
    getCategory(id: string): GraphCategory | undefined;
    allCategories(...categoryIds: string[]): IterableIterator<GraphCategory>;
}
```

### GraphSchemaCollection
```ts
export declare class GraphSchemaCollection<P extends object = any> {
    private constructor();
    readonly schema: GraphSchema<P>;
    readonly size: number;
    subscribe(events: GraphSchemaCollectionEvents): GraphSchemaCollectionSubscription;
    has(schema: GraphSchema<P>): boolean;
    get(name: string): GraphSchema<any> | undefined;
    add(schema: GraphSchema<P>): this;
    values(): IterableIterator<GraphSchema<any>>;
    [Symbol.iterator](): IterableIterator<GraphSchema<any>>;
}

export interface GraphSchemaCollectionEvents<P extends object = any> {
    onAdded?: (schema: GraphSchema<P>) => void;
}

export interface GraphSchemaCollectionSubscription {
    unsubscribe(): void;
}
```

### GraphCategory
```ts
export declare class GraphCategory {
    private constructor(id: string);
    readonly id: string;
    basedOn: GraphCategory;
    isBasedOn(category: string | GraphCategory): boolean;
}
```

### GraphCategoryCollection
```ts
export declare class GraphCategoryCollection<P extends object = any> {
    private constructor(schema: GraphSchema<P>);
    readonly schema: GraphSchema<P>;
    readonly size: number;
    subscribe(events: GraphCategoryCollectionEvents): GraphCategoryCollectionSubscription;
    has(category: GraphCategory): boolean;
    getOrCreate(id: string): GraphCategory;
    add(category: GraphCategory): this;
    values(): IterableIterator<GraphCategory>;
    basedOn(base: GraphCategory): IterableIterator<GraphCategory>;
    delete(category: GraphCategory): boolean;
    clear(): void;
    [Symbol.iterator](): IterableIterator<GraphCategory>;
}

export interface GraphCategoryCollectionEvents {
    onAdded?: (category: GraphCategory) => void;
    onDeleted?: (category: GraphCategory) => void;
}

export interface GraphCategoryCollectionSubscription {
    unsubscribe(): void;
}
```

### GraphObject
```ts
export declare abstract class GraphObject<P extends object = any> {
    constructor(owner: Graph<P>, category?: GraphCategory);
    readonly owner: Graph<P>;
    readonly categoryCount: number;
    readonly propertyCount: number;
    subscribe(events: GraphObjectEvents<P>): GraphObjectSubscription;
    hasCategory(category: string | GraphCategory | Iterable<GraphCategory>): boolean;
    hasCategoryInSet(categorySet: Set<GraphCategory>, match: "exact" | "inherited"): boolean;
    addCategory(category: GraphCategory): this;
    deleteCategory(category: GraphCategory): boolean;
    has(key: keyof P): boolean;
    get<K extends keyof P>(key: K): P[K] | undefined;
    set<K extends keyof P>(key: K, value: P[K]): this;
    delete(key: keyof P): boolean;
    keys(): IterableIterator<keyof P>;
    values(): IterableIterator<P[keyof P]>;
    entries(): IterableIterator<[keyof P, P[keyof P]]>;
    categories(): IterableIterator<GraphCategory>;
    [Symbol.iterator](): IterableIterator<[keyof P, P[keyof P]]>;
}

export interface GraphObjectEvents<P extends object = any> {
    onCategoryChanged?: (change: "add" | "delete", category: GraphCategory) => void;
    onPropertyChanged?: (name: keyof P) => void;
}

export interface GraphObjectSubscription {
    unsubscribe(): void;
}
```

### GraphNode
```ts
export declare class GraphNode<P extends object = any> extends GraphObject<P> {
    private constructor();
    readonly id: string;
    readonly incomingLinks: ReadonlySet<GraphLink<P>>;
    readonly outgoingLinks: ReadonlySet<GraphLink<P>>;
    links(...linkCategories: GraphCategory[]): IterableIterator<GraphLink<P>>;
    firstRelated(searchDirection: "source" | "target", traversal?: GraphNodeTraversal<P>): GraphNode<P> | undefined;
    related(searchDirection: "source" | "target", traversal?: GraphNodeTraversal<P>): IterableIterator<GraphNode<P>>;
    sources(...linkCategories: GraphCategory[]): IterableIterator<GraphNode<P>>;
    targets(...linkCategories: GraphCategory[]): IterableIterator<GraphNode<P>>;
    copy(newId: string): GraphNode<P>;
}

export interface GraphNodeTraversal<P extends object = any> {
    traverseLink?: (link: GraphLink<P>) => boolean;
    traverseNode?: (node: GraphNode<P>) => boolean;
    acceptNode?: (node: GraphNode<P>) => boolean;
}
```

### GraphNodeCollection
```ts
export declare class GraphNodeCollection<P extends object = any> {
    private constructor();
    readonly graph: Graph<P>;
    readonly size: number;
    subscribe(events: GraphNodeCollectionEvents<P>): GraphNodeCollectionSubscription;
    has(node: GraphNode<P>): boolean;
    get(id: string): GraphNode<P> | undefined;
    getOrCreate(id: string, category?: GraphCategory): GraphNode<P>;
    add(node: GraphNode<P>): this;
    delete(nodeId: string): GraphNode<P>;
    delete(node: GraphNode<P>): boolean;
    clear(): void;
    values(): IterableIterator<GraphNode<P>>;
    byProperty<K extends keyof P>(key: K, value: P[K]): IterableIterator<GraphNode<P>>;
    byCategory(...categories: GraphCategory[]): IterableIterator<GraphNode<P>>;
    filter(cb: (node: GraphNode<P>) => boolean): IterableIterator<GraphNode<P>>;
    [Symbol.iterator](): IterableIterator<GraphNode<P>>;
}

export interface GraphNodeCollectionEvents<P extends object = any> {
    onAdded?: (node: GraphNode<P>) => void;
    onDeleted?: (node: GraphNode<P>) => void;
}

export interface GraphNodeCollectionSubscription {
    unsubscribe(): void;
}
```

### GraphLink
```ts
export declare class GraphLink<P extends object = any> extends GraphObject<P> {
    private constructor();
    readonly source: GraphNode<P>;
    readonly target: GraphNode<P>;
    readonly index: number;
    related(searchDirection: "source" | "target", traversal?: GraphLinkTraversal<P>): IterableIterator<GraphLink<P>>;
}

export interface GraphLinkTraversal<P extends object = any> {
    traverseLink?: (this: void, link: GraphLink<P>) => boolean;
    acceptLink?: (this: void, link: GraphLink<P>) => boolean;
}
```

### GraphLinkCollection
```ts
export declare class GraphLinkCollection<P extends object = any> {
    private constructor();
    readonly graph: Graph<P>;
    readonly size: number;
    subscribe(events: GraphLinkCollectionEvents<P>): GraphLinkCollectionSubscription;
    has(link: GraphLink<P>): boolean;
    get(sourceId: string, targetId: string, index?: number): GraphLink<P> | undefined;
    getOrCreate(source: string | GraphNode<P>, target: string | GraphNode<P>, index?: number): GraphLink<P>;
    getOrCreate(source: string | GraphNode<P>, target: string | GraphNode<P>, category: GraphCategory): GraphLink<P>;
    add(link: GraphLink<P>): this;
    delete(link: GraphLink<P>): boolean;
    delete(sourceId: string, targetId: string, category: GraphCategory): GraphLink<P>;
    clear(): void;
    values(): IterableIterator<GraphLink<P>>;
    between(source: GraphNode<P>, target: GraphNode<P>): IterableIterator<GraphLink<P>>;
    to(node: string | GraphNode<P>, ...categories: GraphCategory[]): IterableIterator<GraphLink<P>>;
    from(node: string | GraphNode<P>, ...categories: GraphCategory[]): IterableIterator<GraphLink<P>>;
    byProperty<K extends keyof P>(key: K, value: P[K]): IterableIterator<GraphLink<P>>;
    byCategory(...categories: GraphCategory[]): IterableIterator<GraphLink<P>>;
    filter(cb: (link: GraphLink<P>) => boolean): IterableIterator<GraphLink<P>>;
    [Symbol.iterator](): IterableIterator<GraphLink<P>>;
}

export interface GraphLinkCollectionEvents<P extends object = any> {
    onAdded?: (this: void, link: GraphLink<P>) => void;
    onDeleted?: (this: void, link: GraphLink<P>) => void;
}

export interface GraphLinkCollectionSubscription {
    unsubscribe(): void;
}
```