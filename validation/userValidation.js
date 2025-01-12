const joi = require("joi");

const userValidation = joi.object({
    username: joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': 'Username should be a type of string',
            'string.min': 'Username should have at least 3 characters',
            'any.required': 'Username is required',
        }),

    password: joi.string()
        .pattern(
            new RegExp(
                '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])$'
            )
        )
        .min(8)
        .max(16)
        .required()
        .messages({
            'string.base': 'Password should be a type of string',
            'string.min': 'Password should have at least 8 characters',
            'any.required': 'Password is required',
        }),
});

const validateUser = (userData) => {
    const { error, value } = userValidation.validate(userData);
    if (error) {
        return {
            isValid: false,
            message: error.details[0].message,
        };
    }
    return {
        isValid: true,
        message: 'Validation successful',
    };
};

model.exports = validateUser;