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
export class GraphSchema<P extends object = any> {
    /**
     * Gets the graph that owns the schema.
     */
    public readonly graph: Graph<P> | undefined;

    /**
     * Gets the name of the schema.
     */
    public readonly name: string;

    /**
     * Gets the child schemas of this schema.
     */
    public readonly schemas = GraphSchemaCollection._create<P>(this);

    /**
     * Gets the categories defined by this schema.
     */
    public readonly categories = GraphCategoryCollection._create<P>(this);

    /**
     * Gets the properties defined by this schema.
     */
    public readonly properties = GraphPropertyCollection._create<P>(this);

    /**
     * The underlying data type for the properties in the schema. This will never have a value and is only used for type checking and type inference purposes.
     */
    public readonly ["[[Properties]]"]: P;

    constructor(name: string, ...schemas: GraphSchema<P>[]) {
        this.name = name;
        for (const schema of schemas) this.addSchema(schema);
    }

    /**
     * Determines whether this schema contains the provided schema as a child or grandchild.
     */
    public hasSchema(schema: GraphSchema<P>) {
        if (schema === this) return true;
        for (const value of this.schemas.values()) if (value.hasSchema(schema)) return true;
        return false;
    }

    /**
     * Adds a child schema to this schema.
     */
    public addSchema(schema: GraphSchema<P>) {
        this.schemas.add(schema);
        return this;
    }

    /**
     * Creates an iterator for all schemas within this schema (including this schema).
     */
    public * allSchemas(): IterableIterator<GraphSchema<P>> {
        yield this;
        for (const schema of this.schemas) {
            yield* schema.allSchemas();
        }
    }

    /**
     * Finds a category in this schema or its descendants.
     */
    public findCategory(id: string) {
        for (const schema of this.allSchemas()) {
            const category = schema.categories.get(id);
            if (category) return category;
        }
        return undefined;
    }

    /**
     * Creates an iterator for the categories in this schema or its descendants with the provided ids.
     */
    public * findCategories(...categoryIds: string[]) {
        for (const schema of this.allSchemas()) {
            yield* schema.categories.values(categoryIds);
        }
    }

    /**
     * Finds a property in this schema or its descendants.
     */
    public findProperty<K extends keyof P>(id: K) {
        for (const schema of this.allSchemas()) {
            const property = schema.properties.get(id);
            if (property) return property;
        }
        return undefined;
    }

    /**
     * Creates an iterator for the properties in this schema or its descendants with the provided ids.
     */
    public * findProperties<K extends keyof P>(...propertyIds: K[]) {
        for (const schema of this.allSchemas()) {
            yield* schema.properties.values(propertyIds);
        }
    }
}