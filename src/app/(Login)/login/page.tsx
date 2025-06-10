'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {toast} from 'sonner';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {RiEyeLine as Eye, RiEyeOffLine as EyeOff} from '@remixicon/react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';

// Dummy user credentials and mock login function
const DUMMY_USER = {
  username: 'admin',
  password: '123456',
  user: {
    id: 'user-123',
    username: 'admin',
    role: 'admin',
    email: 'admin@example.com'
  }
};

async function loginUser(username: string, password: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check dummy credentials
  if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
    return {
      success: true,
      data: {
        accessToken: 'dummy-access-token-123',
        refreshToken: 'dummy-refresh-token-456',
        user: DUMMY_USER.user
      }
    };
  }

  // Return error for invalid credentials
  return {
    success: false,
    errorType: 'auth_error',
    errorMessage: 'Invalid credentials'
  };
}

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  const searchParams = useSearchParams();
  const returnTo = searchParams?.get('returnTo');

  const loginSchema = z.object({
    username: z.string().nonempty('Username is required'),
    password: z.string().nonempty('Password is required')
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  useEffect(() => {
    const isAuthenticated = Cookies.get('isAuthenticated') === 'true';
    const authExpiry = Cookies.get('authExpiry');

    if (isAuthenticated && authExpiry && Date.now() < Number(authExpiry)) {
      router.push('/dashboard');
    } else {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    // Check if we already have a token in sessionStorage first
    const existingToken = sessionStorage.getItem('csrfToken');
    if (existingToken) {
      setCsrfToken(existingToken);
    } else {
      // Generate a new token only if one doesn't exist
      const randomToken = Math.random().toString(36).substring(2, 15);
      setCsrfToken(randomToken);
      sessionStorage.setItem('csrfToken', randomToken);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('isAuthenticated');
    Cookies.remove('authExpiry');
    Cookies.remove('token');
    Cookies.remove('userId');
    Cookies.remove('userRole');
  };

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    // Authenticate with dummy user
    const result = await loginUser(data.username, data.password);

    if (!result.success) {
      setLoading(false);
      
      toast.error('Invalid credentials', {
        icon: '🔒',
        duration: 4000
      });
      
      console.log('Login attempt failed');
      return;
    }

    // Get token and user data
    const { accessToken, refreshToken, user } = result.data;

    // Set auth cookies - 3 hours expiration (0.125 days)
    const expiryTime = Date.now() + 3 * 60 * 60 * 1000; // 3 hours
    const cookieExpiry = 0.125; // 3 hours in days

    Cookies.set('isAuthenticated', 'true', { expires: cookieExpiry });
    Cookies.set('authExpiry', expiryTime.toString(), { expires: cookieExpiry });
    Cookies.set('token', accessToken, { expires: cookieExpiry });
    Cookies.set('refreshToken', refreshToken, { expires: cookieExpiry });

    if (user && user.id) {
      Cookies.set('userId', user.id, { expires: cookieExpiry });
      Cookies.set('userRole', user.role, { expires: cookieExpiry });
    }

    form.reset();

    toast.success('Login successful', {
      duration: 3000,
      className: 'bg-green-50',
      descriptionClassName: 'text-green-800'
    });

    setTimeout(() => {
      setLoading(false);
      const redirectPath = returnTo
        ? decodeURIComponent(returnTo)
        : '/dashboard';
      router.push(redirectPath);
    }, 1500);
  };

  return (
    <>
      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center px-4 sm:px-6 md:px-8 lg:px-10"
        style={{backgroundImage: "url('/hotel.webp')"}}
      >
        <div className="bg-white bg-opacity-90 p-8 sm:p-10 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-800 dark:text-green-300">
              Login
            </h2>
          </div>
          
          {/* Demo credentials info */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Demo credentials:</strong><br/>
              Username: admin<br/>
              Password: password123
            </p>
          </div>
          
          {/* Add Back Home Link */}
          <div className="mb-6">
            <Link href="/" className="flex items-center text-green-800 hover:text-green-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-[#1F2A38] ">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your username"
                        autoComplete="username"
                        className="h-12 text-lg pr-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-[#1F2A38] ">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className={`h-12 text-lg pr-10 ${
                            form.formState.errors.password
                              ? 'border-red-500 focus:ring-red-500'
                              : ''
                          }`}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 pr-3"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-[#1F2A38]" />
                        ) : (
                          <Eye className="h-5 w-5 text-[#1F2A38]" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 text-lg bg-green-800 hover:bg-green-600 text-white relative"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                    <span className="opacity-0">Login</span>
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}