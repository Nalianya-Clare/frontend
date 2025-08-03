import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-config';

// Type definitions
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
}

export interface AuthTokens {
  refresh: string;
  access: string;
}

export interface AuthResponse {
  success: boolean;
  response: Array<{
    status_code: number;
    code: string;
    details: Array<{
      token: AuthTokens;
      expires_in: string;
    }>;
  }>;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_psd: string;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  created_at: string;
  quiz_count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  response: Array<{
    status_code: number;
    code: string;
    details: Array<{
      count: number;
      next: string | null;
      previous: string | null;
      results: T[];
    }>;
  }>;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: number;
  category_name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit: number;
  total_questions: number;
  pass_score: number;
  points_reward: number;
  question_count: number;
  created_by_name?: string;
  created_at: string;
}

export interface Question {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank';
  explanation: string;
  points: number;
  order: number;
  answers: Answer[];
}

export interface Answer {
  id: number;
  answer_text: string;
  is_correct: boolean;
  order: number;
}

export interface UserProgress {
  id: number;
  user_email: string;
  total_points: number;
  total_quizzes_taken: number;
  total_quizzes_passed: number;
  current_streak: number;
  longest_streak: number;
  last_quiz_date: string | null;
  level: number;
  badges_earned: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  badge_type: 'streak' | 'score' | 'category' | 'participation';
  icon: string;
  color: string;
  points_required: number;
  category: number | null;
  category_name: string;
  is_active: boolean;
}

export interface GameSession {
  id: number;
  quiz: number;
  user_email: string;
  start_time: string;
  end_time: string | null;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken: number;
  is_completed: boolean;
  current_question: number;
}

export interface QuizSubmission {
  session_id: number;
  question_id: number;
  selected_answer_id: number;
  time_taken: number;
}

export interface GameResult {
  session: GameSession;
  points_earned: number;
  badges_earned: Badge[];
  new_achievements: string[];
  rank_change: number;
}

export interface LeaderboardUser {
  rank: number;
  user_email: string;
  user_name: string;
  points: number;
  level: number;
  quizzes_passed: number;
}

export interface LeaderboardResponse {
  success: boolean;
  response: Array<{
    status_code: number;
    code: string;
    details: Array<{
      data: LeaderboardUser[];
    }>;
  }>;
}

export interface SingleQuizResponse {
  success: boolean;
  response: Array<{
    status_code: number;
    code: string;
    details: Array<{
      data: Quiz & { questions: Question[] };
    }>;
  }>;
}

// Game session interfaces
export interface StartGameRequest {
  quiz_id: number;
}

export interface StartGameResponse {
  success: boolean;
  response: Array<{
    status_code: number;
    code: string;
    details: Array<{
      data: {
        session_id: number;
        quiz: Quiz;
        current_question: Question;
        question_number: number;
        total_questions: number;
        start_time: string;
      };
    }>;
  }>;
}

export interface SubmitAnswerRequest {
  session_id: number;
  question_id: number;
  selected_answer_id: number;
  time_taken: number;
}

export interface SubmitAnswerResponse {
  success: boolean;
  response: Array<{
    status_code: number;
    code: string;
    details: Array<{
      data: {
        is_correct: boolean;
        explanation: string;
        points_earned: number;
        next_question?: Question;
        question_number: number;
        total_questions: number;
        is_final_question: boolean;
      };
    }>;
  }>;
}

export interface FinishGameRequest {
  session_id: number;
}

export interface FinishGameResponse {
  success: boolean;
  response: Array<{
    status_code: number;
    code: string;
    details: Array<{
      data: {
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
      };
    }>;
  }>;
}

// Progress response interface
export interface ProgressResponse {
  success: boolean;
  response: Array<{
    status_code: number;
    code: string;
    details: Array<{
      data: UserProgress;
    }>;
  }>;
}

// Badge response interfaces
export interface BadgeResponse {
  success: boolean;
  response: Array<{
    status_code: number;
    code: string;
    details: Array<{
      results: Badge[];
    }>;
  }>;
}

export interface UserBadgeResponse {
  success: boolean;
  response: Array<{
    status_code: number;
    code: string;
    details: Array<{
      data: {
        earned_badges: Badge[];
        total_badges: number;
        completion_percentage: number;
      };
    }>;
  }>;
}

export interface SingleCategoryResponse {
  success: boolean;
  response: Array<{
    status_code: number;
    code: string;
    details: Array<{
      data: Category;
    }>;
  }>;
}

// API Services
export const categoryService = {
  getAll: async (): Promise<{ results: Category[] }> => {
    const response: ApiResponse<Category> = await apiClient.get(API_ENDPOINTS.QUIZ.CATEGORIES);
    
    // Extract data from the nested response structure
    if (response.success && response.response?.[0]?.details?.[0]?.results) {
      return { results: response.response[0].details[0].results };
    }
    
    return { results: [] };
  },
  
  getById: async (id: number): Promise<Category> => {
    const response: SingleCategoryResponse = await apiClient.get(`${API_ENDPOINTS.QUIZ.CATEGORIES}/${id}`);
    
    // Handle single category response structure
    if (response.success && response.response?.[0]?.details?.[0]?.data) {
      return response.response[0].details[0].data;
    }
    
    throw new Error('Category not found');
  },
  
  getQuizzes: async (id: number): Promise<{ results: Quiz[] }> => {
    const response: ApiResponse<Quiz> = await apiClient.get(`${API_ENDPOINTS.QUIZ.CATEGORIES}/${id}/quizzes`);
    
    // Extract data from the nested response structure
    if (response.success && response.response?.[0]?.details?.[0]?.results) {
      return { results: response.response[0].details[0].results };
    }
    
    return { results: [] };
  },
};

export const quizService = {
  getAll: async (params?: { category?: number; difficulty?: string; page?: number }): Promise<{ results: Quiz[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category.toString());
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.page) searchParams.append('page', params.page.toString());
    
    const endpoint = searchParams.toString() 
      ? `${API_ENDPOINTS.QUIZ.QUIZZES}?${searchParams.toString()}`
      : API_ENDPOINTS.QUIZ.QUIZZES;
    
    const response: ApiResponse<Quiz> = await apiClient.get(endpoint);
    
    // Extract data from the nested response structure
    if (response.success && response.response?.[0]?.details?.[0]?.results) {
      return { results: response.response[0].details[0].results };
    }
    
    return { results: [] };
  },
  
  getById: async (id: number): Promise<Quiz & { questions: Question[] }> => {
    const response: SingleQuizResponse = await apiClient.get(`${API_ENDPOINTS.QUIZ.QUIZZES}/${id}`);
    
    // Handle single quiz response structure: response[0].details[0].data
    if (response.success && response.response?.[0]?.details?.[0]?.data) {
      return response.response[0].details[0].data;
    }
    
    throw new Error('Quiz not found');
  },
  
  getPopular: async (): Promise<{ results: Quiz[] }> => {
    const response: ApiResponse<Quiz> = await apiClient.get(API_ENDPOINTS.QUIZ.POPULAR);
    
    if (response.success && response.response?.[0]?.details?.[0]?.results) {
      return { results: response.response[0].details[0].results };
    }
    
    return { results: [] };
  },
  
  getRecommended: async (): Promise<{ results: Quiz[] }> => {
    const response: ApiResponse<Quiz> = await apiClient.get(API_ENDPOINTS.QUIZ.RECOMMENDED);
    
    if (response.success && response.response?.[0]?.details?.[0]?.results) {
      return { results: response.response[0].details[0].results };
    }
    
    return { results: [] };
  },
};

export const leaderboardService = {
  getGlobal: async (): Promise<{ results: LeaderboardUser[] }> => {
    const response: LeaderboardResponse = await apiClient.get(API_ENDPOINTS.QUIZ.LEADERBOARD);
    
    // Handle the nested response structure: response[0].details[0].data
    if (response.success && response.response?.[0]?.details?.[0]?.data) {
      return { results: response.response[0].details[0].data };
    }
    
    return { results: [] };
  },
  
  getByCategory: async (): Promise<{ results: LeaderboardUser[] }> => {
    const response: LeaderboardResponse = await apiClient.get(`${API_ENDPOINTS.QUIZ.LEADERBOARD}/by_category`);
    
    if (response.success && response.response?.[0]?.details?.[0]?.data) {
      return { results: response.response[0].details[0].data };
    }
    
    return { results: [] };
  },
};

export const progressService = {
  getUserProgress: async (): Promise<UserProgress> => {
    const response: ProgressResponse = await apiClient.get(API_ENDPOINTS.QUIZ.PROGRESS);
    
    if (response.success && response.response?.[0]?.details?.[0]?.data) {
      return response.response[0].details[0].data;
    }
    
    throw new Error('Failed to get user progress');
  },
};

export const badgeService = {
  getAll: async (): Promise<{ results: Badge[] }> => {
    const response: BadgeResponse = await apiClient.get(API_ENDPOINTS.QUIZ.BADGES);
    
    if (response.success && response.response?.[0]?.details?.[0]?.results) {
      return { results: response.response[0].details[0].results };
    }
    
    return { results: [] };
  },
  
  getUserBadges: async (): Promise<{ earned_badges: Badge[]; total_badges: number; completion_percentage: number }> => {
    const response: UserBadgeResponse = await apiClient.get(`${API_ENDPOINTS.QUIZ.BADGES}/my_badges`);
    
    if (response.success && response.response?.[0]?.details?.[0]?.data) {
      return response.response[0].details[0].data;
    }
    
    return { earned_badges: [], total_badges: 0, completion_percentage: 0 };
  },
};

// Game session services
export const gameService = {
  startGame: async (quiz_id: number): Promise<{
    session_id: number;
    quiz: Quiz;
    current_question: Question;
    question_number: number;
    total_questions: number;
    start_time: string;
    all_questions: Question[]; // Add this to the return type
  }> => {
    console.log('Attempting to start game for quiz ID:', quiz_id);
    
    try {
      const response: any = await apiClient.post(API_ENDPOINTS.QUIZ.GAME.START, { quiz_id });
      
      console.log('Raw startGame response:', JSON.stringify(response, null, 2));
      
      // Handle the actual API response structure
      if (response.success && response.response?.[0]?.details?.[0]) {
        const details = response.response[0].details[0];
        const attempt = details.attempt;
        const quiz = details.quiz;
        
        // Get the first question as current question
        const firstQuestion = quiz.questions[0];
        
        if (!firstQuestion) {
          throw new Error('No questions found in quiz');
        }
        
        // Transform the response to match expected interface
        const gameData = {
          session_id: attempt.id, // Use attempt ID as session ID
          quiz: {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            category: quiz.category,
            category_name: quiz.category_name,
            difficulty: quiz.difficulty,
            time_limit: quiz.time_limit,
            total_questions: quiz.total_questions,
            pass_score: quiz.pass_score,
            points_reward: quiz.points_reward,
            question_count: quiz.questions.length,
            created_by_name: '',
            created_at: quiz.created_at
          },
          current_question: firstQuestion,
          question_number: 1,
          total_questions: quiz.total_questions,
          start_time: attempt.started_at,
          all_questions: quiz.questions // Store all questions
        };
        
        console.log('Transformed game data:', gameData);
        return gameData;
      }
      
      // If no valid data found, throw error with response info
      console.error('No valid game data found in response:', response);
      throw new Error(`Failed to start game session - unexpected response structure`);
      
    } catch (error) {
      console.error('Start game API error:', error);
      throw error;
    }
  },
  
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
  }> => {
    console.log('Submitting answer with data:', { session_id, question_id, selected_answer_id, time_taken });
    
    try {
      // Try different parameter names and structures that the API might expect
      const requestData = {
        attempt_id: session_id, // Use attempt_id since that's what we got from start game
        question_id: question_id,
        answer_id: selected_answer_id, // Try answer_id instead of selected_answer_id
        selected_answer_id: selected_answer_id, // Keep this as fallback
        time_taken: time_taken,
      };
      
      console.log('Sending request data:', requestData);
      
      const response: any = await apiClient.post(API_ENDPOINTS.QUIZ.GAME.SUBMIT_ANSWER, requestData);
      
      console.log('Submit answer response:', response);
      
      // Handle the API response structure
      if (response.success && response.response?.[0]?.details?.[0]) {
        const details = response.response[0].details[0];
        
        // Transform the response to match expected interface
        return {
          is_correct: details.is_correct || false,
          explanation: details.explanation || '',
          points_earned: details.points_earned || 0,
          next_question: details.next_question || null,
          question_number: details.question_number || 1,
          total_questions: details.total_questions || 1,
          is_final_question: details.is_final_question || false
        };
      }
      
      throw new Error('Invalid response structure from submit answer API');
    } catch (error) {
      console.error('Submit answer API error:', error);
      
      // Enhanced error handling for validation errors
      if (error instanceof Error && error.message.includes('HTTP error! status: 400')) {
        throw new Error(`Validation error: Please check if all required fields are provided correctly`);
      }
      
      throw new Error(`Failed to submit answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
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
  }> => {
    console.log('Finishing game for session:', session_id);
    
    try {
      // Try different parameter names that the API might expect
      const requestData = {
        attempt_id: session_id, // Try attempt_id first
        session_id: session_id, // Fallback to session_id
      };
      
      const response: any = await apiClient.post(API_ENDPOINTS.QUIZ.GAME.FINISH, requestData);
      
      console.log('Finish game response:', response);
      
      // Handle the API response structure
      if (response.success && response.response?.[0]?.details?.[0]) {
        const details = response.response[0].details[0];
        
        // Transform the response to match expected interface
        return {
          session: details.session || {},
          final_score: details.final_score || 0,
          points_earned: details.points_earned || 0,
          badges_earned: details.badges_earned || [],
          new_achievements: details.new_achievements || [],
          rank_change: details.rank_change || 0,
          performance_summary: details.performance_summary || {
            total_questions: 0,
            correct_answers: 0,
            incorrect_answers: 0,
            accuracy_percentage: 0,
            time_taken: 0
          }
        };
      }
      
      throw new Error('Invalid response structure from finish game API');
    } catch (error) {
      console.error('Finish game API error:', error);
      throw new Error(`Failed to finish game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

export const authService = {
  signin: (email: string, password: string): Promise<AuthResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.SIGNIN, { email, password });
  },
  
  signup: (userData: RegisterData): Promise<AuthResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
  },
  
  refreshToken: (refresh: string): Promise<AuthResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refresh });
  },
  
  // Note: For JWT, we'll get user info from the token itself
  // This endpoint might not be needed, but keeping it for compatibility
  getProfile: (): Promise<User> => {
    return apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
  },
};
