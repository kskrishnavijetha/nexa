
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useOAuthLogin() {
  const { user } = useAuth();

  // Returns a function to call for provider-based sign in
  const signInWithProvider = async (provider: "google" | "slack" | "azure" | "jira") => {
    if (user) {
      toast.error("You are already signed in.");
      return;
    }

    let providerString = provider;
    // Supabase names Microsoft provider 'azure'
    if (provider === "microsoft") providerString = "azure";
    if (provider === "jira" || provider === "slack" || provider === "google" || provider === "azure") {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: providerString,
        options: {
          redirectTo: window.location.origin + "/dashboard",
        },
      });
      if (error) {
        toast.error(`Sign in failed: ${error.message}`);
      }
    } else {
      toast.error("Unknown provider");
    }
  };

  return { signInWithProvider };
}
