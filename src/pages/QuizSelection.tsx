import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryService, quizService, type Quiz, type Category } from "@/lib/api-services";
import { 
  Clock, 
  Users, 
  Target, 
  Trophy,
  ArrowLeft,
  Play,
  Loader2,
  Star,
  Zap
} from "lucide-react";

const QuizSelection = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        
        // Fetch category details and quizzes in parallel
        const [categoryResponse, quizzesResponse] = await Promise.all([
          categoryService.getById(Number(categoryId)),
          quizService.getAll({ category: Number(categoryId) })
        ]);
        
        console.log('Category Response:', categoryResponse);
        console.log('Quizzes Response:', quizzesResponse);
        
        setCategory(categoryResponse);
        setQuizzes(quizzesResponse.results || []);
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
                  <Button variant="outline" size="sm">
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
    </div>
  );
};

export default QuizSelection;
