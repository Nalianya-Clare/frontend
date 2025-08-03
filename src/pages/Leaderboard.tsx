import { useEffect, useState } from "react";
import NavHeader from "@/components/NavHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { leaderboardService } from "@/lib/api-services";
import { Trophy, Award, Target, Crown, Medal, Star, Loader2 } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  user_email: string;
  user_name: string;
  points: number;
  level: number;
  quizzes_passed: number;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await leaderboardService.getGlobal();
        setLeaderboardData(response.results || []);
        setError(null);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-6 w-6 text-muted-foreground" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Global Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Top cybersecurity champions from around the world
          </p>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-primary" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaderboardData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No leaderboard data available</p>
              </div>
            ) : (
              leaderboardData.slice(0, 10).map((user, index) => (
                <div 
                  key={`${user.user_email}-${index}`}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/10 border border-border hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getRankBadgeColor(index + 1)}`}>
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getRankIcon(index + 1)}
                      <div>
                        <div className="font-medium">{user.user_name || user.user_email}</div>
                        <div className="text-sm text-muted-foreground">
                          Level {user.level} • {user.quizzes_passed} quizzes passed
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {leaderboardData.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Players</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">
                {leaderboardData.length > 0 ? leaderboardData[0]?.points.toLocaleString() : '0'}
              </div>
              <div className="text-sm text-muted-foreground">Highest Score</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">
                {leaderboardData.length > 0 
                  ? Math.round(leaderboardData.reduce((sum, user) => sum + user.quizzes_passed, 0) / leaderboardData.length)
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg Quizzes Passed</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button variant="cyber">View My Rank</Button>
          <Button variant="neon">Join Competition</Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
