'use client'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui'
import { InputField } from '@/components/widgets/Forms'
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
    <div className="flex min-h-screen  home-wrapper">
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

        <Button type="submit" className="yellow-btn w-full mt-5">
          {isSubmitted ? 'Creating account' : 'Start Your Investing Journey'}
        </Button>
      </form>
    </div>
  )
}
