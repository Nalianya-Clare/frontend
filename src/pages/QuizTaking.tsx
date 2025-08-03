import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  quizService,
  gameService,
  type Quiz,
  type Question,
} from "@/lib/api-services";
import { 
  Clock, 
  Target, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface GameSession {
  session_id: number;
  quiz: Quiz;
  current_question: Question;
  question_number: number;
  total_questions: number;
  start_time: string;
  all_questions: Question[]; // Add this to store all questions
}

interface SubmitAnswerResult {
  is_correct: boolean;
  explanation: string;
  points_earned: number;
  next_question?: Question;
  question_number: number;
  total_questions: number;
  is_final_question: boolean;
}

const QuizTaking = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  // Game session data
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answerResult, setAnswerResult] = useState<SubmitAnswerResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  
  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [totalScore, setTotalScore] = useState(0);
  
  // UI state
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showExplanation && gameStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameSession && !showExplanation) {
      // Auto-submit when time runs out
      handleTimeUp();
    }
  }, [timeLeft, showExplanation, gameSession, gameStarted]);

  // Start game session when component mounts
  useEffect(() => {
    if (quizId && !gameStarted) {
      handleStartGame();
    }
  }, [quizId, gameStarted]);

  // Start game session
  const handleStartGame = async () => {
    if (!quizId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎯 Starting game session for quiz ID:', quizId);
      
      // Call the START endpoint
      const session = await gameService.startGame(Number(quizId));
      
      console.log('✅ Game session started successfully:', session);
      console.log('🔢 Total questions available:', session.all_questions?.length);
      console.log('📋 All questions:', session.all_questions);
      
      setGameSession(session);
      setCurrentQuestion(session.current_question);
      setCurrentQuestionIndex(0); // Start with first question
      setQuestionStartTime(Date.now());
      setGameStarted(true);
      
      // Set timer based on quiz time limit
      if (session.quiz.time_limit) {
        setTimeLeft(session.quiz.time_limit * 60); // Convert minutes to seconds
      }
      
    } catch (err) {
      const errorMessage = `Failed to start quiz session: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      console.error('❌ Error starting game session:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestionNumber = currentQuestionIndex + 1; // Use local index + 1
  const totalQuestions = gameSession?.total_questions || 1;
  const progress = (currentQuestionNumber / totalQuestions) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (!gameSession || !currentQuestion || selectedAnswer === null) {
      setError('Please select an answer');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      
      // Get the actual answer ID from the selected answer index
      const selectedAnswerObj = currentQuestion.answers[selectedAnswer];
      const actualAnswerId = selectedAnswerObj.id;
      
      console.log('📝 Submitting answer:', {
        session_id: gameSession.session_id,
        question_id: currentQuestion.id,
        selected_answer_index: selectedAnswer,
        selected_answer_id: actualAnswerId,
        time_taken: timeSpent
      });

      // Call the SUBMIT_ANSWER endpoint with the actual answer ID
      const result = await gameService.submitAnswer(
        gameSession.session_id,
        currentQuestion.id,
        actualAnswerId, // Use the actual answer ID, not the index
        timeSpent
      );

      console.log('✅ Answer submitted successfully:', result);
      console.log('🔍 Result details:', {
        is_final_question: result.is_final_question,
        has_next_question: !!result.next_question,
        question_number: result.question_number,
        total_questions: result.total_questions
      });

      setAnswerResult(result);
      setShowExplanation(true);
      setTotalScore(prev => prev + result.points_earned);

      // Auto-advance after showing explanation
      setTimeout(() => {
        if (result.is_final_question || currentQuestionIndex >= (gameSession.all_questions.length - 1)) {
          handleFinishGame();
        } else {
          // Move to next question using local question array
          const nextQuestionIndex = currentQuestionIndex + 1;
          const nextQuestion = gameSession.all_questions[nextQuestionIndex];
          
          if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
            setCurrentQuestionIndex(nextQuestionIndex);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setAnswerResult(null);
            setQuestionStartTime(Date.now());
          } else {
            console.warn('No next question found in local array');
            setError('Failed to load next question. Please try again.');
          }
        }
      }, 3000);
      
    } catch (err) {
      const errorMessage = `Failed to submit answer: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      console.error('❌ Error submitting answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishGame = async () => {
    if (!gameSession) return;

    setSubmitting(true);
    setError(null);

    try {
      console.log('🏁 Finishing game session:', gameSession.session_id);
      
      // Call the FINISH endpoint
      const finalResults = await gameService.finishGame(gameSession.session_id);
      
      console.log('🎉 Game finished successfully:', finalResults);
      
      // Navigate to results page with the results data
      navigate(`/quiz/${quizId}/results`, { 
        state: { 
          result: finalResults,
          totalScore: totalScore 
        } 
      });
      
    } catch (err) {
      const errorMessage = `Failed to finish game: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      console.error('❌ Error finishing game:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    if (selectedAnswer !== null) {
      handleSubmitAnswer();
    } else {
      // Auto-select first answer if no answer selected when time runs out
      setSelectedAnswer(0);
      setTimeout(() => handleSubmitAnswer(), 100);
    }
  };

  const getAnswerVariant = (answerIndex: number, answer: any) => {
    if (!showExplanation) {
      return selectedAnswer === answerIndex ? "default" : "outline";
    }
    
    if (answer.is_correct) {
      return "default"; // Correct answer
    }
    
    if (selectedAnswer === answerIndex && !answer.is_correct) {
      return "destructive"; // Wrong selected answer
    }
    
    return "outline";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !gameStarted) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Starting quiz session...</p>
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
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
            <p className="text-destructive text-lg">{error}</p>
            <Button onClick={() => navigate('/categories')}>Back to Categories</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameSession || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Game session not found</p>
            <Button onClick={() => navigate('/categories')}>Back to Categories</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span className="text-destructive font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/category/${gameSession.quiz.category}/quizzes`)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Exit
                  </Button>
                  <CardTitle className="text-2xl">{gameSession.quiz.title}</CardTitle>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>{gameSession.quiz.category_name}</span>
                  </div>
                  <Badge variant="outline">{gameSession.quiz.difficulty}</Badge>
                </div>
              </div>
              
              <div className="text-right space-y-2">
                <div className="flex items-center space-x-2 text-lg font-bold">
                  <Clock className={`h-5 w-5 ${timeLeft < 60 ? 'text-destructive animate-pulse' : 'text-primary'}`} />
                  <span className={timeLeft < 60 ? 'text-destructive' : 'text-primary'}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Question {currentQuestionNumber} of {totalQuestions}
                </div>
              </div>
            </div>
            
            <Progress value={progress} className="h-2" />
          </CardHeader>
        </Card>

        {/* Question Card */}
        <Card className="p-8">
          <CardContent className="space-y-8">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold leading-relaxed flex-1">
                {currentQuestion.question_text}
              </h2>
              <Badge variant="outline" className="ml-4">
                {currentQuestion.points} pts
              </Badge>
            </div>

            <div className="grid gap-4">
              {currentQuestion.answers.map((answer, index) => (
                <Button
                  key={answer.id}
                  variant={getAnswerVariant(index, answer)}
                  size="lg"
                  className={`justify-start text-left p-6 h-auto min-h-16 ${
                    selectedAnswer === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation || submitting}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-base">{answer.answer_text}</span>
                    {showExplanation && answer.is_correct && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                    )}
                    {showExplanation && selectedAnswer === index && !answer.is_correct && (
                      <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {selectedAnswer !== null && !showExplanation && (
              <Button 
                onClick={handleSubmitAnswer} 
                disabled={submitting}
                variant="cyber" 
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Answer'
                )}
              </Button>
            )}

            {showExplanation && answerResult && (
              <div className="space-y-4 p-6 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center space-x-2">
                  {answerResult.is_correct ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-green-700 dark:text-green-400">Correct!</span>
                      <Badge variant="secondary">+{answerResult.points_earned} points</Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-700 dark:text-red-400">Incorrect</span>
                      <Badge variant="secondary">+{answerResult.points_earned} points</Badge>
                    </>
                  )}
                </div>
                {answerResult.explanation && (
                  <p className="text-sm text-muted-foreground">
                    {answerResult.explanation}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  {answerResult.is_final_question 
                    ? "This was the final question. Finishing quiz..." 
                    : `Moving to question ${answerResult.question_number + 1} of ${answerResult.total_questions}...`
                  }
                </div>
                
                {/* Manual next question button for debugging */}
                {!answerResult.is_final_question && currentQuestionIndex < (gameSession?.all_questions.length - 1) && (
                  <Button 
                    onClick={() => {
                      const nextQuestionIndex = currentQuestionIndex + 1;
                      const nextQuestion = gameSession?.all_questions[nextQuestionIndex];
                      
                      if (nextQuestion) {
                        setCurrentQuestion(nextQuestion);
                        setCurrentQuestionIndex(nextQuestionIndex);
                        setSelectedAnswer(null);
                        setShowExplanation(false);
                        setAnswerResult(null);
                        setQuestionStartTime(Date.now());
                      } else {
                        setError('Next question not available. Please refresh and try again.');
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Continue to Next Question
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizTaking;