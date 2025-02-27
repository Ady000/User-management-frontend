'use client';

import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import FormField from '@/components/FormField';
import AuthRedirect from '@/components/AuthRedirect';
import { useAuth } from '@/contexts/AuthContext';
import { SignupData } from '@/types';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  birthDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Invalid date'),
  gender: z.enum(['male', 'female', 'other']),
  description: z.string().optional(),
});

export default function SignupPage() {
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupData) => {
    setIsSubmitting(true);
    try {
      await signup(data);
      toast.success('Account created successfully! Please log in.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthRedirect>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">Create an Account</h1>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Username"
              type="text"
              id="username"
              placeholder="Enter username"
              error={errors.username?.message}
              {...register('username')}
            />
            
            <FormField
              label="Email"
              type="email"
              id="email"
              placeholder="Enter email"
              error={errors.email?.message}
              {...register('email')}
            />
            
            <FormField
              label="Password"
              type="password"
              id="password"
              placeholder="Enter password"
              error={errors.password?.message}
              {...register('password')}
            />
            
            <FormField
              label="Full Name"
              type="text"
              id="name"
              placeholder="Enter your name"
              error={errors.name?.message}
              {...register('name')}
            />
            
            <FormField
              label="Birth Date"
              type="date"
              id="birthDate"
              error={errors.birthDate?.message}
              {...register('birthDate')}
            />
            
            <FormField
              label="Gender"
              type="select"
              id="gender"
              error={errors.gender?.message}
              {...register('gender')}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </FormField>
            
            <FormField
              label="Description (Optional)"
              type="textarea"
              id="description"
              placeholder="Tell us about yourself"
              error={errors.description?.message}
              {...register('description')}
            />
            
            <div className="flex justify-center w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-32 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-blue-500 hover:text-blue-700">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthRedirect>
  );
}