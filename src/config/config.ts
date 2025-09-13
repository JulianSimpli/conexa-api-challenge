import * as Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().default('file:./dev.db'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PASSWORD: Joi.string().min(4).required(),
}).unknown();

const { error, value: validatedEnv } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = Object.freeze({
  nodeEnv: validatedEnv.NODE_ENV,
  port: validatedEnv.PORT,
  databaseUrl: validatedEnv.DATABASE_URL,
  jwt: {
    secret: validatedEnv.JWT_SECRET,
    expiresIn: validatedEnv.JWT_EXPIRES_IN,
  },
  admin: {
    email: validatedEnv.ADMIN_EMAIL,
    password: validatedEnv.ADMIN_PASSWORD,
  },
});
