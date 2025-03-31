
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, CreditCard } from 'lucide-react';
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
  
  // Handle sign out with navigation
  const handleSignOut = async () => {
    try {
      console.log('Header: Initiating sign out');
      
      // Call signOut function from AuthContext
      await signOut();
      
      console.log('Header: Sign out completed, navigating to home');
      // Force navigation to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Header: Error during sign out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };
  
  // This item will be shown to all users
  const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/public/lovable-uploads/b96b3f45-8a1a-40d5-b884-1142753be402.png" 
              alt="Logo" 
              className="h-8 w-8" 
              style={{ backgroundColor: 'transparent' }}
            />
          </Link>
        </div>
        
        {/* Only show these nav items to non-authenticated users */}
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
                  <User className="h-4 w-4 mr-2" />
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
                  <Link to="/payment" className="w-full cursor-pointer">Subscription</Link>
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
