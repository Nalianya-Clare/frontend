import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  gameService,
  type Question,
  type Quiz
} from "@/lib/api-services";
import { 
  Clock, 
  Target, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy
} from "lucide-react";

interface GameSession {
  session_id: number;
  quiz: Quiz;
  current_question: Question;
  question_number: number;
  total_questions: number;
  start_time: string;
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

const GameModeQuiz = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  // Game state
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answerResult, setAnswerResult] = useState<SubmitAnswerResult | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  // Start game session
  useEffect(() => {
    const startGameSession = async () => {
      if (!quizId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Starting game session for quiz ID:', quizId);
        const session = await gameService.startGame(Number(quizId));
        
        setGameSession(session);
        setCurrentQuestion(session.current_question);
        setQuestionStartTime(Date.now());
        
        console.log('Game session started:', session);
      } catch (err) {
        setError(`Failed to start quiz session: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Error starting game session:', err);
      } finally {
        setLoading(false);
      }
    };

    startGameSession();
  }, [quizId]);

  const handleSubmitAnswer = async () => {
    if (!gameSession || !currentQuestion || selectedAnswer === null) {
      setError('Please select an answer');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      
      console.log('Submitting answer:', {
        session_id: gameSession.session_id,
        question_id: currentQuestion.id,
        selected_answer_id: selectedAnswer,
        time_taken: timeSpent
      });

      const result = await gameService.submitAnswer(
        gameSession.session_id,
        currentQuestion.id,
        selectedAnswer,
        timeSpent
      );

      setAnswerResult(result);
      setShowResult(true);
      setTotalScore(prev => prev + result.points_earned);

      console.log('Answer submitted successfully:', result);
    } catch (err) {
      setError(`Failed to submit answer: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error submitting answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!answerResult) return;

    if (answerResult.is_final_question) {
      // Finish the game
      handleFinishGame();
    } else if (answerResult.next_question) {
      // Move to next question
      setCurrentQuestion(answerResult.next_question);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnswerResult(null);
      setQuestionStartTime(Date.now());
    }
  };

  const handleFinishGame = async () => {
    if (!gameSession) return;

    setSubmitting(true);
    setError(null);

    try {
      console.log('Finishing game session:', gameSession.session_id);
      const finalResults = await gameService.finishGame(gameSession.session_id);
      
      console.log('Game finished successfully:', finalResults);
      
      // Navigate to results page with the results data
      navigate(`/quiz/${quizId}/results`, { 
        state: { 
          results: finalResults,
          totalScore: totalScore 
        } 
      });
    } catch (err) {
      setError(`Failed to finish game: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error finishing game:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Starting quiz session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameSession || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No quiz session found</p>
      </div>
    );
  }

  const progressPercentage = (answerResult?.question_number || gameSession.question_number) / gameSession.total_questions * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{gameSession.quiz.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Question {answerResult?.question_number || gameSession.question_number} of {gameSession.total_questions}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{totalScore} pts</span>
              </div>
              <Badge variant="secondary">
                <Target className="h-3 w-3 mr-1" />
                {gameSession.quiz.difficulty}
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.question_text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.answers.map((answer) => (
                  <Button
                    key={answer.id}
                    variant={selectedAnswer === answer.id ? "default" : "outline"}
                    className="w-full text-left justify-start p-4 h-auto"
                    onClick={() => !showResult && setSelectedAnswer(answer.id)}
                    disabled={showResult || submitting}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border flex items-center justify-center">
                        <span className="text-sm">{String.fromCharCode(65 + answer.order)}</span>
                      </div>
                      <span>{answer.answer_text}</span>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Answer Result */}
              {showResult && answerResult && (
                <div className="space-y-4 p-4 rounded-lg bg-muted/20 border">
                  <div className="flex items-center space-x-2">
                    {answerResult.is_correct ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">
                      {answerResult.is_correct ? 'Correct!' : 'Incorrect'}
                    </span>
                    <Badge variant="secondary">
                      +{answerResult.points_earned} points
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{answerResult.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <div></div>
                <div className="space-x-2">
                  {!showResult ? (
                    <Button 
                      onClick={handleSubmitAnswer} 
                      disabled={selectedAnswer === null || submitting}
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
                  ) : (
                    <Button onClick={handleNextQuestion} disabled={submitting}>
                      {answerResult?.is_final_question ? (
                        submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Finishing...
                          </>
                        ) : (
                          'Finish Quiz'
                        )
                      ) : (
                        'Next Question'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameModeQuiz;
