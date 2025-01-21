"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCustomer = validateCustomer;
function validateCustomer(customer) {
    const errors = [];
    if (!customer.fullName) {
        errors.push("Full name is required");
    }
    if (!customer.dateOfBirth) {
        errors.push("Date of birth is required");
    }
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(customer.dateOfBirth)) {
        errors.push("Date of birth must be in YYYY-MM-DD format");
    }
    if (customer.isActive === undefined) {
        errors.push("Active status is required");
    }
    if (!customer.addresses || customer.addresses.length === 0) {
        errors.push("At least one address is required");
    }
    else {
        customer.addresses.forEach((address, index) => {
            if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
                errors.push(`Address ${index + 1} is incomplete`);
            }
        });
    }
    if (!customer.contacts || customer.contacts.length === 0) {
        errors.push("At least one contact is required");
    }
    else {
        let hasPrimaryContact = false;
        customer.contacts.forEach((contact, index) => {
            if (!contact.email && !contact.phone) {
                errors.push(`Contact ${index + 1} must have either an email or phone number`);
            }
            if (contact.isPrimary) {
                if (hasPrimaryContact) {
                    errors.push("Only one contact can be primary");
                }
                else {
                    hasPrimaryContact = true;
                }
            }
        });
        if (!hasPrimaryContact) {
            errors.push("At least one contact must be marked as primary");
        }
    }
    return errors;
}
