'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import FormField from '@/components/FormField';
import AuthRedirect from '@/components/AuthRedirect';
import { useAuth } from '@/contexts/AuthContext';
import { LoginData } from '@/types';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const username = watch('username');
  const password = watch('password');

  // Check form validity whenever fields change
  useEffect(() => {
    setIsFormValid(!!username && !!password);
  }, [username, password]);

  // Function to dodge mouse when hovering over button
  const handleButtonMouseEnter = (e: React.MouseEvent) => {
    if (!isFormValid && buttonRef.current && formContainerRef.current) {
      const button = buttonRef.current;
      const container = formContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate limits for movement within the container
      const buttonWidth = 120; // Fixed button width
      const maxX = window.innerWidth - buttonWidth - 20;
      const maxY = window.innerHeight - 40;
      
      // Generate a new position that's reasonably contained
      const newLeft = Math.max(20, Math.min(maxX, Math.random() * maxX));
      const newTop = Math.max(
        containerRect.top, 
        Math.min(maxY, containerRect.top + Math.random() * 200)
      );
      
      // Set new position style
      button.style.position = 'fixed';
      button.style.left = `${newLeft}px`;
      button.style.top = `${newTop}px`;
      button.style.transition = 'all 0.3s ease';
      button.style.zIndex = '1000';
    }
  };

  // Reset button position when form becomes valid
  useEffect(() => {
    if (isFormValid && buttonRef.current) {
      buttonRef.current.style.position = '';
      buttonRef.current.style.left = '';
      buttonRef.current.style.top = '';
      buttonRef.current.style.transition = '';
      buttonRef.current.style.zIndex = '';
    }
  }, [isFormValid]);

  const onSubmit = async (data: LoginData) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthRedirect>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div ref={formContainerRef} className="w-full max-w-md bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">Log In</h1>
          
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
              label="Password"
              type="password"
              id="password"
              placeholder="Enter password"
              error={errors.password?.message}
              {...register('password')}
            />
            
            <div className="flex justify-center w-full">
              <button
                ref={buttonRef}
                type="submit"
                disabled={isSubmitting}
                onMouseEnter={handleButtonMouseEnter}
                className="w-32 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isSubmitting ? 'Logging In...' : 'Log In'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4 text-black">
            <p>
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-500 hover:text-blue-700">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthRedirect>
  );
}