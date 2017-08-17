import { GraphSchema } from "./graphSchema";
import { GraphNode } from "./graphNode";
import { GraphNodeCollection } from "./graphNodeCollection";
import { GraphLink } from "./graphLink";
import { GraphLinkCollection } from "./graphLinkCollection";

class DocumentSchema<P extends object> extends GraphSchema<P> {
    public readonly graph: Graph<P>;

    constructor(graph: Graph<P>, ...schemas: GraphSchema<P>[]) {
        super("#document", ...schemas);
        this.graph = graph;
    }
}

export class Graph<P extends object = any> {
    public readonly links: GraphLinkCollection<P> = GraphLinkCollection.create(this);
    public readonly nodes: GraphNodeCollection<P> = GraphNodeCollection.create(this);
    public readonly schema: GraphSchema<P>;

    constructor(...schemas: GraphSchema<P>[]) {
        this.schema = new DocumentSchema(this, ...schemas);
    }

    public importSchemas(graph: Graph<P>) {
        if (graph === this) return false;
        let changed = false;
        for (const category of graph.schema.categories) {
            if (!this.schema.categories.has(category)) {
                this.schema.categories.add(category);
                changed = true;
            }
        }
        for (const schema of graph.schema.schemas) {
            if (!this.schema.schemas.has(schema)) {
                this.schema.addSchema(schema);
                changed = true;
            }
        }
        return changed;
    }

    /*@internal*/ importLink(link: GraphLink<P>, excludeSchema: boolean): GraphLink<P>;
    public importLink(link: GraphLink<P>): GraphLink<P>;
    public importLink(link: GraphLink<P>, excludeSchema?: boolean) {
        if (link.owner === this) return link;
        if (!excludeSchema) this.importSchemas(link.owner);
        const source = this.importNode(link.source, /*excludeSchema*/ true);
        const target = this.importNode(link.target, /*excludeSchema*/ true);
        const imported = this.links.getOrCreate(source, target, link.index);
        imported.merge(link);
        return imported;
    }

    /*@internal*/ importNode(node: GraphNode<P>, excludeSchema: boolean): GraphNode<P>;
    public importNode(node: GraphNode<P>): GraphNode<P>;
    public importNode(node: GraphNode<P>, excludeSchema?: boolean) {
        if (node.owner === this) return node;
        if (!excludeSchema) this.importSchemas(node.owner);
        const imported = this.nodes.getOrCreate(node.id);
        imported.merge(node);
        return imported;
    }

    /*@internal*/ importSubset(node: GraphNode<P>, depth: number, excludeSchema: boolean, seen?: Set<GraphNode<P>>): GraphNode<P>;
    public importSubset(node: GraphNode<P>, depth: number): GraphNode<P>;
    public importSubset(node: GraphNode<P>, depth: number, excludeSchema?: boolean, seen?: Set<GraphNode<P>>) {
        if (node.owner === this) return node;
        if (!excludeSchema) this.importSchemas(node.owner);
        if (!seen) seen = new Set<GraphNode<P>>();
        if (seen.has(node)) return this.nodes.get(node.id);
        seen.add(node);
        const importedNode = this.importNode(node, /*excludeSchema*/ true);
        if (depth > 0) {
            for (const link of node.outgoingLinks) {
                const target = this.importSubset(link.target, depth - 1, /*excludeSchema*/ true, seen);
                const importedLink = this.links.getOrCreate(importedNode.id, target.id, link.index);
                importedLink.merge(link);
            }
            for (const link of node.incomingLinks) {
                const source = this.importSubset(link.source, depth - 1, /*excludeSchema*/ true, seen);
                const importedLink = this.links.getOrCreate(source.id, importedNode.id, link.index);
                importedLink.merge(link);
            }
        }
        return importedNode;
    }

    public clear() {
        this.links.clear();
        this.nodes.clear();
    }

    public rename(node: GraphNode<P>, newId: string): GraphNode<P>;
    public rename(node: string, newId: string): GraphNode<P> | undefined;
    public rename(node: string | GraphNode<P>, newId: string): GraphNode<P> | undefined;
    public rename(node: string | GraphNode<P>, newId: string) {
        const existingNode = typeof node === "string" ? this.nodes.get(node) : node;
        if (existingNode) {
            const newNode = existingNode.copy(newId);
            this.nodes.add(newNode);
            this.nodes.delete(existingNode);
            return newNode;
        }
        return undefined;
    }
}