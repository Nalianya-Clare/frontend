import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { type GameResult, type Badge as BadgeType } from "@/lib/api-services";
import { 
  Trophy, 
  Target, 
  Clock, 
  Star,
  TrendingUp,
  Award,
  Share2,
  RotateCcw,
  Home,
  Users,
  Medal,
  Zap
} from "lucide-react";

const QuizResults = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Get result data from navigation state
  const result = location.state?.result as GameResult;

  useEffect(() => {
    if (result && result.session.score >= result.session.quiz) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Results not found</p>
            <Button onClick={() => navigate('/categories')}>Back to Categories</Button>
          </div>
        </div>
      </div>
    );
  }

  const { session, points_earned, badges_earned, new_achievements, rank_change } = result;
  const scorePercentage = (session.correct_answers / session.total_questions) * 100;
  const isPassed = scorePercentage >= 70; // Assuming 70% is passing
  const timeInMinutes = Math.floor(session.time_taken / 60);
  const timeInSeconds = session.time_taken % 60;

  const getScoreColor = () => {
    if (scorePercentage >= 90) return "text-green-500";
    if (scorePercentage >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreGrade = () => {
    if (scorePercentage >= 90) return "A";
    if (scorePercentage >= 80) return "B";
    if (scorePercentage >= 70) return "C";
    if (scorePercentage >= 60) return "D";
    return "F";
  };

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="text-8xl animate-bounce">🎉</div>
              <div className="text-4xl font-bold text-primary animate-pulse">Quiz Complete!</div>
              <div className="text-2xl text-muted-foreground">Congratulations!</div>
            </div>
          </div>
        )}

        {/* Main Results Card */}
        <Card className="text-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <CardContent className="relative space-y-6">
            <div className="space-y-4">
              <div className={`text-8xl font-bold ${getScoreColor()}`}>
                {getScoreGrade()}
              </div>
              <h2 className="text-4xl font-bold">
                {isPassed ? "Well Done!" : "Keep Learning!"}
              </h2>
              <p className="text-xl text-muted-foreground">
                You scored {session.correct_answers} out of {session.total_questions} questions correctly
              </p>
              <div className="text-6xl font-bold text-primary">
                {scorePercentage.toFixed(1)}%
              </div>
            </div>
            
            <Progress value={scorePercentage} className="h-3 w-full max-w-md mx-auto" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-accent">+{points_earned}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Zap className="h-4 w-4 mr-1" />
                  XP Earned
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-secondary">
                  {timeInMinutes}:{timeInSeconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Time Taken
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {rank_change > 0 ? '+' : ''}{rank_change}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Rank Change
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-accent">{badges_earned.length}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Medal className="h-4 w-4 mr-1" />
                  New Badges
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Performance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Performance Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Correct Answers</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-green-500">{session.correct_answers}</span>
                  <span className="text-muted-foreground">/ {session.total_questions}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Accuracy</span>
                <span className={`font-bold ${getScoreColor()}`}>
                  {scorePercentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={isPassed ? "default" : "destructive"}>
                  {isPassed ? "PASSED" : "FAILED"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Points Earned</span>
                <span className="font-bold text-accent">+{points_earned} XP</span>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {badges_earned.length > 0 ? (
                <div className="space-y-3">
                  {badges_earned.map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{badge.name}</div>
                        <div className="text-sm text-muted-foreground">{badge.description}</div>
                      </div>
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                        NEW
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No new badges earned</p>
                  <p className="text-sm text-muted-foreground">Keep improving to unlock achievements!</p>
                </div>
              )}
              
              {new_achievements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">New Achievements:</h4>
                  {new_achievements.map((achievement, index) => (
                    <Badge key={index} variant="outline">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="cyber" 
            size="lg"
            onClick={() => navigate(`/quiz/${quizId}`)}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Retake Quiz</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/leaderboard')}
            className="flex items-center space-x-2"
          >
            <Users className="h-5 w-5" />
            <span>View Leaderboard</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/progress')}
            className="flex items-center space-x-2"
          >
            <Star className="h-5 w-5" />
            <span>My Progress</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/categories')}
            className="flex items-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>More Quizzes</span>
          </Button>
        </div>

        {/* Share Results */}
        <Card className="text-center p-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Share Your Achievement</h3>
            <p className="text-muted-foreground mb-4">
              I just scored {scorePercentage.toFixed(1)}% on a cybersecurity quiz! 
              {isPassed ? ' 🎉' : ' Working on improving! 💪'}
            </p>
            <Button variant="outline" className="flex items-center space-x-2 mx-auto">
              <Share2 className="h-4 w-4" />
              <span>Share Result</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizResults;
