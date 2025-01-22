import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { CustomerService } from './customerService';
import { Customer } from './customer';

const dynamoDbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoDbClient);


const customerService = new CustomerService(docClient);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    switch (event.httpMethod) {
      case 'POST':
        return await createCustomer(event);
      case 'GET':
        return event.pathParameters?.id
          ? await getCustomer(event.pathParameters.id)
          : await listCustomers();
      case 'PUT':
        return await updateCustomer(event);
      case 'DELETE':
        return await deleteCustomer(event);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Unsupported HTTP method' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

async function createCustomer(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const customerData: Customer = JSON.parse(event.body || '{}');
  const newCustomer = await customerService.createCustomer(customerData);
  return {
    statusCode: 201,
    body: JSON.stringify(newCustomer),
  };
}

async function getCustomer(id: string): Promise<APIGatewayProxyResult> {
  const customer = await customerService.getCustomer(id);
  if (customer) {
    return {
      statusCode: 200,
      body: JSON.stringify(customer),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Customer not found' }),
    };
  }
}

async function listCustomers(): Promise<APIGatewayProxyResult> {
  const customers = await customerService.listCustomers();
  return {
    statusCode: 200,
    body: JSON.stringify(customers),
  };
}

async function updateCustomer(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing customer ID' }),
    };
  }

  const customerData: Partial<Customer> = JSON.parse(event.body || '{}');
  const updatedCustomer = await customerService.updateCustomer(id, customerData);

  if (updatedCustomer) {
    return {
      statusCode: 200,
      body: JSON.stringify(updatedCustomer),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Customer not found' }),
    };
  }
}

async function deleteCustomer(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing customer ID' }),
    };
  }

  const success = await customerService.deleteCustomer(id);
  if (success) {
    return {
      statusCode: 204,
      body: '',
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Customer not found' }),
    };
  }
}