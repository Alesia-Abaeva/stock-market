'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui'
import { FooterLink, InputField } from '@/components/widgets/Forms'
import { signInWithEmailActions } from '@/lib/actions/auth.actions'
import { SignInFormData } from '@/shared/types/global'

export default function SignIn() {
  const defaultValues = {
    email: '',
    password: '',
  }

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<SignInFormData>({ defaultValues, mode: 'onBlur' })

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmailActions(data)

      console.log('Sign-in result:', result)

      if (result.success) {
        router.push('/') // Redirect to dashboard after successful sign-up
        // You can add any additional logic here, such as redirecting the user or showing a success message
        console.log('Sign-in successful:', result.data)
      } else {
        toast.error(result.error || 'An error occurred during sign-in. Please try again later.')
      }

      console.log(data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <h1 className="form-title">Log In Your Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <Button type="submit" className="yellow-btn w-full mt-5">
          {isSubmitted ? 'Signing In' : 'Log In'}
        </Button>

        <FooterLink text="Don’t have an account? " linkText=" Sign Up" href="/sign-up" />
      </form>
    </>
  )
}
