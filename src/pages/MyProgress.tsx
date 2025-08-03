import { useEffect, useState } from "react";
import NavHeader from "@/components/NavHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { progressService, badgeService, type UserProgress, type Badge as ApiBadge } from "@/lib/api-services";
import { 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  Award, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Zap,
  Shield,
  Loader2
} from "lucide-react";

const MyProgress = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [userBadges, setUserBadges] = useState<ApiBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const [progressResponse, badgesResponse] = await Promise.all([
          progressService.getUserProgress(),
          badgeService.getUserBadges()
        ]);
        
        setUserProgress(progressResponse);
        setUserBadges(badgesResponse.results || []);
        setError(null);
      } catch (err) {
        setError('Failed to load progress data');
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userProgress) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-destructive">{error || 'No progress data available'}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const completionRate = userProgress.total_quizzes_taken > 0 
    ? Math.round((userProgress.total_quizzes_passed / userProgress.total_quizzes_taken) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            My Progress
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your cybersecurity learning journey and achievements
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6">
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold text-primary">{userProgress.level}</span>
              </div>
              <div className="text-sm text-muted-foreground">Current Level</div>
              <div className="text-xs text-muted-foreground">
                {userProgress.total_points.toLocaleString()} XP
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <BookOpen className="h-6 w-6 text-secondary" />
                <span className="text-3xl font-bold text-secondary">{userProgress.total_quizzes_taken}</span>
              </div>
              <div className="text-sm text-muted-foreground">Quizzes Taken</div>
              <div className="text-xs text-muted-foreground">
                {userProgress.total_quizzes_passed} passed
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-6 w-6 text-accent" />
                <span className="text-3xl font-bold text-accent">{userProgress.current_streak}</span>
              </div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
              <div className="text-xs text-muted-foreground">
                Best: {userProgress.longest_streak} days
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Target className="h-6 w-6 text-success" />
                <span className="text-3xl font-bold text-success">{completionRate}%</span>
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-xs text-muted-foreground">
                Quiz completion
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Learning Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    Level {userProgress.level}
                  </span>
                </div>
                <Progress value={(userProgress.level / 50) * 100} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 rounded-lg bg-muted/10">
                  <div className="text-2xl font-bold text-primary">{userProgress.total_points}</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/10">
                  <div className="text-2xl font-bold text-secondary">{userBadges.length}</div>
                  <div className="text-sm text-muted-foreground">Badges Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements/Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-accent" />
                <span>Recent Badges</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userBadges.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No badges earned yet</p>
                  <p className="text-sm text-muted-foreground">Complete quizzes to earn your first badge!</p>
                </div>
              ) : (
                userBadges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/10 border border-border">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">{badge.description}</div>
                      <Badge className="mt-1" variant="outline">
                        {badge.badge_type}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Button variant="cyber" className="w-full">
              <Target className="mr-2 h-4 w-4" />
              Continue Learning
            </Button>
            <Button variant="neon" className="w-full">
              <Trophy className="mr-2 h-4 w-4" />
              View Leaderboard
            </Button>
            <Button variant="outline" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" />
              Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyProgress;
