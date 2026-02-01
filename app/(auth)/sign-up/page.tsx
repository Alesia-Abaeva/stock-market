'use client'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui'
import { CountrySelectField, InputField, SelectField } from '@/components/widgets/Forms'
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm<SignUpFormData>({ defaultValues, mode: 'onBlur' })

  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log(data)
    } catch (e) {
      console.error(e)
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
          validation={{ required: 'Full Name is required', minLength: 2 }}
        />
        <InputField
          label="Email"
          name="email"
          placeholder="Jojo@jojo.com"
          register={register}
          error={errors.email}
          validation={{
            required: 'Email name is required',
            pattern: /^\w+@\w+\.\w+$/,
          }}
        />
        <InputField
          name="password"
          label="Password"
          placeholder="Enter a strong password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: 'Password is required', minLength: 8 }}
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
      </form>
    </>
  )
}
