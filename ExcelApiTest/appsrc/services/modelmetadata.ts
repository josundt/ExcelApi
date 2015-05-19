import {DataType, PropertyInfo, LabeledItem, EntityMetadata} from "services/OData";

export interface Person {
    FirstName: string;
    LastName: string;
    BirthDate: Date;
    /** enum: Gender **/
    Gender: string;
    YearlyIncome: number;
    IsStudent: boolean;
}

export var PersonMetadata: EntityMetadata = {
    properties: [
        { text: "First name", value: { name: "FirstName", dataType: DataType.string } },
        { text: "Last name", value: { name: "LastName", dataType: DataType.string } },
        { text: "Birth date", value: { name: "BirthDate", dataType: DataType.date } },
        { text: "Gender", value: { name: "Gender", dataType: DataType.enum } },
        { text: "Yearly income", value: { name: "YearlyIncome", dataType: DataType.float } },
        { text: "Is student", value: { name: "IsStudent", dataType: DataType.boolean } }
    ]
};