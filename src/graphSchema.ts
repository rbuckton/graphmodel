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

import { GraphSchemaCollection } from "./graphSchemaCollection";
import { GraphCategoryCollection } from "./graphCategoryCollection";
import { GraphCategory } from "./graphCategory";
import { GraphPropertyCollection } from "./graphPropertyCollection";
import { GraphProperty } from "./graphProperty";
import { Graph } from "./graph";

/**
 * A GraphSchema defines a related set of graph categories and properties.
 */
export class GraphSchema {
    private _graph: Graph | undefined;
    private _name: string;
    private _schemas: GraphSchemaCollection | undefined;
    private _categories: GraphCategoryCollection | undefined;
    private _properties: GraphPropertyCollection | undefined;
    private _observers: Map<GraphSchemaSubscription, GraphSchemaEvents> | undefined;

    /*@internal*/
    constructor(name: string, graph: Graph);
    constructor(name: string);
    constructor(name: string, graph?: Graph) {
        this._name = name;
        this._graph = graph;
    }

    /**
     * Gets the graph that owns the schema.
     */
    public get graph() { return this._graph; }

    /**
     * Gets the name of the schema.
     */
    public get name() { return this._name; }

    /**
     * Gets the child schemas of this schema.
     */
    public get schemas() { return this._schemas || (this._schemas = GraphSchemaCollection._create(this)); }

    /**
     * Gets the categories defined by this schema.
     */
    public get categories() { return this._categories || (this._categories = GraphCategoryCollection._create(this)); }

    /**
     * Gets the properties defined by this schema.
     */
    public get properties() { return this._properties || (this._properties = GraphPropertyCollection._create(this)); }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphSchemaEvents) {
        const observers = this._observers || (this._observers = new Map<GraphSchemaSubscription, GraphSchemaEvents>());
        const subscription: GraphSchemaSubscription = { unsubscribe: () => { observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    /**
     * Determines whether this schema contains the provided schema as a child or grandchild.
     */
    public hasSchema(schema: GraphSchema) {
        if (schema === this) return true;
        if (this._schemas) {
            for (const value of this.schemas.values()) {
                if (value.hasSchema(schema)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Adds a child schema to this schema.
     */
    public addSchema(schema: GraphSchema) {
        this.schemas.add(schema);
        return this;
    }

    /**
     * Creates an iterator for all schemas within this schema (including this schema).
     */
    public * allSchemas(): IterableIterator<GraphSchema> {
        yield this;
        if (this._schemas) {
            for (const schema of this._schemas) {
                yield* schema.allSchemas();
            }
        }
    }

    /**
     * Finds a category in this schema or its descendants.
     */
    public findCategory(id: string) {
        for (const schema of this.allSchemas()) {
            if (schema._categories) {
                const category = schema._categories.get(id);
                if (category) {
                    return category;
                }
            }
        }
        return undefined;
    }

    /**
     * Creates an iterator for the categories in this schema or its descendants with the provided ids.
     */
    public * findCategories(...categoryIds: string[]) {
        for (const schema of this.allSchemas()) {
            if (schema._categories) {
                yield* schema._categories.values(categoryIds);
            }
        }
    }

    /**
     * Finds a property in this schema or its descendants.
     */
    public findProperty(id: string) {
        for (const schema of this.allSchemas()) {
            if (schema._properties) {
                const property = schema._properties.get(id);
                if (property) {
                    return property;
                }
            }
        }
        return undefined;
    }

    /**
     * Creates an iterator for the properties in this schema or its descendants with the provided ids.
     */
    public * findProperties(...propertyIds: string[]) {
        for (const schema of this.allSchemas()) {
            if (schema._properties) {
                yield* schema._properties.values(propertyIds);
            }
        }
    }

    /*@internal*/
    public _raiseOnChanged() {
        if (this._observers) {
            for (const { onChanged } of this._observers.values()) {
                if (onChanged) {
                    onChanged();
                }
            }
        }
    }
}

export interface GraphSchemaEvents {
    /**
     * An event raised when the schema or one of its child schemas has changed.
     */
    onChanged?: () => void;
}

export interface GraphSchemaSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
