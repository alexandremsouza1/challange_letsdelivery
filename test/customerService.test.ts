import { CustomerService } from '../src/customerService';
import { Customer } from '../src/customer';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

describe('CustomerService', () => {
  let customerService: CustomerService;

  beforeAll(() => {
    const client = new DynamoDBClient({
      endpoint: 'http://localhost:8000',
      region: 'local-env',
      credentials: {
        accessKeyId: 'fakeMyKeyId',
        secretAccessKey: 'fakeSecretAccessKey',
      },
    });
    const docClient = DynamoDBDocumentClient.from(client);
    customerService = new CustomerService(docClient);
  });

  afterEach(async () => {
    const customers = await customerService.listCustomers();
    for (const customer of customers) {
      await customerService.deleteCustomer(customer.id);
    }
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      const customerData: Omit<Customer, "id"> = {
        fullName: "John Doe",
        dateOfBirth: "1990-01-01",
        isActive: true,
        addresses: [
          {
            street: "123 Main St",
            city: "Springfield",
            state: "IL",
            zipCode: "62704",
            country: "USA",
          },
        ],
        contacts: [
          {
            email: "john@example.com",
            phone: "1234567890",
            isPrimary: true,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newCustomer = await customerService.createCustomer(customerData);

      expect(newCustomer).toHaveProperty('id');
      expect(newCustomer.fullName).toBe(customerData.fullName);
      expect(newCustomer.dateOfBirth).toBe(customerData.dateOfBirth);
      expect(newCustomer.isActive).toBe(customerData.isActive);
      expect(newCustomer.addresses).toEqual(customerData.addresses);
      expect(newCustomer.contacts).toEqual(customerData.contacts);
      expect(newCustomer).toHaveProperty('createdAt');
      expect(newCustomer).toHaveProperty('updatedAt');
    });
  });

  describe('getCustomer', () => {
    it('should retrieve an existing customer', async () => {
      const customerData: Omit<Customer, "id"> = {
        fullName: 'Jane Doe',
        dateOfBirth: '1985-07-15',
        isActive: true,
        addresses: [
          {
            street: "456 Elm St",
            city: "Shelbyville",
            state: "IL",
            zipCode: "62705",
            country: "USA",
          },
        ],
        contacts: [
          {
            email: "jane@example.com",
            phone: "0987654321",
            isPrimary: true,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newCustomer = await customerService.createCustomer(customerData);
      const retrievedCustomer = await customerService.getCustomer(newCustomer.id);

      expect(retrievedCustomer).toEqual(newCustomer);
    });

    it('should return null for non-existent customer', async () => {
      const nonExistentId = 'non-existent-id';
      const retrievedCustomer = await customerService.getCustomer(nonExistentId);

      expect(retrievedCustomer).toBeNull();
    });
  });

  describe('listCustomers', () => {
    it('should list all customers', async () => {
      const customerData1: Omit<Customer, "id"> = {
        fullName: 'Alice',
        dateOfBirth: '1992-03-22',
        isActive: true,
        addresses: [
          {
            street: "789 Oak St",
            city: "Capital City",
            state: "IL",
            zipCode: "62706",
            country: "USA",
          },
        ],
        contacts: [
          {
            email: "alice@example.com",
            phone: "1111111111",
            isPrimary: true,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const customerData2: Omit<Customer, "id"> = {
        fullName: 'Bob',
        dateOfBirth: '1988-11-02',
        isActive: false,
        addresses: [
          {
            street: "123 Pine St",
            city: "Springfield",
            state: "IL",
            zipCode: "62704",
            country: "USA",
          },
        ],
        contacts: [
          {
            email: "bob@example.com",
            phone: "2222222222",
            isPrimary: true,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await customerService.createCustomer(customerData1);
      await customerService.createCustomer(customerData2);

      const customers = await customerService.listCustomers();

      expect(customers).toHaveLength(2);
      expect(customers[0]).toHaveProperty('id');
      expect(customers[1]).toHaveProperty('id');
    });
  });
});
