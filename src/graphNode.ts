import { GraphSchema } from "./graphSchema";
import { GraphCategory } from "./graphCategory";
import { GraphObject } from "./graphObject";
import { GraphLink } from "./graphLink";
import { Graph } from "./graph";

export class GraphNode<P extends object = any> extends GraphObject<P> {
    public readonly id: string;
    public readonly incomingLinks: ReadonlySet<GraphLink<P>>;
    public readonly outgoingLinks: ReadonlySet<GraphLink<P>>;

    private _incomingLinks = new Set<GraphLink<P>>();
    private _outgoingLinks = new Set<GraphLink<P>>();

    /*@internal*/ static _create<P extends object>(owner: Graph<P>, id: string, category?: GraphCategory<P>) {
        return new GraphNode(owner, id, category);
    }

    private constructor(owner: Graph<P>, id: string, category?: GraphCategory<P>) {
        super(owner, category);

        this.id = id;
        this.incomingLinks = this._incomingLinks;
        this.outgoingLinks = this._outgoingLinks;
    }

    public get owner() { return super.owner!; }

    public * links(...linkCategories: GraphCategory<P>[]) {
        if (linkCategories.length) {
            const set = new Set(linkCategories);
            for (const link of this.incomingLinks) if (link.hasCategoryInSet(set, "exact")) yield link;
            for (const link of this.outgoingLinks) if (link.hasCategoryInSet(set, "exact")) yield link;
        }
        else {
            yield* this.incomingLinks;
            yield* this.outgoingLinks;
        }
    }

    public firstRelated(searchDirection: "source" | "target", traversal?: GraphNodeTraversal<P>) {
        for (const node of this.related(searchDirection, traversal)) return node;
    }

    public * related(searchDirection: "source" | "target", { traverseLink, traverseNode, acceptNode }: GraphNodeTraversal<P> = { }) {
        const accepted = new Set<GraphNode<P>>();
        const traversed = new Set<GraphNode<P>>([this]);
        const traversalQueue: GraphNode<P>[] = [this];
        let node: GraphNode<P> | undefined;
        while (node = traversalQueue.shift()) {
            const links = searchDirection === "source" ? node.incomingLinks : node.outgoingLinks;
            for (const link of links) {
                if (traverseLink && !traverseLink(link)) continue;
                const node = searchDirection === "source" ? link.source : link.target;
                if (!accepted.has(node) && (!acceptNode || acceptNode(node))) {
                    accepted.add(node);
                    yield node;
                }
                if (!traversed.has(node) && (!traverseNode || traverseNode(node))) {
                    traversed.add(node);
                    traversalQueue.push(node);
                }
            }
        }
    }

    public * sources(...linkCategories: GraphCategory<P>[]) {
        const set = linkCategories.length && new Set(linkCategories);
        for (const link of this.incomingLinks) if (!set || link.hasCategoryInSet(set, "exact")) yield link.source;
    }

    public * targets(...linkCategories: GraphCategory<P>[]) {
        const set = linkCategories.length && new Set(linkCategories);
        for (const link of this.outgoingLinks) if (!set || link.hasCategoryInSet(set, "exact")) yield link.target;
    }

    public copy(newId: string) {
        const node = new GraphNode(this.owner, newId);
        node._merge(this);
        for (const link of this.outgoingLinks) GraphLink._create(this.owner, node, link.target, link.index)._merge(link);
        for (const link of this.incomingLinks) GraphLink._create(this.owner, link.source, node, link.index)._merge(link);
        return node;
    }

    /*@internal*/ _addLink(link: GraphLink<P>) {
        if (link.target === this) this._incomingLinks.add(link);
        if (link.source === this) this._outgoingLinks.add(link);
    }

    /*@internal*/ _removeLink(link: GraphLink<P>) {
        if (link.target === this) this._incomingLinks.delete(link);
        if (link.source === this) this._outgoingLinks.delete(link);
    }
}

export interface GraphNodeTraversal<P extends object = any> {
    traverseLink?: (link: GraphLink<P>) => boolean;
    traverseNode?: (node: GraphNode<P>) => boolean;
    acceptNode?: (node: GraphNode<P>) => boolean;
}