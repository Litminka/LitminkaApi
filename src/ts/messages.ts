export const validation = {
    errors: {
        registration: {
            noLoginProvided: "no_login_provided",
            loginTaken: "login_taken",
            noEmailProvided: "no_email_provided",
            invalidEmail: "invalid_email",
            emailTaken: "email_taken",
            nameTooShort: "name_is_too_short",
            passwordTooShort: "password_is_too_short",
            passwordsDontMatch: "passwords_dont_match",
            noPasswordProvided: "no_password_provided"
        },
        base: {
            valueNotInRange: "value_not_in_range",
            requiresBoolean: "requires_boolean",
            validationFailed: "validation_failed",
            intValidationFailed: "int_validation_failed",
            boolValidationFailed: "bool_validation_failed"
        },
        search: {
            maxArraySizeExceeded: "max_array_size_exceeded",
            maxLengthExceeded: "max_length_exceeded",
            unknownType: "unknown_type",
        }
    }
}

export const baseMsg = validation.errors.base;
export const searchMsg = validation.errors.search;
export const registrationMsg = validation.errors.registration;