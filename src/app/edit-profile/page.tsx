'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import FormField from '@/components/FormField';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { UpdateProfileData } from '@/types';

// Update the schema to match the UpdateProfileData interface
const updateProfileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  birthDate: z.string().refine((date) => {
    if (!date) return true; // Skip validation if empty
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Invalid date').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  description: z.string().optional(),
});

export default function EditProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      // Format the date to YYYY-MM-DD for input[type="date"]
      const formattedDate = user.birthDate
        ? new Date(user.birthDate).toISOString().split('T')[0]
        : '';
      
      reset({
        username: user.username,
        email: user.email,
        name: user.name,
        birthDate: formattedDate,
        gender: user.gender,
        description: user.description,
      });
    }
  }, [user, reset]);

// Update the catch block in src/app/edit-profile/page.tsx

const onSubmit = async (data: UpdateProfileData) => {
  setIsSubmitting(true);
  try {
    await updateProfile(data);
    toast.success('Profile updated successfully!');
  } catch (error: unknown) {
    // Type-safe error handling
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to update profile');
    } else {
      toast.error('Failed to update profile');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">Edit Profile</h1>
          
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
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}