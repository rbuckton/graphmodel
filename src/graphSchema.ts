import { GraphSchemaCollection } from "./graphSchemaCollection";
import { GraphCategoryCollection } from "./graphCategoryCollection";
import { GraphCategory } from "./graphCategory";
import { GraphPropertyCollection } from "./graphPropertyCollection";
import { GraphProperty } from "./graphProperty";
import { Graph } from "./graph";

export class GraphSchema<P extends object = any> {
    public readonly ["[[Properties]]"]: P;
    public readonly graph: Graph<P> | undefined;
    public readonly schemas: GraphSchemaCollection<P> = GraphSchemaCollection._create(this);
    public readonly categories: GraphCategoryCollection<P> = GraphCategoryCollection._create(this);
    public readonly properties: GraphPropertyCollection<P> = GraphPropertyCollection._create(this);
    public readonly name: string;

    constructor(name: string, ...schemas: GraphSchema<P>[]) {
        this.name = name;
        for (const schema of schemas) this.addSchema(schema);
    }

    public hasSchema(schema: GraphSchema<P>) {
        if (schema === this) return true;
        for (const value of this.schemas.values()) if (value.hasSchema(schema)) return true;
        return false;
    }

    public addSchema(schema: GraphSchema<P>) {
        this.schemas.add(schema);
        return this;
    }

    public * allSchemas(): IterableIterator<GraphSchema<P>> {
        yield this;
        for (const schema of this.schemas) {
            yield* schema.allSchemas();
        }
    }

    public findCategory(id: string) {
        for (const schema of this.allSchemas()) {
            const category = schema.categories._get(id);
            if (category) return category;
        }
        return undefined;
    }

    public * findCategories(...categoryIds: string[]) {
        for (const schema of this.allSchemas()) {
            yield* schema.categories.values(categoryIds);
        }
    }

    public findProperty<K extends keyof P>(id: K) {
        for (const schema of this.allSchemas()) {
            const property = schema.properties.get(id);
            if (property) return property;
        }
        return undefined;
    }

    public * findProperties<K extends keyof P>(...propertyIds: K[]) {
        for (const schema of this.allSchemas()) {
            yield* schema.properties.values(propertyIds);
        }
    }
}