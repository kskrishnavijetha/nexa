
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
import { Google } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export default function SignIn() {
  const { signIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Always redirect to pricing page after login
  const redirectAfterLogin = location.state?.redirectAfterLogin;
  
  // Redirect authenticated users
  useEffect(() => {
    if (user) {
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
    setLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      if (error) {
        console.error("Error signing in:", error);
        toast.error("Failed to sign in. Please check your credentials.");
      } else {
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

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/sign-in`
        }
      });
      if (error) {
        console.error("Google sign-in error:", error);
        toast.error("Google sign-in failed. Please try again.");
      }
      // The user will be redirected, so no need to handle the rest
    } catch (err) {
      console.error("Exception during Google sign-in:", err);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
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
                        <Input placeholder="your.email@example.com" {...field} type="email" disabled={loading || googleLoading} />
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
                        <Input {...field} type="password" disabled={loading || googleLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted-foreground" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={googleLoading || loading}
                >
                  {googleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Google className="h-4 w-4" />
                  )}
                  Continue with Google
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

