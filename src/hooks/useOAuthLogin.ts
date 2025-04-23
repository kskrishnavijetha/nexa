
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Provider } from "@supabase/supabase-js";

export function useOAuthLogin() {
  const { user } = useAuth();

  // Returns a function to call for provider-based sign in
  const signInWithProvider = async (provider: "google" | "slack" | "microsoft" | "azure" | "jira") => {
    if (user) {
      toast.error("You are already signed in.");
      return;
    }

    // Map our provider names to valid Supabase provider values
    let providerString: Provider;
    
    switch(provider) {
      case "google":
        providerString = "google";
        break;
      case "slack":
        providerString = "slack";
        break;
      case "microsoft":
      case "azure":
        providerString = "azure";
        break;
      case "jira":
        providerString = "bitbucket"; // Supabase uses bitbucket for Atlassian/Jira accounts
        break;
      default:
        toast.error("Unknown provider");
        return;
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerString,
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    
    if (error) {
      toast.error(`Sign in failed: ${error.message}`);
    }
  };

  return { signInWithProvider };
}
