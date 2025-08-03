// API Types based on the OpenAPI schema

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_picture?: string;
  role?: 'user' | 'admin' | 'super';
  gender?: 'male' | 'female' | 'others';
  profession?: 'gynecologist' | 'obstetricians' | 'other';
  is_active: boolean;
  meeting_url?: string;
  is_medical_staff: boolean;
  is_approved_staff: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  created_at: string;
  quiz_count: string;
}

export interface Answer {
  id: number;
  answer_text: string;
  is_correct: boolean;
  order: number;
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
  created_by_name: string;
  created_at: string;
  question_count: string;
}

export interface QuizDetail extends Quiz {
  questions: Question[];
}

export interface UserProgress {
  id: number;
  user_email: string;
  total_points: number;
  total_quizzes_taken: number;
  total_quizzes_passed: number;
  current_streak: number;
  longest_streak: number;
  last_quiz_date?: string;
  level: number;
  badges_earned: string;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  badge_type: 'streak' | 'score' | 'category' | 'participation';
  icon: string;
  color: string;
  points_required: number;
  category?: number;
  category_name: string;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'others';
  password: string;
  confirm_psd: string;
  profession?: 'gynecologist' | 'obstetricians' | 'other';
  is_medical_staff?: boolean;
  role?: 'user' | 'admin' | 'super';
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface CreateQuizRequest {
  title: string;
  description: string;
  category: number;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit?: number;
  total_questions?: number;
  pass_score?: number;
  points_reward?: number;
  questions_data: any[];
}

export interface GameAction {
  action: string;
  data?: any;
}
