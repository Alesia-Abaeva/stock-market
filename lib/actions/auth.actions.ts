'use server'

import { headers } from 'next/headers'

import { SignInFormData, SignUpFormData } from '@/shared/types/global'

import { auth } from '../auth/auth'
import { inngest } from '../inngest/client'

export const signUpWithEmailActions = async (data: SignUpFormData) => {
  const { fullName, email, password, country, investmentGoals, preferredIndustry, riskTolerance } =
    data

  try {
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: fullName,
      },
    })

    if (response) {
      await inngest.send({
        name: 'app/user.created',
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      })
    }

    return { success: true, data: response }
  } catch (error) {
    console.error('Error during sign-up:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An error occurred during sign-up. Please try again later.',
    }
  }
}

export const signOutAction = async () => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    })

    return { success: true }
  } catch (error) {
    console.error('Error during sign-out:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An error occurred during sign-out. Please try again later.',
    }
  }
}

export const signInWithEmailActions = async (data: SignInFormData) => {
  const { email, password } = data

  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    })

    return { success: true, data: response }
  } catch (error) {
    console.error('Error during sign-in:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An error occurred during sign-in. Please try again later.',
    }
  }
}
