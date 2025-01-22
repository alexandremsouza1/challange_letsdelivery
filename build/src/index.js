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
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const customerService_1 = require("./customerService");
const dynamoDbClient = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoDbClient);
const customerService = new customerService_1.CustomerService(docClient);
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        switch (event.httpMethod) {
            case 'POST':
                return yield createCustomer(event);
            case 'GET':
                return ((_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id)
                    ? yield getCustomer(event.pathParameters.id)
                    : yield listCustomers();
            case 'PUT':
                return yield updateCustomer(event);
            case 'DELETE':
                return yield deleteCustomer(event);
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Unsupported HTTP method' }),
                };
        }
    }
    catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
});
exports.handler = handler;
function createCustomer(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const customerData = JSON.parse(event.body || '{}');
        const newCustomer = yield customerService.createCustomer(customerData);
        return {
            statusCode: 201,
            body: JSON.stringify(newCustomer),
        };
    });
}
function getCustomer(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const customer = yield customerService.getCustomer(id);
        if (customer) {
            return {
                statusCode: 200,
                body: JSON.stringify(customer),
            };
        }
        else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Customer not found' }),
            };
        }
    });
}
function listCustomers() {
    return __awaiter(this, void 0, void 0, function* () {
        const customers = yield customerService.listCustomers();
        return {
            statusCode: 200,
            body: JSON.stringify(customers),
        };
    });
}
function updateCustomer(event) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing customer ID' }),
            };
        }
        const customerData = JSON.parse(event.body || '{}');
        const updatedCustomer = yield customerService.updateCustomer(id, customerData);
        if (updatedCustomer) {
            return {
                statusCode: 200,
                body: JSON.stringify(updatedCustomer),
            };
        }
        else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Customer not found' }),
            };
        }
    });
}
function deleteCustomer(event) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing customer ID' }),
            };
        }
        const success = yield customerService.deleteCustomer(id);
        if (success) {
            return {
                statusCode: 204,
                body: '',
            };
        }
        else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Customer not found' }),
            };
        }
    });
}
