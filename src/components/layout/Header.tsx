import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleSignOut = async (event: React.MouseEvent) => {
    event.preventDefault();
    
    try {
      console.log('Header: Initiating sign out');
      
      if (!signOut) {
        console.error('signOut function is not available');
        toast.error('Something went wrong. Please try again.');
        return;
      }
      
      // Show loading toast
      const loadingToast = toast.loading('Signing out...');
      
      // Call the signOut function from AuthContext
      await signOut();
      
      // Dismiss the loading toast
      toast.dismiss(loadingToast);
      toast.success('Successfully signed out');
      
      console.log('Header: Sign out completed successfully');
    } catch (error) {
      console.error('Header: Unexpected error during sign out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };
  
  const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/02ec954b-2d1e-4c5c-bfbd-f06f37b0329d.png" 
              alt="Nexabloom Logo" 
              className="h-8 w-8 object-contain" 
            />
            <span className="font-bold text-xl">Nexabloom</span>
          </Link>
        </div>
        
        {!user && (
          <nav className="flex-1">
            <ul className="hidden md:flex space-x-4">
              {publicNavItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      location.pathname === item.path 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground/60 hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        
        <div className="ml-auto flex space-x-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  {user.email?.split('@')[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="w-full cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pricing" className="w-full cursor-pointer">Subscription</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="outline">
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
