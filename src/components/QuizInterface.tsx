import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Trophy, Target } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  image?: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "Which of the following is a common sign of a phishing email?",
    options: [
      "Professional email address from known company",
      "Generic greeting like 'Dear Customer'",
      "Proper grammar and spelling",
      "Secure HTTPS links only"
    ],
    correctAnswer: 1,
    explanation: "Phishing emails often use generic greetings because attackers don't know the recipient's name.",
    category: "Phishing Detection"
  },
  {
    id: 2,
    question: "What does OSINT stand for in cybersecurity?",
    options: [
      "Open Source Intelligence",
      "Operating System Intelligence",
      "Online Security Intelligence",
      "Organizational Security Intelligence"
    ],
    correctAnswer: 0,
    explanation: "OSINT refers to intelligence collected from publicly available sources.",
    category: "OSINT"
  },
  {
    id: 3,
    question: "Identify the potential security vulnerability in this code snippet:",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=400&fit=crop",
    options: [
      "SQL Injection vulnerability",
      "Cross-Site Scripting (XSS)",
      "Buffer overflow",
      "No vulnerabilities present"
    ],
    correctAnswer: 0,
    explanation: "The code shows unsanitized user input being directly inserted into a SQL query, making it vulnerable to SQL injection attacks.",
    category: "Code Security"
  }
];

const QuizInterface = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showCelebration, setShowCelebration] = useState(false);

  const question = sampleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }

    setTimeout(() => {
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(30);
      } else {
        setShowResults(true);
      }
    }, selectedAnswer === question.correctAnswer ? 2000 : 1000);
  };

  const getAnswerVariant = (index: number) => {
    if (selectedAnswer === null) return "quiz";
    if (selectedAnswer === index) {
      return selectedAnswer === question.correctAnswer ? "success" : "warning";
    }
    if (index === question.correctAnswer) return "success";
    return "quiz";
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="text-center p-8">
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Trophy className="h-16 w-16 text-accent mx-auto animate-glow" />
              <h2 className="text-3xl font-bold">Challenge Complete!</h2>
              <p className="text-xl text-muted-foreground">
                You scored {score} out of {sampleQuestions.length}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">+{score * 100} XP</div>
                <div className="text-sm text-muted-foreground">Experience Points Earned</div>
              </div>
              
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">#{Math.floor(Math.random() * 50) + 1}</div>
                  <div className="text-xs text-muted-foreground">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{Math.floor(Math.random() * 10) + 1}</div>
                  <div className="text-xs text-muted-foreground">Streak Days</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="cyber" onClick={() => window.location.reload()}>
                New Challenge
              </Button>
              <Button variant="neon">View Leaderboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Security Challenge</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>{question.category}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Live: 1,247 players</span>
                </div>
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <div className="flex items-center space-x-2 text-lg font-bold">
                <Clock className="h-5 w-5 text-primary animate-cyber-pulse" />
                <span className="text-primary">{timeLeft}s</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {sampleQuestions.length}
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="p-8 relative overflow-hidden">
        {showCelebration && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">👏</div>
              <div className="text-2xl font-bold text-primary animate-pulse">Correct!</div>
              <div className="text-lg text-muted-foreground">Great job!</div>
            </div>
          </div>
        )}
        <CardContent className="space-y-8">
          <h2 className="text-2xl font-semibold leading-relaxed">
            {question.question}
          </h2>

          {question.image && (
            <div className="rounded-lg overflow-hidden border border-border bg-muted/20">
              <img 
                src={question.image} 
                alt="Question visual"
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="grid gap-4">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={getAnswerVariant(index)}
                size="lg"
                className={`justify-start text-left p-6 h-auto min-h-16 ${
                  selectedAnswer === index ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-base">{option}</span>
                </div>
              </Button>
            ))}
          </div>

          {selectedAnswer !== null && (
            <div className="space-y-4 p-6 rounded-lg bg-muted/20 border border-border">
              <div className="text-sm font-medium text-primary">
                {selectedAnswer === question.correctAnswer ? "Correct!" : "Incorrect"}
              </div>
              <p className="text-sm text-muted-foreground">
                {question.explanation}
              </p>
              <Button onClick={handleSubmitAnswer} variant="cyber" className="w-full">
                {currentQuestion < sampleQuestions.length - 1 ? "Next Question" : "Complete Challenge"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizInterface;