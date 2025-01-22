import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { Customer } from "./customer";
import { v4 as uuidv4 } from 'uuid';

export class CustomerService {
  private readonly tableName = "Customers";
  private readonly docClient: DynamoDBDocumentClient;

  constructor(docClient: DynamoDBDocumentClient) {
    this.docClient = docClient;
  }

  async createCustomer(customerData: Omit<Customer, "id">): Promise<Customer> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      id,
      ...customerData,
      createdAt: now,
      updatedAt: now,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: newCustomer,
      })
    );

    return newCustomer;
  }

  async getCustomer(id: string): Promise<Customer | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id },
      })
    );

    return result.Item ? (result.Item as Customer) : null;
  }

  async listCustomers(): Promise<Customer[]> {
    const result = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
      })
    );

    return result.Items as Customer[];
  }

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer | null> {
    const updateExpression = Object.keys(customerData)
      .map((key) => `#${key} = :${key}`)
      .join(", ");

    const expressionAttributeNames = Object.keys(customerData).reduce(
      (acc, key) => ({ ...acc, [`#${key}`]: key }),
      {}
    );

    const expressionAttributeValues = Object.entries(customerData).reduce(
      (acc, [key, value]) => ({ ...acc, [`:${key}`]: value }),
      {}
    );

    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpression}, #updatedAt = :updatedAt`,
        ExpressionAttributeNames: {
          ...expressionAttributeNames,
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ...expressionAttributeValues,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return result.Attributes as Customer | null;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const result = await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
        ReturnValues: "ALL_OLD",
      })
    );

    return !!result.Attributes;
  }
}