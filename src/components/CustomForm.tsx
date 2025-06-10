"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {RiEyeLine as Eye, RiEyeOffLine as EyeOff} from '@remixicon/react';
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Enum for form types
export enum FormType {
  LOGIN = "login",
  REGISTER = "register"
}

// Dummy user for testing
const DUMMY_USER = {
  email: "test@example.com",
  password: "password123"
}

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
})

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

interface CustomFormProps {
  type: FormType
  action: (data: LoginFormData | RegisterFormData) => void | Promise<void>
  className?: string
  isLoading?: boolean
  title?: string
}

export function CustomForm({ type, action, className, isLoading = false, title }: CustomFormProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const router = useRouter()

  const isLogin = type === FormType.LOGIN
  const schema = isLogin ? loginSchema : registerSchema

  const form = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: isLogin 
      ? { email: "", password: "" }
      : { name: "", email: "", password: "", confirmPassword: "" }
  })

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    try {
      if (isLogin) {
        // Check against dummy user for login
        const loginData = data as LoginFormData
        if (loginData.email === DUMMY_USER.email && loginData.password === DUMMY_USER.password) {
          console.log("Login successful!")
          await action(data)
        } else {
          form.setError("email", { message: "Invalid credentials" })
          form.setError("password", { message: "Invalid credentials" })
        }
      } else {
        console.log("Registration data:", data)
        await action(data)
      }
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const handleFormSwitch = () => {
    if (isLogin) {
      router.push('/register')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <Card className="w-full shadow-xl border-0 bg-white/95 backdrop-blur-sm dark:bg-white/95">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {title || (isLogin ? "Welcome back" : "Create account")}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isLogin 
              ? "Enter your credentials to sign in to your account"
              : "Enter your information to create a new account"
            }
          </CardDescription>
          {isLogin && (
            <div className="text-xs text-gray-700 bg-gray-100 p-3 rounded-lg border border-gray-200">
              <p className="font-semibold mb-1">Test credentials:</p>
              <p>Email: {DUMMY_USER.email}</p>
              <p>Password: {DUMMY_USER.password}</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(
                        "text-gray-700",
                        form.formState.errors.name && "text-red-600"
                      )}>
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name"
                          {...field}
                          disabled={isLoading}
                          className={cn(
                            "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-500",
                            form.formState.errors.name && "border-red-500 focus:border-red-500"
                          )}
                        />
                      </FormControl>
                      <FormMessage className="text-black" />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(
                      "text-gray-700",
                      form.formState.errors.email && "text-red-600"
                    )}>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        disabled={isLoading}
                        className={cn(
                          "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-500",
                          form.formState.errors.email && "border-red-500 focus:border-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-black" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(
                      "text-gray-700",
                      form.formState.errors.password && "text-red-600"
                    )}>
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          disabled={isLoading}
                          className={cn(
                            "pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-500",
                            form.formState.errors.password && "border-red-500 focus:border-red-500"
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-black" />
                  </FormItem>
                )}
              />

              {!isLogin && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(
                        "text-gray-700",
                        form.formState.errors.confirmPassword && "text-red-600"
                      )}>
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                            disabled={isLoading}
                            className={cn(
                              "pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-500",
                              form.formState.errors.confirmPassword && "border-red-500 focus:border-red-500"
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
                              <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-black" />
                    </FormItem>
                  )}
                />
              )}

              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white font-medium shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>

              <div className="text-center text-sm text-gray-600">
                {isLogin ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-black hover:text-gray-700 underline-offset-4 hover:underline font-medium transition-colors"
                      onClick={handleFormSwitch}
                      disabled={isLoading}
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-black hover:text-gray-700 underline-offset-4 hover:underline font-medium transition-colors"
                      onClick={handleFormSwitch}
                      disabled={isLoading}
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}