import { z } from 'zod'

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  VITE_ENV: z.union([z.literal('development'), z.literal('testing'), z.literal('production')]).default('development'),
  VITE_ACCESS_TOKEN: z.string(),
  VITE_HOST_API: z.string(),
  VITE_HOST_API_MOCK: z.string(),
  VITE_HOST_API_MOCK_1: z.string()
})

// Validate `env` against our schema
// and return the result
const env = envSchema.parse(import.meta.env)

// Export the result so we can use it in the project
export default env
