import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.'),
})

export const signUpSchema = z.object({
  fullName: z
    .string()
    .max(100, 'Full name is too long.')
    .optional()
    .or(z.literal('')),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(30, 'Username must be at most 30 characters.')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores.'
    ),
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.'),
  age: z.coerce
    .number('Age must be a valid number.')
    .min(18, 'You must be at least 18 years old to create an account.')
    .max(120, 'Please enter a valid age.'),
  gender: z
    .enum(['male', 'female', 'other', 'prefer_not_to_say'])
    .optional()
    .or(z.literal('')),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
