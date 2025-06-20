"use client"
import React from 'react'
import { CustomForm, FormType } from '@/components/CustomForm'

const LoginPage = () => {
  const handleLogin = async (data: any) => {
    console.log('Login data:', data)
    // Here you would typically handle the login logic
    // For now, we'll just log the data
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-gray-400/20 to-gray-500/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-gray-500/20 to-gray-600/20 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-gray-400/15 to-gray-500/15 blur-3xl"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent mb-2">
            Marketplace
          </h1>
          <p className="text-gray-700 text-lg">
            Welcome to our marketplace platform
          </p>
        </div>
        
        <CustomForm
          type={FormType.LOGIN}
          action={handleLogin}
          className="w-full"
          title="Welcome Back"
        />
      </div>
    </div>
  )
}

export default LoginPage