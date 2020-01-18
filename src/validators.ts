import { TypeOfDataTypeName } from "./dataType";

export const isString = (value: any): value is string => typeof value === "string";
export const isSymbol = (value: any): value is symbol => typeof value === "symbol";
export const isNumber = (value: any): value is number => typeof value === "number";
export const isBigInt = (value: any): value is bigint => typeof value === "bigint";
export const isBoolean = (value: any): value is boolean => typeof value === "boolean";
export const isObject = (value: any): value is object => typeof value === "object" && value !== null;
export const isFunction = (value: any): value is Function => typeof value === "function";
export const isUndefined = (value: any): value is undefined => value === undefined;
export const isNull = (value: any): value is null => value === null;
export const isUnknown = (value: any): value is unknown => true;
export const isNever = (value: any): value is never => false;
export const isAny = (value: any): value is any => true;
export const isGraphNode = (value: any) => value instanceof GraphNode;
export const isGraphLink = (value: any) => value instanceof GraphLink;
export const isGraphProperty = (value: any) => value instanceof GraphProperty;
export const isGraphCategory = (value: any) => value instanceof GraphCategory;
export const isGraphObject = (value: any) => value instanceof GraphObject;
export const isGraphMetadata = (value: any) => value instanceof GraphMetadata;
export const isGraphSchema = (value: any) => value instanceof GraphSchema;
export const isGraph = (value: any) => value instanceof Graph;
export const isGraphNodeIdLike = (value: any): value is GraphNodeIdLike => isSymbol(value) || isString(value);
export const isGraphCategoryIdLike = (value: any): value is GraphCategoryIdLike => isSymbol(value) || isString(value);
export const isGraphPropertyIdLike = (value: any): value is GraphPropertyIdLike => isSymbol(value) || isString(value);
export const isGraphSchemaNameLike = (value: any): value is GraphSchemaNameLike => isSymbol(value) || isString(value);

export function getValidator<D extends string>(dataType: D): ((value: any) => value is TypeOfDataTypeName<D>) | undefined;
export function getValidator<D extends readonly string[]>(dataTypes: D): ((value: any) => value is TypeOfDataTypeName<D[number]>) | undefined;
export function getValidator(dataTypes: string | readonly string[]) {
    if (typeof dataTypes === "string") {
        dataTypes = dataTypes.split("|");
    }
    dataTypes = dataTypes.map(dataType => dataType.trim());
    if (dataTypes.length === 1) {
        return getSingleValidator(dataTypes[0]);
    }
    const validators: ((value: any) => boolean)[] = [];
    for (const dataType of dataTypes) {
        const validator = getSingleValidator(dataType);
        if (validator === undefined) {
            return undefined;
        }
        validators.push(validator);
    }
    return (value: any) => validators.some(validator => validator(value));
}

function getSingleValidator(dataType: string): ((value: any) => boolean) | undefined {
    switch (dataType) {
        case "string": return isString;
        case "symbol": return isSymbol;
        case "number": return isNumber;
        case "bigint": return isBigInt;
        case "boolean": return isBoolean;
        case "object": return isObject;
        case "function": return isFunction;
        case "null": return isUndefined;
        case "undefined": return isNull;
        case "unknown": return isUnknown;
        case "never": return isNever;
        case "any": return isAny;
        case "graphModel/GraphNode": return isGraphNode;
        case "graphModel/GraphNodeIdLike": return isGraphNodeIdLike;
        case "graphModel/GraphLink": return isGraphLink;
        case "graphModel/GraphProperty": return isGraphProperty;
        case "graphModel/GraphPropertyIdLike": return isGraphPropertyIdLike;
        case "graphModel/GraphCategory": return isGraphCategory;
        case "graphModel/GraphCategoryIdLike": return isGraphCategoryIdLike;
        case "graphModel/GraphObject": return isGraphObject;
        case "graphModel/GraphMetadata": return isGraphMetadata;
        case "graphModel/GraphSchema": return isGraphSchema;
        case "graphModel/GraphSchemaNameLike": return isGraphSchemaNameLike;
        case "graphModel/Graph": return isGraph;
    }
}

import { GraphNode, GraphNodeIdLike } from "./graphNode";
import { GraphLink } from "./graphLink";
import { Graph } from "./graph";
import { GraphProperty, GraphPropertyIdLike } from "./graphProperty";
import { GraphCategory, GraphCategoryIdLike } from "./graphCategory";
import { GraphObject } from "./graphObject";
import { GraphMetadata } from "./graphMetadata";
import { GraphSchema, GraphSchemaNameLike } from "./graphSchema";

