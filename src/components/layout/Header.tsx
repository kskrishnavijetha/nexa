
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, FileText, History, Home, BarChart, MessageSquare, Settings, User, LogOut } from 'lucide-react';
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

const Header: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  // These navigation items will only be shown to logged-in users
  const authNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart className="h-4 w-4 mr-2" /> },
    { name: 'Document Analysis', path: '/document-analysis', icon: <FileText className="h-4 w-4 mr-2" /> },
    { name: 'History', path: '/history', icon: <History className="h-4 w-4 mr-2" /> },
    { name: 'Google Services', path: '/google-services', icon: <Settings className="h-4 w-4 mr-2" /> },
    { name: 'Slack Monitoring', path: '/slack-monitoring', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  ];
  
  // This item will be shown to all users
  const publicNavItems = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
  ];
  
  // Get the relevant navigation items based on auth state
  const navItems = user ? [...publicNavItems, ...authNavItems] : publicNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="h-6 w-6" />
            <span className="font-bold text-xl">CompliZen</span>
          </Link>
        </div>
        
        <nav className="flex-1">
          <ul className="hidden md:flex space-x-4">
            {navItems.map((item) => (
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
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
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
                <DropdownMenuItem onClick={() => signOut()} className="text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth/signin">
                <Button variant="outline">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation - Only show for logged in users */}
      {user && (
        <div className="md:hidden container py-2 overflow-x-auto">
          <ul className="flex space-x-2 min-w-max">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap",
                    location.pathname === item.path 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground/60 hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
