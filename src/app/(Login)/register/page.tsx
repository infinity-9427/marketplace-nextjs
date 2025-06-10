"use client"
import React from 'react'
import { CustomForm, FormType } from '@/components/CustomForm'

const RegisterPage = () => {
  const handleRegister = async (data: any) => {
    console.log('Registration data:', data)
    // Here you would typically handle the registration logic
    // For now, we'll just log the data
    // You could redirect to login page or dashboard after successful registration
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-gray-400/20 to-gray-500/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-gray-500/20 to-gray-600/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-gray-400/15 to-gray-500/15 blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-gray-300/20 to-gray-400/20 blur-2xl"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent mb-2">
            Join Marketplace
          </h1>
          <p className="text-gray-700 text-lg">
            Create your account and start exploring
          </p>
        </div>
        
        <CustomForm
          type={FormType.REGISTER}
          action={handleRegister}
          className="w-full"
          title="Create Your Account"
        />
      </div>
    </div>
  )
}

export default RegisterPage