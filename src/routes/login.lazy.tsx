import { createLazyFileRoute } from '@tanstack/react-router'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import { Link, useNavigate } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import Cookies from 'universal-cookie'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/axios'

export const Route = createLazyFileRoute('/login')({
  component: LoginForm,
})

function validatePassword(password: string): boolean {
  const minLength = 8
  const maxLength = 32
  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/
  const uppercaseRegex = /[A-Z]/
  const lowercaseRegex = /[a-z]/
  const numberRegex = /[0-9]/

  return (
    password.length >= minLength &&
    password.length <= maxLength &&
    specialCharacterRegex.test(password) &&
    uppercaseRegex.test(password) &&
    lowercaseRegex.test(password) &&
    numberRegex.test(password)
  )
}

const formSchema = v.object({
  email: v.pipe(v.string(), v.email('Enter a valid email.')),
  password: v.pipe(
    v.string(),
    v.minLength(8, 'Password must be at least 8 characters long.'),
    v.maxLength(32, 'Password must be no more than 32 characters long.'),
    v.custom(
      (input) => validatePassword(input as string),
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    ),
  ),
})

type FormValues = v.InferInput<typeof formSchema>

function LoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setError('')
      setLoading(true)
      const resp = await api.post<{ access: string; refresh: string }>(
        '/auth/login',
        values,
      )
      const cookies = new Cookies(null, { path: '/' })
      cookies.set('access_token', resp.data.access)
      cookies.set('refresh_token', resp.data.refresh)
      navigate({ to: '/' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err?.response?.data || 'Something went wrong! Please try again later.',
      )
    } finally {
      setLoading(false)
    }
  }

  const loginAsEditor = () => {
    form.setValue('email', 'editor@optimus.com')
    form.setValue('password', 'Secure_passwd@123')
    form.handleSubmit(onSubmit)()
  }

  const loginAsAdmin = () => {
    toast('Not implemented!', {
      description:
        "Admin access hasn't been implemented yet! but hang tight we are working on it.",
      action: {
        label: 'Okay',
        onClick: () => console.log('Undo'),
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-grow w-full flex justify-center items-center"
      >
        <Card className="mx-auto w-full my-auto max-w-md">
          <CardHeader>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="me@example.com" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="**********"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="flex items-center gap-2">
                <Separator className="shrink h-0.5 w-full" />
                <p className="shrink-0 text-sm text-muted-foreground">
                  Or use dummy accounts
                </p>
                <Separator className="shrink h-0.5 w-full" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  onClick={loginAsEditor}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login as Editor'}
                </Button>
                <Button
                  type="button"
                  onClick={loginAsAdmin}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login as Admin'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?
              <Link to="/signup" className="underline">
                {' '}
                Sign Up{' '}
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
