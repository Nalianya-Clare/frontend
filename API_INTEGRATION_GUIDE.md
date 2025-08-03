# Quiz API Endpoints Integration Guide

This document shows how the quiz API endpoints are integrated into the React frontend application.

## API Endpoints Overview

The following quiz API endpoints are integrated and ready to use:

1. **POST /quiz/game/start** - Start a new quiz session
2. **POST /quiz/game/submit_answer** - Submit an answer for the current question
3. **POST /quiz/game/finish** - Finish the quiz and get final results
4. **GET /quiz/progress** - Get user progress data

## Implementation Details

### 1. API Configuration (`src/lib/api-config.ts`)

The endpoints are configured in the API configuration:

```typescript
QUIZ: {
  PROGRESS: '/quiz/progress',
  GAME: {
    START: '/quiz/game/start',
    SUBMIT_ANSWER: '/quiz/game/submit_answer',
    FINISH: '/quiz/game/finish',
  }
}
```

### 2. API Services (`src/lib/api-services.ts`)

#### Game Service

The `gameService` provides three main functions:

```typescript
export const gameService = {
  // Start a new quiz session
  startGame: async (quiz_id: number): Promise<{
    session_id: number;
    quiz: Quiz;
    current_question: Question;
    question_number: number;
    total_questions: number;
    start_time: string;
  }>;

  // Submit an answer
  submitAnswer: async (
    session_id: number,
    question_id: number,
    selected_answer_id: number,
    time_taken: number
  ): Promise<{
    is_correct: boolean;
    explanation: string;
    points_earned: number;
    next_question?: Question;
    question_number: number;
    total_questions: number;
    is_final_question: boolean;
  }>;

  // Finish the quiz
  finishGame: async (session_id: number): Promise<{
    session: GameSession;
    final_score: number;
    points_earned: number;
    badges_earned: Badge[];
    new_achievements: string[];
    rank_change: number;
    performance_summary: {
      total_questions: number;
      correct_answers: number;
      incorrect_answers: number;
      accuracy_percentage: number;
      time_taken: number;
    };
  }>;
}
```

#### Progress Service

The `progressService` provides user progress data:

```typescript
export const progressService = {
  getUserProgress: async (): Promise<UserProgress>;
}
```

### 3. Component Integration

#### Game Mode Quiz Component (`src/components/GameModeQuiz.tsx`)

A complete quiz-taking component that uses the game API:

```typescript
// Start game session
const session = await gameService.startGame(Number(quizId));

// Submit answer
const result = await gameService.submitAnswer(
  gameSession.session_id,
  currentQuestion.id,
  selectedAnswer,
  timeSpent
);

// Finish game
const finalResults = await gameService.finishGame(gameSession.session_id);
```

#### Progress Dashboard Component (`src/components/ProgressDashboard.tsx`)

A comprehensive progress display component:

```typescript
// Get user progress
const progress = await progressService.getUserProgress();
```

### 4. Existing Usage

The API endpoints are already used in:

1. **ApiTestDashboard.tsx** - For testing all API endpoints
2. **MyProgress.tsx** - Uses progress service to display user progress
3. **GameModeQuiz.tsx** - New component showing complete game flow

## Usage Examples

### Starting a Quiz Session

```typescript
import { gameService } from '@/lib/api-services';

const startQuiz = async (quizId: number) => {
  try {
    const session = await gameService.startGame(quizId);
    console.log('Session started:', session);
    // session.session_id - use this for subsequent calls
    // session.current_question - first question to display
  } catch (error) {
    console.error('Failed to start quiz:', error);
  }
};
```

### Submitting an Answer

```typescript
const submitAnswer = async (
  sessionId: number, 
  questionId: number, 
  answerId: number
) => {
  try {
    const timeSpent = 30; // seconds
    const result = await gameService.submitAnswer(
      sessionId, 
      questionId, 
      answerId, 
      timeSpent
    );
    
    if (result.is_correct) {
      console.log('Correct! Points earned:', result.points_earned);
    } else {
      console.log('Incorrect. Explanation:', result.explanation);
    }
    
    if (!result.is_final_question && result.next_question) {
      // Show next question
      console.log('Next question:', result.next_question);
    } else {
      // This was the last question, finish the quiz
      finishQuiz(sessionId);
    }
  } catch (error) {
    console.error('Failed to submit answer:', error);
  }
};
```

### Finishing a Quiz

```typescript
const finishQuiz = async (sessionId: number) => {
  try {
    const results = await gameService.finishGame(sessionId);
    console.log('Quiz completed!', results);
    // results.final_score - final score
    // results.badges_earned - any new badges
    // results.performance_summary - detailed stats
  } catch (error) {
    console.error('Failed to finish quiz:', error);
  }
};
```

### Getting User Progress

```typescript
import { progressService } from '@/lib/api-services';

const loadProgress = async () => {
  try {
    const progress = await progressService.getUserProgress();
    console.log('User progress:', progress);
    // progress.total_points - total points earned
    // progress.current_rank - leaderboard rank
    // progress.average_score - average score percentage
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
};
```

## Error Handling

All API services include comprehensive error handling:

- Network errors are caught and re-thrown with meaningful messages
- API response structure validation
- Detailed console logging for debugging
- User-friendly error messages for UI display

## TypeScript Interfaces

Complete TypeScript interfaces are provided for all API responses:

- `GameSession` - Quiz session data
- `SubmitAnswerResult` - Answer submission response
- `GameResult` - Final quiz results
- `UserProgress` - User progress data
- `Question` and `Answer` - Question/answer data structures

## Testing

Use the **ApiTestDashboard** (`/api-test`) to test all endpoints:

1. Navigate to `/api-test` in your application
2. Enter test parameters (quiz ID, session ID, etc.)
3. Click test buttons to verify each endpoint
4. Check console logs and response data

The API endpoints are fully integrated and ready for use in your quiz application!
