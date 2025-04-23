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
import { Google, Slack, Microsoft, Jira } from "lucide-react";
import { useOAuthLogin } from "@/hooks/useOAuthLogin";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export default function SignIn() {
  const { signIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirectAfterLogin = location.state?.redirectAfterLogin;
  
  useEffect(() => {
    if (user) {
      if (redirectAfterLogin === 'lifetime-payment') {
        window.location.href = 'https://www.paypal.com/ncp/payment/YF2GNLBJ2YCEE';
      } else {
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
      }
    } catch (err) {
      console.error("Exception during sign in:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { signInWithProvider } = useOAuthLogin();

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
            <div className="flex flex-col space-y-3 mb-5">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => signInWithProvider('google')}
              >
                <Google className="h-4 w-4" />
                Sign in with Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => signInWithProvider('slack')}
              >
                <Slack className="h-4 w-4" />
                Sign in with Slack
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => signInWithProvider('microsoft')}
              >
                <Microsoft className="h-4 w-4" />
                Sign in with Microsoft
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => signInWithProvider('jira')}
              >
                <Jira className="h-4 w-4" />
                Sign in with Jira
              </Button>
            </div>

            <div className="relative flex items-center justify-center mb-4">
              <span className="px-2 bg-white text-muted-foreground text-xs">or sign in with email</span>
            </div>

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
