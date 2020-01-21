<details>
<summary>In This Article</summary>
<li><a href="#graphcommonschema">GraphCommonSchema</a></li>
<li><a href="#graphcommonschema.DataTypes">GraphCommonSchema.DataTypes</a></li>
</details>

# GraphCommonSchema
```ts
export declare namespace GraphCommonSchema {
    const Schema: GraphSchema;
    const BaseUri: GraphProperty<string>;
    const Version: GraphProperty<number>;
    const SourceNode: GraphProperty<GraphNode>;
    const TargetNode: GraphProperty<GraphNode>;
    const IsContainment: GraphProperty<boolean>;
    const IsPseudo: GraphProperty<boolean>;
    const IsTag: GraphProperty<boolean>;
    const Label: GraphProperty<string>;
    const UniqueId: GraphProperty<GraphNodeIdLike>;
    const Contains: GraphCategory;
}
```

### See Also
* [GraphSchema](graphSchema.md#graphschema)
* [DataType](dataType.md#datatype)
* [GraphCategory](graphCategory.md#graphcategory)
* [GraphProperty](graphProperty.md#graphproperty)
* [GraphNode](graphNode.md#graphnode)
* [GraphNodeIdLike](graphNode.md#graphnodeidlike)
* [API Documentation](index.md)

# GraphCommonSchema.DataTypes
```ts
export declare namespace GraphCommonSchema.DataTypes {
    export const string: DataType<string>;
    export const symbol: DataType<symbol>;
    export const number: DataType<number>;
    export const bigint: DataType<bigint>;
    export const boolean: DataType<boolean>;
    export const object: DataType<object>;
    const _function: DataType<Function>;
    export { _function as function };
    const _null: DataType<null>;
    export { _null as null };
    export const primitive: DataType<string | symbol | number | bigint | boolean>;
    export const undefined: DataType<undefined>;
    export const unknown: DataType<unknown>;
    export const never: DataType<never>;
    export const any: DataType<any>;
    export const GraphNode: DataType<GraphNode>;
    export const GraphNodeIdLike: DataType<GraphNodeIdLike>;
    export const GraphLink: DataType<GraphLink>;
    export const GraphProperty: DataType<GraphProperty>;
    export const GraphPropertyIdLike: DataType<GraphPropertyIdLike>;
    export const GraphCategory: DataType<GraphCategory>;
    export const GraphCategoryIdLike: DataType<GraphCategoryIdLike>;
    export const GraphObject: DataType<GraphObject>;
    export const GraphMetadata: DataType<GraphMetadata>;
    export const GraphSchema: DataType<GraphSchema>;
    export const GraphSchemaNameLike: DataType<GraphSchemaNameLike>;
    export const Graph: DataType<Graph>;
}
```

### See Also
* [DataType](dataType.md#datatype)
* [GraphNode](graphNode.md#graphnode)
* [GraphNodeIdLike](graphNode.md#graphnodeidlike)
* [GraphLink](graphLink.md#graphlink)
* [GraphProperty](graphProperty.md#graphproperty)
* [GraphPropertyIdLike](graphProperty.md#graphpropertyidlike)
* [GraphCategory](graphCategory.md#graphcategory)
* [GraphCategoryIdLike](graphCategory.md#graphcategoryidlike)
* [GraphObject](graphObject.md#graphobject)
* [GraphMetadata](graphMetadata.md#graphmetadata)
* [GraphSchema](graphSchema.md#graphschema)
* [GraphSchemaNameLike](graphSchema.md#graphschemanamelike)
* [Graph](graph.md#graph)
* [API Documentation](index.md)