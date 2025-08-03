import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  progressService,
  type UserProgress
} from "@/lib/api-services";
import {
  Trophy,
  Target,
  Clock,
  BookOpen,
  Star,
  TrendingUp,
  RefreshCw,
  Loader2,
  AlertCircle,
  Award
} from "lucide-react";

const ProgressDashboard = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('Fetching user progress...');
      const progress = await progressService.getUserProgress();
      
      setUserProgress(progress);
      console.log('User progress loaded:', progress);
    } catch (err) {
      const errorMessage = `Failed to load progress: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleRefresh = () => {
    fetchProgress(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userProgress) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No progress data found</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProgress.user_email}! Here's your learning journey.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.total_points.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Points earned from quizzes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{userProgress.current_rank}</div>
            <p className="text-xs text-muted-foreground">
              Global leaderboard position
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.total_quizzes_taken}</div>
            <p className="text-xs text-muted-foreground">
              Total quizzes attempted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.average_score.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all quizzes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>{userProgress.completion_rate.toFixed(1)}%</span>
              </div>
              <Progress value={userProgress.completion_rate} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Score</span>
                <span>{userProgress.average_score.toFixed(1)}%</span>
              </div>
              <Progress value={userProgress.average_score} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userProgress.correct_answers}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {userProgress.total_questions - userProgress.correct_answers}
                </div>
                <div className="text-sm text-muted-foreground">Incorrect Answers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Activity Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Total Questions</span>
                </div>
                <Badge variant="secondary">{userProgress.total_questions}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-3">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Correct Answers</span>
                </div>
                <Badge variant="secondary">{userProgress.correct_answers}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Current Rank</span>
                </div>
                <Badge variant="secondary">#{userProgress.current_rank}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-3">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Quizzes Taken</span>
                </div>
                <Badge variant="secondary">{userProgress.total_quizzes_taken}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Data Debug (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Progress Data (Development Only)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
              {JSON.stringify(userProgress, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressDashboard;
