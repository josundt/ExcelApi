export enum DataType {
    "string",
    "boolean",
    "integer",
    "float",
    "date",
    "enum"
}

export interface PropertyInfo {
    name: string;
    dataType: DataType;
}

let dataTypeCategory = {
    all: [DataType.boolean, DataType.date, DataType.enum, DataType.float, DataType.integer, DataType.string],
    comparables: [DataType.date, DataType.float, DataType.integer]
}

export interface SortParameter {
    property: PropertyInfo;
    descending: boolean;
}

export interface FilterParameter {
    property: PropertyInfo;
    operator: FilterOperator;
    value: string;
}

export interface QueryOptions {
    sort?: SortParameter;
    filters?: FilterParameter[];
}

export interface FilterOperator {
    formatString: string;
    supportedTypes: DataType[];
}

export interface FilterOperatorMap {
    equals: FilterOperator;
    notEquals: FilterOperator;
    lessThan: FilterOperator;
    greaterThan: FilterOperator;
    lessThanOrEqualTo: FilterOperator;
    greaterThanOrEqualTo: FilterOperator;
    contains: FilterOperator;
    startsWith: FilterOperator;
    endsWith: FilterOperator;
}

export let FilterOperators: FilterOperatorMap = {
    equals: {
        formatString: "%1 eq %2",
        supportedTypes: dataTypeCategory.all
    },
    notEquals: {
        formatString: "%1 ne %2",
        supportedTypes: dataTypeCategory.all
    },
    lessThan: {
        formatString: "%1 lt %2",
        supportedTypes: dataTypeCategory.comparables
    },
    lessThanOrEqualTo: {
        formatString: "%1 le %2",
        supportedTypes: dataTypeCategory.comparables
    },
    greaterThan: {
        formatString: "%1 gt %2",
        supportedTypes: dataTypeCategory.comparables
    },
    greaterThanOrEqualTo: {
        formatString: "%1 ge %2",
        supportedTypes: dataTypeCategory.comparables
    },
    contains: {
        formatString: "contains(%1,%2)",
        supportedTypes: [DataType.string]
    },
    notContains: {
        formatString: "contains(%1,%2) eq false",
        supportedTypes: [DataType.string]
    },
    startsWith: {
        formatString: "startswith(%1, %2)",
        supportedTypes: [DataType.string]
    },
    endsWith: {
        formatString: "endswith(%1, %2)",
        supportedTypes: [DataType.string]
    }
};
