import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categoryService, quizService, resourceService, type Quiz, type Category, type Resource } from "@/lib/api-services";
import {
  Clock,
  Users,
  Target,
  Trophy,
  ArrowLeft,
  Play,
  Loader2,
  Star,
  Zap,
  FileText,
  Download
} from "lucide-react";

const QuizSelection = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewQuiz, setPreviewQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);

        // Fetch category details and quizzes list
        const [categoryResponse, quizzesResponse] = await Promise.all([
          categoryService.getById(Number(categoryId)),
          quizService.getAll({ category: Number(categoryId) })
        ]);

        console.log('Category Response:', categoryResponse);
        console.log('Quizzes Response:', quizzesResponse);

        // Fetch resources for each quiz
        const quizzesWithResources = await Promise.all(
          (quizzesResponse.results || []).map(async (quiz) => {
            try {
              const resources = await resourceService.getByQuizId(quiz.id);
              console.log(`Quiz ${quiz.id} resources:`, resources);
              return {
                ...quiz,
                resources: resources
              };
            } catch (error) {
              console.error(`Failed to fetch resources for quiz ${quiz.id}:`, error);
              return quiz; // Return quiz without resources if fetch fails
            }
          })
        );

        console.log('All quizzes with resources:', quizzesWithResources);
        setCategory(categoryResponse);
        setQuizzes(quizzesWithResources);
        setError(null);
      } catch (err) {
        setError('Failed to load quizzes');
        console.error('Error fetching quiz data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-700 dark:text-red-400';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-400';
    }
  };

  const handleStartQuiz = (quizId: number) => {
    navigate(`/quiz/${quizId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading quizzes...</p>
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
            <Button onClick={() => navigate('/categories')}>Back to Categories</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/categories')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {category?.name || 'Category'} Quizzes
            </h1>
            <p className="text-muted-foreground text-lg">
              {category?.description || 'Choose a quiz to test your knowledge'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-primary">{quizzes.length}</div>
              <div className="text-sm text-muted-foreground">Available Quizzes</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-secondary">
                {quizzes.reduce((sum, quiz) => sum + quiz.total_questions, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-accent">
                {quizzes.reduce((sum, quiz) => sum + quiz.points_reward, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Max Points</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-primary">Live</div>
              <div className="text-sm text-muted-foreground">Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card 
              key={quiz.id} 
              className="group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                    </Badge>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {quiz.title}
                    </CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      <span>{quiz.points_reward}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {quiz.description}
                </p>

                {/* Resources Section */}
                {quiz.resources && quiz.resources.length > 0 && (
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-semibold">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Resources ({quiz.resources.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {quiz.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between text-xs bg-muted/30 rounded p-2"
                        >
                          <span className="truncate flex-1">{resource.description}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              const url = resource.raw_file || resource.image;
                              if (url) window.open(url, '_blank');
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>{quiz.total_questions} questions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-secondary" />
                      <span>{quiz.time_limit}min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-accent" />
                      <span>{quiz.pass_score}% to pass</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>{quiz.points_reward} XP</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="cyber" 
                    size="sm" 
                    className="flex-1 flex items-center space-x-2"
                    onClick={() => handleStartQuiz(quiz.id)}
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Quiz</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewQuiz(quiz)}
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Quizzes */}
        {quizzes.length === 0 && !loading && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No quizzes available</h3>
            <p className="text-muted-foreground">
              Check back later for new challenges in this category
            </p>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewQuiz} onOpenChange={(open) => !open && setPreviewQuiz(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">{previewQuiz?.title}</DialogTitle>
              <Badge className={previewQuiz ? getDifficultyColor(previewQuiz.difficulty) : ''}>
                {previewQuiz?.difficulty.charAt(0).toUpperCase()}{previewQuiz?.difficulty.slice(1)}
              </Badge>
            </div>
            <DialogDescription className="text-base">
              {previewQuiz?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Quiz Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Questions</p>
                  <p className="font-semibold">{previewQuiz?.total_questions}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Time Limit</p>
                  <p className="font-semibold">{previewQuiz?.time_limit} minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Star className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Pass Score</p>
                  <p className="font-semibold">{previewQuiz?.pass_score}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Trophy className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Points Reward</p>
                  <p className="font-semibold">{previewQuiz?.points_reward} XP</p>
                </div>
              </div>
            </div>

            {/* Resources Section */}
            {previewQuiz?.resources && previewQuiz.resources.length > 0 && (
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center space-x-2 font-semibold">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Study Resources ({previewQuiz.resources.length})</span>
                </div>
                <div className="space-y-2">
                  {previewQuiz.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm">{resource.description}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = resource.raw_file || resource.image;
                          if (url) window.open(url, '_blank');
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPreviewQuiz(null)}
              >
                Close
              </Button>
              <Button
                variant="cyber"
                className="flex-1 flex items-center justify-center space-x-2"
                onClick={() => {
                  if (previewQuiz) {
                    handleStartQuiz(previewQuiz.id);
                  }
                }}
              >
                <Play className="h-4 w-4" />
                <span>Start Quiz</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizSelection;
