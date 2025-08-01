import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Crown, Target, Flame } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
  streak: number;
  category: string;
  avatar: string;
}

const globalLeaders: LeaderboardUser[] = [
  { rank: 1, name: "Alex Chen", score: 15750, streak: 28, category: "Phishing Expert", avatar: "AC" },
  { rank: 2, name: "Sarah Kim", score: 14230, streak: 22, category: "OSINT Master", avatar: "SK" },
  { rank: 3, name: "Marcus Johnson", score: 13890, streak: 19, category: "Network Security", avatar: "MJ" },
  { rank: 4, name: "Elena Rodriguez", score: 12450, streak: 15, category: "Malware Analysis", avatar: "ER" },
  { rank: 5, name: "David Park", score: 11750, streak: 12, category: "Incident Response", avatar: "DP" },
];

const categoryLeaders = [
  { category: "Phishing Detection", leader: "Alex Chen", score: 2850 },
  { category: "OSINT Techniques", leader: "Sarah Kim", score: 2690 },
  { category: "Network Security", leader: "Marcus Johnson", score: 2580 },
  { category: "Social Engineering", leader: "Elena Rodriguez", score: 2440 },
];

const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600";
      default:
        return "bg-gradient-to-r from-primary/20 to-primary/40";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Global Leaderboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Top cybersecurity champions from around the world
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Global Rankings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span>Global Rankings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {globalLeaders.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 hover:scale-102 ${
                    user.rank <= 3 
                      ? 'bg-gradient-card border-primary/30 shadow-glow-primary' 
                      : 'bg-muted/20 border-border hover:border-primary/50'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getRankBadgeColor(user.rank)}`}>
                      {user.rank}
                    </div>
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.category}</div>
                  </div>

                  {/* Stats */}
                  <div className="text-right space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      {user.score.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Flame className="h-3 w-3 text-orange-400" />
                      <span>{user.streak} day streak</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button variant="cyber">View Full Rankings</Button>
            <Button variant="neon">Join Competition</Button>
          </div>
        </div>

        {/* Category Leaders & User Stats */}
        <div className="space-y-6">
          {/* Category Leaders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-secondary" />
                <span>Category Leaders</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryLeaders.map((category, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="text-sm font-medium text-primary mb-1">
                    {category.category}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{category.leader}</span>
                    <span className="text-sm font-bold text-secondary">
                      {category.score.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Your Stats */}
          <Card className="border-primary/30 bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-center">Your Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">#247</div>
                <div className="text-sm text-muted-foreground">Global Rank</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xl font-bold text-secondary">1,247</div>
                  <div className="text-xs text-muted-foreground">Total XP</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-accent">5</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>

              <Button variant="cyber" className="w-full">
                Take Challenge
              </Button>
            </CardContent>
          </Card>

          {/* Weekly Challenge */}
          <Card className="border-accent/30">
            <CardHeader>
              <CardTitle className="text-accent">Weekly Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Advanced OSINT Investigation</div>
                <div className="text-xs text-muted-foreground">Ends in 3 days</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-accent">50 participants</div>
                <div className="text-xs text-muted-foreground">competing</div>
              </div>
              <Button variant="neon" size="sm" className="w-full">
                Join Challenge
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;