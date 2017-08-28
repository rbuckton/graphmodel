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

/**
 * A directed graph consisting of nodes and links.
 */
export class Graph extends GraphObject {
    private _links: GraphLinkCollection | undefined;
    private _nodes: GraphNodeCollection | undefined;
    private _schema: GraphSchema | undefined;

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
    public get schema() { return this._schema || (this._schema = new GraphSchema("#document", this)); }

    /**
     * Gets the collection of links in the graph.
     */
    public get links() { return this._links || (this._links = GraphLinkCollection._create(this)); }

    /**
     * Gets the collection of nodes in the graph.
     */
    public get nodes() { return this._nodes || (this._nodes = GraphNodeCollection._create(this)); }

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
        if (graph._schema) {
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
        }
        return changed;
    }

    /**
     * Imports a link (along with its source and target nodes) into the graph.
     */
    public importLink(link: GraphLink) {
        if (link.owner === this) return link;
        this.copySchemas(link.owner);
        return this._importLink(link);
    }

    /**
     * Imports a node into the graph.
     * @param depth The depth of related links to import.
     */
    public importNode(node: GraphNode, depth?: number): GraphNode {
        if (node.owner === this) return node;
        this.copySchemas(node.owner);
        return this._importNode(node, depth, /*seen*/ undefined);
    }

    /**
     * Clears the links and nodes of the graph.
     */
    public clear() {
        if (this._links) this._links.clear();
        if (this._nodes) this._nodes.clear();
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

    private _importLink(link: GraphLink) {
        const source = this._importNode(link.source);
        const target = this._importNode(link.target);
        const imported = this.links.getOrCreate(source, target, link.index);
        imported._mergeFrom(link);
        return imported;
    }

    private _importNode(node: GraphNode, depth = 0, seen?: Set<GraphNode>) {
        const importedNode = this.nodes.getOrCreate(node.id);
        importedNode._mergeFrom(node);
        if (depth > 0) {
            if (!seen) seen = new Set<GraphNode>();
            seen.add(node);
            for (const link of node.outgoingLinks()) {
                if (seen.has(link.target)) continue;
                const target = this._importNode(link.target, depth - 1, seen);
                const importedLink = this.links.getOrCreate(importedNode.id, target.id, link.index);
                importedLink._mergeFrom(link);
            }
            for (const link of node.incomingLinks()) {
                if (seen.has(link.source)) continue;
                const source = this._importNode(link.source, depth - 1, seen);
                const importedLink = this.links.getOrCreate(source.id, importedNode.id, link.index);
                importedLink._mergeFrom(link);
            }
        }
        return importedNode;
    }
}