
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from '@/components/layout/Layout';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export default function SignIn() {
  const { signIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('SignIn component - Current user:', user);
  
  // Always redirect to pricing page after login
  const redirectAfterLogin = location.state?.redirectAfterLogin;
  
  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      console.log('User is authenticated, redirecting...', { user, redirectAfterLogin });
      // Special handling for lifetime payment redirect
      if (redirectAfterLogin === 'lifetime-payment') {
        window.location.href = 'https://www.paypal.com/ncp/payment/YF2GNLBJ2YCEE';
      } else {
        // Redirect to pricing page instead of dashboard
        navigate('/pricing', { replace: true });
      }
    }
  }, [user, navigate, redirectAfterLogin]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('SignIn - Starting sign in process with:', { email: values.email });
    setLoading(true);
    
    try {
      console.log('SignIn - Calling signIn function...');
      const { error } = await signIn(values.email, values.password);
      
      console.log('SignIn - Sign in result:', { error });
      
      if (error) {
        console.error("Error signing in:", error);
        toast.error(`Failed to sign in: ${error.message || 'Please check your credentials.'}`);
      } else {
        console.log('SignIn - Sign in successful!');
        toast.success("Signed in successfully!");
        // Redirect will happen in useEffect
      }
    } catch (err) {
      console.error("Exception during sign in:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-180px)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} type="email" disabled={loading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" disabled={loading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Don't have an account?{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/sign-up")}>
                Sign up
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
