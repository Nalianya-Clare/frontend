import { Shield, Trophy, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavHeader = () => {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CyberQuest
              </h1>
              <p className="text-xs text-muted-foreground">Security Learning Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Challenges
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Leaderboard
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              My Progress
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Admin
            </Button>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="text-foreground">1,247 XP</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-cyber-pulse"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavHeader;