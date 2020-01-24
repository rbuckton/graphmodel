/*!
 * Copyright 2020 Ron Buckton
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

import type { DataTypeNameLike } from "./dataTypeNameLike";
import type { GraphCategory } from "./graphCategory";
import type { GraphCategoryIdLike } from "./graphCategoryIdLike";
import type { GraphProperty } from "./graphProperty";
import type { GraphPropertyIdLike } from "./graphPropertyIdLike";
import type { GraphSchemaNameLike } from "./graphSchemaNameLike";
import type { Graph } from "./graph";
import { DataTypeCollection } from "./dataTypeCollection";
import { DataType } from "./dataType";
import { DataTypeKey } from "./dataTypeKey";
import { EventEmitter, EventSubscription } from "./events";
import { GraphCategoryCollection } from "./graphCategoryCollection";
import { GraphSchemaCollection } from "./graphSchemaCollection";
import { GraphPropertyCollection } from "./graphPropertyCollection";
import { isGraphSchemaNameLike } from "./graphSchemaNameLike";

/**
 * A GraphSchema defines a related set of graph categories and properties.
 */
export class GraphSchema {
    private _graph: Graph | undefined;
    private _name: GraphSchemaNameLike;
    private _schemas: GraphSchemaCollection | undefined;
    private _dataTypes: DataTypeCollection | undefined;
    private _categories: GraphCategoryCollection | undefined;
    private _properties: GraphPropertyCollection | undefined;
    private _events?: EventEmitter<GraphSchemaEvents>;

    constructor(name: GraphSchemaNameLike);
    /* @internal */ constructor(name: GraphSchemaNameLike, graph: Graph);
    constructor(name: GraphSchemaNameLike, graph?: Graph) {
        this._name = name;
        this._graph = graph;
    }

    /**
     * Gets the graph that owns the schema.
     */
    public get graph(): Graph | undefined {
        return this._graph;
    }

    /**
     * Gets the name of the schema.
     */
    public get name(): GraphSchemaNameLike {
        return this._name;
    }

    /**
     * Gets the child schemas of this schema.
     */
    public get schemas(): GraphSchemaCollection {
        return this._schemas ?? (this._schemas = GraphSchemaCollection._create(this));
    }

    /**
     * Gets the categories defined by this schema.
     */
    public get categories(): GraphCategoryCollection {
        return this._categories ?? (this._categories = GraphCategoryCollection._create(this));
    }

    /**
     * Gets the properties defined by this schema.
     */
    public get properties(): GraphPropertyCollection {
        return this._properties ?? (this._properties = GraphPropertyCollection._create(this));
    }

    /**
     * Gets the data types defined by this schema.
     */
    public get dataTypes(): DataTypeCollection {
        return this._dataTypes ?? (this._dataTypes = DataTypeCollection._create(this));
    }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphSchemaEvents): EventSubscription {
        const emitter = this._events ?? (this._events = new EventEmitter());
        return emitter.subscribe(events);
    }

    /**
     * Determines whether this schema contains the provided schema as a child or grandchild.
     */
    public hasSchema(schema: GraphSchema | GraphSchemaNameLike): boolean {
        if (isGraphSchemaNameLike(schema) ? schema === this.name : schema === this) {
            return true;
        }
        if (this._schemas !== undefined) {
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
    public addSchema(schema: GraphSchema): this {
        this.schemas.add(schema);
        return this;
    }

    /**
     * Creates an iterator for all schemas within this schema (including this schema).
     */
    public * allSchemas(): IterableIterator<GraphSchema> {
        yield this;
        if (this._schemas !== undefined) {
            for (const schema of this._schemas) {
                yield* schema.allSchemas();
            }
        }
    }

    /**
     * Finds a category in this schema or its descendants.
     */
    public findCategory(id: GraphCategoryIdLike): GraphCategory | undefined {
        for (const schema of this.allSchemas()) {
            if (schema._categories !== undefined) {
                const category = schema._categories.get(id);
                if (category !== undefined) {
                    return category;
                }
            }
        }
        return undefined;
    }

    /**
     * Creates an iterator for the categories in this schema or its descendants with the provided ids.
     */
    public * findCategories(...categoryIds: GraphCategoryIdLike[]): IterableIterator<GraphCategory> {
        for (const schema of this.allSchemas()) {
            if (schema._categories !== undefined) {
                yield* schema._categories.values(categoryIds);
            }
        }
    }

    /**
     * Finds a property in this schema or its descendants.
     */
    public findProperty(id: GraphPropertyIdLike): GraphProperty | undefined {
        for (const schema of this.allSchemas()) {
            if (schema._properties !== undefined) {
                const property = schema._properties.get(id);
                if (property !== undefined) {
                    return property;
                }
            }
        }
        return undefined;
    }

    /**
     * Creates an iterator for the properties in this schema or its descendants with the provided ids.
     */
    public * findProperties(...propertyIds: GraphPropertyIdLike[]): IterableIterator<GraphProperty> {
        for (const schema of this.allSchemas()) {
            if (schema._properties !== undefined) {
                yield* schema._properties.values(propertyIds);
            }
        }
    }

    /**
     * Finds a data type in this schema or its descendants.
     */
    public findDataType(name: DataTypeNameLike, packageQualifier?: string): DataType | undefined {
        for (const schema of this.allSchemas()) {
            if (schema._dataTypes !== undefined) {
                const dataType = schema._dataTypes.get(name, packageQualifier);
                if (dataType !== undefined) {
                    return dataType;
                }
            }
        }
        return undefined;
    }

    /* @internal */ _raiseOnChanged() {
        this._events?.emit("onChanged");
    }
}

export interface GraphSchemaEvents {
    /**
     * An event raised when the schema or one of its child schemas has changed.
     */
    onChanged?: () => void;
}

/* @internal */
export const isGraphSchema = (value: any): value is GraphSchema => value instanceof GraphSchema;

export const DATATYPE_GraphSchema = DataType._create<GraphSchema>(DataTypeKey.fromString("GraphSchema", "graphmodel"), {
    validate: isGraphSchema,
});

