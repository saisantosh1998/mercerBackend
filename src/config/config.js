const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');


dotenv.config({ path: path.join(__dirname, '../../.env') });


// schema for environment  variables for required variables 
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
  })
  .unknown();// to accept extra variable as well

// to validate the environment variables and checck for errrors if not export the required variables
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
module.exports = {
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
