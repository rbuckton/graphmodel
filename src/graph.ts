/*!
 * Copyright 2017 Ron Buckton
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GraphSchema } from "./graphSchema";
import { GraphObject } from "./graphObject";
import { GraphNode } from "./graphNode";
import { GraphNodeCollection } from "./graphNodeCollection";
import { GraphLink } from "./graphLink";
import { GraphLinkCollection } from "./graphLinkCollection";

class DocumentSchema extends GraphSchema {
    public readonly graph: Graph;

    constructor(graph: Graph) {
        super("#document");
        this.graph = graph;
    }
}

/**
 * A directed graph consisting of nodes and links.
 */
export class Graph extends GraphObject {
    /**
     * Gets the collection of links in the graph.
     */
    public readonly links = GraphLinkCollection._create(this);

    /**
     * Gets the collection of nodes in the graph.
     */
    public readonly nodes = GraphNodeCollection._create(this);

    private _schema: DocumentSchema | undefined;

    constructor() {
        super();
    }

    /**
     * Gets the graph that this object belongs to.
     */
    public get owner() { return this; }

    /**
     * Gets the document schema for this object.
     */
    public get schema(): GraphSchema {
        if (!this._schema) {
            this._schema = new DocumentSchema(this);
        }
        return this._schema;
    }

    /**
     * Adds a new schema to the graph.
     */
    public addSchema(schema: GraphSchema) {
        if (schema !== this.schema) {
            this.schema.addSchema(schema);
        }
        return this;
    }

    /**
     * Copies the schemas from another graph.
     */
    public copySchemas(graph: Graph) {
        if (graph === this) return false;
        let changed = false;
        for (const category of graph.schema.categories) {
            if (!this.schema.categories.has(category)) {
                this.schema.categories.add(category);
                changed = true;
            }
        }
        for (const property of graph.schema.properties) {
            if (!this.schema.properties.has(property)) {
                this.schema.properties.add(property);
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

    /**
     * Imports a link (along with its source and target nodes) into the graph.
     */
    public importLink(link: GraphLink) {
        return this._importLink(link, /*excludeSchema*/ false);
    }

    /**
     * Imports a node into the graph.
     */
    public importNode(node: GraphNode): GraphNode {
        return this._importNode(node, /*excludeSchema*/ false);
    }

    /**
     * Imports a subset of nodes into the graph.
     * @param depth The depth of outgoing links to import.
     */
    public importSubset(node: GraphNode, depth: number): GraphNode {
        return this._importSubset(node, depth, /*excludeSchema*/ false, /*seen*/ new Set<GraphNode>());
    }

    /**
     * Clears the links and nodes of the graph.
     */
    public clear() {
        this.links.clear();
        this.nodes.clear();
    }

    /**
     * Renames a node.
     * @param newId The new id for the node.
     */
    public renameNode(node: GraphNode, newId: string): GraphNode;
    /**
     * Renames a node.
     * @param nodeId The id of the node to rename.
     * @param newId The new id for the node.
     */
    public renameNode(nodeId: string, newId: string): GraphNode | undefined;
    public renameNode(node: string | GraphNode, newId: string) {
        const existingNode = typeof node === "string" ? this.nodes.get(node) : node;
        if (existingNode) {
            const newNode = existingNode.copy(newId);
            this.nodes.add(newNode);
            this.nodes.delete(existingNode);
            return newNode;
        }
        return undefined;
    }

    private _importLink(link: GraphLink, excludeSchema: boolean) {
        if (link.owner === this) return link;
        if (!excludeSchema) this.copySchemas(link.owner);
        const source = this._importNode(link.source, /*excludeSchema*/ true);
        const target = this._importNode(link.target, /*excludeSchema*/ true);
        const imported = this.links.getOrCreate(source, target, link.index);
        imported._merge(link);
        return imported;
    }

    private _importNode(node: GraphNode, excludeSchema: boolean) {
        if (node.owner === this) return node;
        if (!excludeSchema) this.copySchemas(node.owner);
        const imported = this.nodes.getOrCreate(node.id);
        imported._merge(node);
        return imported;
    }

    private _importSubset(node: GraphNode, depth: number, excludeSchema: boolean, seen: Set<GraphNode>) {
        if (node.owner === this) return node;
        if (!excludeSchema) this.copySchemas(node.owner);
        if (seen.has(node)) return this.nodes.get(node.id)!;
        seen.add(node);
        const importedNode = this._importNode(node, /*excludeSchema*/ true);
        if (depth > 0) {
            for (const link of node.outgoingLinks()) {
                const target = this._importSubset(link.target, depth - 1, /*excludeSchema*/ true, seen);
                const importedLink = this.links.getOrCreate(importedNode.id, target.id, link.index);
                importedLink._merge(link);
            }
            for (const link of node.incomingLinks()) {
                const source = this._importSubset(link.source, depth - 1, /*excludeSchema*/ true, seen);
                const importedLink = this.links.getOrCreate(source.id, importedNode.id, link.index);
                importedLink._merge(link);
            }
        }
        return importedNode;
    }
}