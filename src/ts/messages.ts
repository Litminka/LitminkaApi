export const validation = {
    errors: {
        registration: {
            noLoginProvided: 'no_login_provided',
            loginTaken: 'login_taken',
            noEmailProvided: 'no_email_provided',
            invalidEmail: 'invalid_email',
            emailTaken: 'email_taken',
            nameTooShort: 'name_is_too_short',
            passwordTooShort: 'password_is_too_short',
            passwordsDontMatch: 'passwords_dont_match',
            noPasswordProvided: 'no_password_provided'
        },
        base: {
            valueNotInRange: 'value_not_in_range',
            validationFailed: 'validation_failed',
            valueIsNotProvided: 'value_is_not_provided',
            valueMustBeInt: 'value_must_be_int',
            valueMustBeBool: 'value_must_be_bool',
            valueMustBeString: 'value_must_be_string',
            valueMustBeUUID: 'value_must_be_UUID',
            valueMustBeAnArray: 'value_must_be_an_array',
            valueMustBeDate: 'value_must_be_date'
        },
        search: {
            maxArraySizeExceeded: 'max_array_size_exceeded',
            maxLengthExceeded: 'max_length_exceeded',
            unknownType: 'unknown_type'
        },
        session: {
            invalidSessionToken: 'invalid_session_token'
        }
    }
};

export const baseMsg = validation.errors.base;
export const searchMsg = validation.errors.search;
export const registrationMsg = validation.errors.registration;
export const sessionMsg = validation.errors.session;
