'use server'

import { z } from 'zod'

const SignupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  college: z.string().min(2, { message: "College name must be at least 2 characters long" }),
  usn: z.string().min(10, { message: "USN must be at least 10 characters long" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const LoginSchema = z.object({
  usn: z.string().min(10, { message: "USN must be at least 10 characters long" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

export async function signUp(prevState: any, formData: FormData) {
  const validatedFields = SignupSchema.safeParse({
    username: formData.get('username'),
    college: formData.get('college'),
    usn: formData.get('usn'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to sign up.',
    }
  }

  const { username, college, usn, password } = validatedFields.data

  try {
    const response = await fetch('http://127.0.0.1:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, college, usn, password }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()

    if (data.signup) {
      return { message: 'Signup successful!', success: true }
    } else {
      return { message: 'Signup failed. Please try again.', success: false }
    }
  } catch (error) {
    console.error('Error:', error)
    return { message: 'An error occurred. Please try again later.', success: false }
  }
}

export async function login(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    usn: formData.get('usn'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to log in.',
      success: false
    }
  }

  const { usn, password } = validatedFields.data

  try {
    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usn, password }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()

    if (data.login) {
      return { message: 'Login successful!', success: true,usn:usn }
    } else {
      return { message: 'Login failed. Please check your credentials and try again.', success: false }
    }
  } catch (error) {
    console.error('Error:', error)
    return { message: 'An error occurred. Please try again later.', success: false }
  }
}