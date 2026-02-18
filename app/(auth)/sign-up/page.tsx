'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui'
import { CountrySelectField, FooterLink, InputField, SelectField } from '@/components/widgets/Forms'
import { signUpWithEmailActions } from '@/lib/actions/auth.actions'
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from '@/shared/const/optionts'
import type { SignUpFormData } from '@/shared/types/global'

export default function SignUp() {
  const defaultValues = {
    fullName: '',
    email: '',
    password: '',
    country: 'RU',
    investmentGoals: 'Growth',
    riskTolerance: 'Medium',
    preferredIndustry: 'Technology',
  }

  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm<SignUpFormData>({ defaultValues, mode: 'onBlur' })

  console.log('Form errors:', errors)

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await signUpWithEmailActions(data)

      console.log('Sign-up result:', result)

      if (result.success) {
        router.push('/') // Redirect to dashboard after successful sign-up
        // You can add any additional logic here, such as redirecting the user or showing a success message
        console.log('Sign-up successful:', result.data)
      } else {
        toast.error(result.error || 'An error occurred during sign-up. Please try again later.')
      }
    } catch (e) {
      console.error(e)
      toast.error('An error occurred during sign-up. Please try again later.', {
        description: e instanceof Error ? e.message : 'Unknown error',
      })
    }
  }

  return (
    <>
      <h1 className="form-title">Sign Up & Personalize</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="Full Name"
          name="fullName"
          placeholder="Jojo"
          register={register}
          error={errors.fullName}
          validation={{
            required: 'Full Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          }}
        />
        <InputField
          label="Email"
          name="email"
          placeholder="Jojo@jojo.com"
          register={register}
          error={errors.email}
          validation={{
            required: 'Email name is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address',
            },
          }}
        />
        <InputField
          name="password"
          label="Password"
          placeholder="Enter a strong password"
          type="password"
          register={register}
          error={errors.password}
          validation={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          }}
        />
        <CountrySelectField
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required
        />

        <SelectField
          name="investmentGoals"
          label="Investment Goals"
          placeholder="Select your investment goals"
          error={errors.investmentGoals}
          options={INVESTMENT_GOALS}
          control={control}
          required
        />
        <SelectField
          name="riskTolerance"
          label="Risk Tolerance"
          placeholder="Select your risk level"
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
          required
        />

        <SelectField
          name="preferredIndustry"
          label="Preferred Industry"
          placeholder="Select your preferred industry"
          options={PREFERRED_INDUSTRIES}
          control={control}
          error={errors.preferredIndustry}
          required
        />
        <Button type="submit" className="yellow-btn w-full mt-5">
          {isSubmitted ? 'Creating account' : 'Start Your Investing Journey'}
        </Button>

        <FooterLink text="Already have an account?" linkText="Sign in" href="/sign-in" />
      </form>
    </>
  )
}
