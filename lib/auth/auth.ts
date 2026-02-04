import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { nextCookies } from 'better-auth/next-js'

import { connectToDataBase } from '@/database/mongoose'

let authInstance: ReturnType<typeof betterAuth> | null = null

export const getAuth = async () => {
  if (authInstance) {
    return authInstance
  }

  const mongoose = await connectToDataBase()
  const db = mongoose?.connection.db

  if (!db) {
    throw new Error('Database connection is not established')
  }
  authInstance = betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET || '',
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 6,
      maxPasswordLength: 100,
      autoSignIn: true,
    },

    plugins: [nextCookies()],
  })

  return authInstance
}
// your mongodb client
export const auth = await getAuth()
