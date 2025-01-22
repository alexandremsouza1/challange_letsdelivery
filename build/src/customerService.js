"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const uuid_1 = require("uuid");
class CustomerService {
    constructor(docClient) {
        this.tableName = "Customers";
        this.docClient = docClient;
    }
    createCustomer(customerData) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            const now = new Date().toISOString();
            const newCustomer = Object.assign(Object.assign({ id }, customerData), { createdAt: now, updatedAt: now });
            yield this.docClient.send(new lib_dynamodb_1.PutCommand({
                TableName: this.tableName,
                Item: newCustomer,
            }));
            return newCustomer;
        });
    }
    getCustomer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.docClient.send(new lib_dynamodb_1.GetCommand({
                TableName: this.tableName,
                Key: { id },
            }));
            return result.Item ? result.Item : null;
        });
    }
    listCustomers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.docClient.send(new lib_dynamodb_1.ScanCommand({
                TableName: this.tableName,
            }));
            return result.Items;
        });
    }
    updateCustomer(id, customerData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateExpression = Object.keys(customerData)
                .map((key) => `#${key} = :${key}`)
                .join(", ");
            const expressionAttributeNames = Object.keys(customerData).reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [`#${key}`]: key })), {});
            const expressionAttributeValues = Object.entries(customerData).reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [`:${key}`]: value })), {});
            const result = yield this.docClient.send(new lib_dynamodb_1.UpdateCommand({
                TableName: this.tableName,
                Key: { id },
                UpdateExpression: `SET ${updateExpression}, #updatedAt = :updatedAt`,
                ExpressionAttributeNames: Object.assign(Object.assign({}, expressionAttributeNames), { "#updatedAt": "updatedAt" }),
                ExpressionAttributeValues: Object.assign(Object.assign({}, expressionAttributeValues), { ":updatedAt": new Date().toISOString() }),
                ReturnValues: "ALL_NEW",
            }));
            return result.Attributes;
        });
    }
    deleteCustomer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.docClient.send(new lib_dynamodb_1.DeleteCommand({
                TableName: this.tableName,
                Key: { id },
                ReturnValues: "ALL_OLD",
            }));
            return !!result.Attributes;
        });
    }
}
exports.CustomerService = CustomerService;
