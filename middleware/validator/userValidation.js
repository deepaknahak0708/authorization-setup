const Joi = require('joi');

const userSchema = Joi.object({
    firstname: Joi.string().empty().min(2).required().trim().messages({
      'string.empty': 'First name must be required.',
      'string.min': 'First name should have a minimum length of 2',
      'any.required': 'First name must be required.'
    }),
    lastname: Joi.string().empty().min(2).required().trim().messages({
      'string.empty': 'Last name must be required.',
      'string.min': 'last name should have a minimum length of 2',
      'any.required': 'last name must be required.'
    }),
    email: Joi.string().email().required().empty().trim().messages({
      'string.empty': 'Email must be required.',
      'any.required': 'Email must be required.',
      'string.email': 'Invalid email address.'
    }),
    password: Joi.string().required().min(6).trim().messages({
      'string.empty': 'Password must be required.',
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password must be required.'
    }),
    phone: Joi.string()
      .regex(/^[0-9]{10}$/)
      .allow(null)
      .allow('')
      .trim()
      .messages({ 'string.pattern.base': 'Phone number must have 10 digits.' })
  })
  
  module.exports = userSchema