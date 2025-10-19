import { Shield, Trophy, User, Settings, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { progressService } from "@/lib/api-services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavHeader = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [userPoints, setUserPoints] = useState<number>(0);

  // Fetch user progress when authenticated
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (isAuthenticated) {
        try {
          const progress = await progressService.getUserProgress();
          setUserPoints(progress.total_points || 0);
        } catch (error) {
          console.error('Error fetching user progress:', error);
          // Keep default value of 0 on error
        }
      }
    };

    fetchUserProgress();
  }, [isAuthenticated]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  // Format number with commas for display
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CyberQuest
              </h1>
              <p className="text-xs text-muted-foreground">Security Learning Platform</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/">
              <Button 
                variant="ghost" 
                className={`text-foreground hover:text-primary ${
                  isActive('/') ? 'text-primary bg-primary/10' : ''
                }`}
              >
                Home
              </Button>
            </Link>
            <Link to="/categories">
              <Button 
                variant="ghost" 
                className={`text-foreground hover:text-primary ${
                  isActive('/categories') ? 'text-primary bg-primary/10' : ''
                }`}
              >
                Modules
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button 
                variant="ghost" 
                className={`text-foreground hover:text-primary ${
                  isActive('/leaderboard') ? 'text-primary bg-primary/10' : ''
                }`}
              >
                Leaderboard
              </Button>
            </Link>
            <Link to="/progress">
              <Button 
                variant="ghost" 
                className={`text-foreground hover:text-primary ${
                  isActive('/progress') ? 'text-primary bg-primary/10' : ''
                }`}
              >
                My Progress
              </Button>
            </Link>
            <Link to="/admin">
              <Button 
                variant="ghost" 
                className={`text-foreground hover:text-primary ${
                  isActive('/admin') ? 'text-primary bg-primary/10' : ''
                }`}
              >
                Admin
              </Button>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <Trophy className="h-4 w-4 text-accent" />
                  <span className="text-foreground">{formatNumber(userPoints)} XP</span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <User className="h-5 w-5" />
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-cyber-pulse"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      {user?.first_name} {user?.last_name}
                      <div className="text-xs text-muted-foreground font-normal">{user?.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trophy className="mr-2 h-4 w-4" />
                      Achievements
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button variant="cyber" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavHeader;