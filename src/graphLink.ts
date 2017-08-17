import { GraphSchema } from "./graphSchema";
import { GraphCategory } from "./graphCategory";
import { GraphObject } from "./graphObject";
import { GraphNode } from "./graphNode";
import { Graph } from "./graph";


export class GraphLink<P extends object = any> extends GraphObject<P> {
    public readonly source: GraphNode<P>;
    public readonly target: GraphNode<P>;
    public readonly index: number;

    /*@internal*/ static create<P extends object>(owner: Graph<P>, source: GraphNode<P>, target: GraphNode<P>, index: number, category?: GraphCategory) {
        return new GraphLink<P>(owner, source, target, index, category);
    }

    private constructor(owner: Graph<P>, source: GraphNode<P>, target: GraphNode<P>, index: number, category?: GraphCategory) {
        super(owner, category);
        this.source = this.owner.importNode(source);
        this.target = this.owner.importNode(target);
        this.index = index;

        source.addLink(this);
        target.addLink(this);
    }

    public * related(searchDirection: "source" | "target", { traverseLink, acceptLink }: GraphLinkTraversal<P> = { }) {
        const accepted = new Set<GraphLink<P>>();
        const traversed = new Set<GraphLink<P>>([this]);
        const traversalQueue: GraphLink<P>[] = [this];
        let link: GraphLink<P> | undefined;
        while (link = traversalQueue.shift()) {
            const links = searchDirection === "source" ? link.source.incomingLinks : link.target.outgoingLinks;
            for (const link of links) {
                if (!accepted.has(link) && (!acceptLink || acceptLink(link))) {
                    accepted.add(link);
                    yield link;
                }
                if (!traversed.has(link) && (!traverseLink || traverseLink(link))) {
                    traversed.add(link);
                    traversalQueue.push(link);
                }
            }
        }
    }
}

export interface GraphLinkTraversal<P extends object = any> {
    traverseLink?: (this: void, link: GraphLink<P>) => boolean;
    acceptLink?: (this: void, link: GraphLink<P>) => boolean;
}