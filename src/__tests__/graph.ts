import { Graph } from "../graph";
import { GraphTransactionScope } from "../graphTransactionScope";

describe("graph", () => {
    it("nodes and links", () => {
        const graph = new Graph();
        const node1 = graph.nodes.getOrCreate("node1");
        const node2 = graph.nodes.getOrCreate("node2");
        const link = graph.links.getOrCreate(node1, node2);
        expect(node1.outgoingLinkCount).toBe(1);
        expect(node2.incomingLinkCount).toBe(1);
        expect(link.source).toBe(node1);
        expect(link.target).toBe(node2);
    });
    it("transacted", () => {
        const graph = new Graph();
        const node1 = graph.nodes.getOrCreate("node1");
        const node2 = graph.nodes.getOrCreate("node2");
        const link = graph.links.getOrCreate(node1, node2);
        const nodesIter1 = graph.nodes.values();
        const nodesArray1 = [...nodesIter1];
        const nodeCount1 = graph.nodes.size;

        const scope = new GraphTransactionScope();

        const node3 = graph.nodes.getOrCreate("node3");
        const nodesIter2 = graph.nodes.values();
        const nodesArray2 = [...nodesIter2];
        const nodeCount2 = graph.nodes.size;

        scope.dispose();

        const nodesIter3 = graph.nodes.values();
        const nodesArray3 = [...nodesIter3];
        const nodeCount3 = graph.nodes.size;

        expect(nodesArray1.length).toBe(2);
        expect(nodesArray1[0]).toBe(node1);
        expect(nodesArray1[1]).toBe(node2);
        expect(nodeCount1).toBe(2);
        
        expect(nodesArray2.length).toBe(3);
        expect(nodesArray2[0]).toBe(node1);
        expect(nodesArray2[1]).toBe(node2);
        expect(nodesArray2[2]).toBe(node3);
        expect(nodeCount2).toBe(3);

        expect(nodesArray3.length).toBe(2);
        expect(nodesArray3[0]).toBe(node1);
        expect(nodesArray3[1]).toBe(node2);
        expect(nodeCount3).toBe(2);
    });
});