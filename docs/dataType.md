<details>
<summary>In This Article</summary>
<li><a href="#datatype">DataType</a></li>
<li><a href="#datatypenamelike">DataTypeNameLike</a></li>
<li><a href="#typeofdatatypename">TypeOfDataTypeName</a></li>
</details>

# DataType
```ts
export declare class DataType<T = any> {
    /**
     * The default DataType representing the `string` type.
     */
    static readonly string: DataType<string>;
    /**
     * The default DataType representing the `symbol` type.
     */
    static readonly symbol: DataType<symbol>;
    /**
     * The default DataType representing the `number` type.
     */
    static readonly number: DataType<number>;
    /**
     * The default DataType representing the `bigint` type.
     */
    static readonly bigint: DataType<bigint>;
    /**
     * The default DataType representing the `boolean` type.
     */
    static readonly boolean: DataType<boolean>;
    /**
     * The default DataType representing the `object` type.
     */
    static readonly object: DataType<object>;
    /**
     * The default DataType representing the `function` type.
     */
    static readonly function: DataType<Function>;
    /**
     * The default DataType representing the `null` type.
     */
    static readonly null: DataType<null>;
    /**
     * The default DataType representing the `undefined` type.
     */
    static readonly undefined: DataType<undefined>;
    /**
     * The default DataType representing the TypeScript `unknown` type.
     */
    static readonly unknown: DataType<unknown>;
    /**
     * The default DataType representing the TypeScript `never` type.
     */
    static readonly never: DataType<never>;
    /**
     * The default DataType representing the TypeScript `any` type.
     */
    static readonly any: DataType<any>;
    /**
     * For internal use only. Instances should be created via 
     * `GraphSchema.dataTypes.getOrCreate()`.
     */
    private constructor();
    /**
     * Creates a data type that represents a union of multiple data types.
     */
    static union<A extends readonly DataType[]>(...dataTypes: A):
        DataType<A[number]>;
    /**
     * Gets the name for the data type
     */
    get name(): DataTypeNameLike;
    /**
     * Gets the package name and submodule path for this data type (if available).
     */
    get packageQualifier(): string;
    /**
     * Gets the fully-qualified name for the data type.
     */
    get fullName(): DataTypeNameLike;
    /**
     * Gets a value indicating whether this data type supports validation.
     */
    get canValidate(): boolean;
    /**
     * Validates whether a value is valid for this data type.
     */
    validate(value: any): value is T;
}
```

### See Also
* [DataTypeCollection](dataTypeCollection.md#datatypecollection)
* [DataTypeNameLike](#datatypenamelike)
* [API Documentation](index.md)

# DataTypeNameLike
```ts
export declare type DataTypeNameLike = string | symbol;
```

### See Also
* [DataType](#datatype)
* [API Documentation](index.md)

# TypeOfDataTypeName
```ts
export type TypeOfDataTypeName<N extends DataTypeNameLike, Q extends string = ""> =
    Q extends "" ?
        N extends "string" ? string :
        N extends "symbol" ? symbol :
        N extends "number" ? number :
        N extends "bigint" ? bigint :
        N extends "boolean" ? boolean :
        N extends "object" ? object :
        N extends "function" ? Function :
        N extends "null" ? null :
        N extends "undefined" ? undefined :
        N extends "unknown" ? unknown :
        N extends "never" ? never :
        N extends "any" ? any :
        N extends "graphmodel!GraphNode" ? GraphNode :
        N extends "graphmodel!GraphNodeIdLike" ? GraphNodeIdLike :
        N extends "graphmodel!GraphLink" ? GraphLink :
        N extends "graphmodel!GraphProperty" ? GraphProperty :
        N extends "graphmodel!GraphPropertyIdLike" ? GraphPropertyIdLike :
        N extends "graphmodel!GraphCategory" ? GraphCategory :
        N extends "graphmodel!GraphCategoryIdLike" ? GraphCategoryIdLike :
        N extends "graphmodel!GraphObject" ? GraphObject :
        N extends "graphmodel!GraphMetadata" ? GraphMetadata :
        N extends "graphmodel!GraphSchema" ? GraphSchema :
        N extends "graphmodel!GraphSchemaNameLike" ? GraphSchemaNameLike :
        N extends "graphmodel!Graph" ? Graph :
        unknown :
    Q extends "graphmodel" ?
        N extends "GraphNode" ? GraphNode :
        N extends "GraphNodeIdLike" ? GraphNodeIdLike :
        N extends "GraphLink" ? GraphLink :
        N extends "GraphProperty" ? GraphProperty :
        N extends "GraphPropertyIdLike" ? GraphPropertyIdLike :
        N extends "GraphCategory" ? GraphCategory :
        N extends "GraphCategoryIdLike" ? GraphCategoryIdLike :
        N extends "GraphObject" ? GraphObject :
        N extends "GraphMetadata" ? GraphMetadata :
        N extends "GraphSchema" ? GraphSchema :
        N extends "GraphSchemaNameLike" ? GraphSchemaNameLike :
        N extends "Graph" ? Graph :
        unknown :
    unknown;
```

### See Also
* [DataType](#datatype)
* [Graph](graph.md#graph)
* [GraphNode](graphNode.md#graphnode)
* [GraphNodeIdLike](graphNode.md#graphnodeidlike)
* [GraphLink](graphLink.md#graphlink)
* [GraphProperty](graphProperty.md#graphproperty)
* [GraphPropertyIdLike](graphProperty.md#graphpropertyidlike)
* [GraphCategory](graphCategory.md#graphcategory)
* [GraphCategoryIdLike](graphCategory.md#graphcategoryidlike)
* [GraphObject](graphObject.md#graphobject)
* [GraphMetadata](graphMetadata.md#graphmetadata)
* [GraphScheme](graphScheme.md#graphscheme)
* [GraphSchemeNameLike](graphScheme.md#graphschemenamelike)
* [API Documentation](index.md)
