import { validateCustomer, Customer } from '../src/customer';

describe('validateCustomer', () => {
  it('should return no errors for a valid customer', () => {
    const validCustomer: Partial<Customer> = {
      fullName: 'John Doe',
      dateOfBirth: '1985-07-15',
      isActive: true,
      addresses: [
        {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62704',
          country: 'USA',
        },
      ],
      contacts: [
        {
          email: 'john@example.com',
          phone: '1234567890',
          isPrimary: true,
        },
      ],
    };

    const errors = validateCustomer(validCustomer);
    expect(errors).toHaveLength(0);
  });

  it('should return an error for missing fullName', () => {
    const customer: Partial<Customer> = {
      dateOfBirth: '1985-07-15',
      isActive: true,
      addresses: [
        {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62704',
          country: 'USA',
        },
      ],
      contacts: [
        {
          email: 'john@example.com',
          phone: '1234567890',
          isPrimary: true,
        },
      ],
    };

    const errors = validateCustomer(customer);
    expect(errors).toContain('Full name is required');
  });

  it('should return an error for invalid dateOfBirth format', () => {
    const customer: Partial<Customer> = {
      fullName: 'John Doe',
      dateOfBirth: '15-07-1985', // Invalid format
      isActive: true,
      addresses: [
        {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62704',
          country: 'USA',
        },
      ],
      contacts: [
        {
          email: 'john@example.com',
          phone: '1234567890',
          isPrimary: true,
        },
      ],
    };

    const errors = validateCustomer(customer);
    expect(errors).toContain('Date of birth must be in YYYY-MM-DD format');
  });

  it('should return an error for missing addresses', () => {
    const customer: Partial<Customer> = {
      fullName: 'John Doe',
      dateOfBirth: '1985-07-15',
      isActive: true,
      contacts: [
        {
          email: 'john@example.com',
          phone: '1234567890',
          isPrimary: true,
        },
      ],
    };

    const errors = validateCustomer(customer);
    expect(errors).toContain('At least one address is required');
  });

  it('should return an error for incomplete address', () => {
    const customer: Partial<Customer> = {
      fullName: 'John Doe',
      dateOfBirth: '1985-07-15',
      isActive: true,
      addresses: [
        {
          street: '123 Main St',
          city: 'Springfield',
          state: '',
          zipCode: '62704',
          country: 'USA',
        },
      ],
      contacts: [
        {
          email: 'john@example.com',
          phone: '1234567890',
          isPrimary: true,
        },
      ],
    };

    const errors = validateCustomer(customer);
    expect(errors).toContain('Address 1 is incomplete');
  });

  it('should return an error for missing contacts', () => {
    const customer: Partial<Customer> = {
      fullName: 'John Doe',
      dateOfBirth: '1985-07-15',
      isActive: true,
      addresses: [
        {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62704',
          country: 'USA',
        },
      ],
    };

    const errors = validateCustomer(customer);
    expect(errors).toContain('At least one contact is required');
  });

  it('should return an error if multiple contacts are marked as primary', () => {
    const customer: Partial<Customer> = {
      fullName: 'John Doe',
      dateOfBirth: '1985-07-15',
      isActive: true,
      addresses: [
        {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62704',
          country: 'USA',
        },
      ],
      contacts: [
        {
          email: 'primary1@example.com',
          phone: '1234567890',
          isPrimary: true,
        },
        {
          email: 'primary2@example.com',
          phone: '0987654321',
          isPrimary: true,
        },
      ],
    };

    const errors = validateCustomer(customer);
    expect(errors).toContain('Only one contact can be primary');
  });

  it('should return an error if no contact is marked as primary', () => {
    const customer: Partial<Customer> = {
      fullName: 'John Doe',
      dateOfBirth: '1985-07-15',
      isActive: true,
      addresses: [
        {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62704',
          country: 'USA',
        },
      ],
      contacts: [
        {
          email: 'contact1@example.com',
          phone: '1234567890',
          isPrimary: false,
        },
      ],
    };

    const errors = validateCustomer(customer);
    expect(errors).toContain('At least one contact must be marked as primary');
  });
});
