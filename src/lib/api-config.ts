// API Configuration
const API_BASE_URL =  'http://217.76.59.68:4001';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNIN: '/auth/v1/signin',
    SIGNUP: '/auth/v1/signup',
    REFRESH: '/auth/v1/token/refresh',
    VERIFY: '/auth/v1/account/verify',
    VERIFY_CODE: '/auth/v1/account/verify/code',
    RESET_PASSWORD: '/auth/v1/reset-password',
    USERS: '/auth/v1/users',
    PROFILE: '/auth/v1/user/profile',
  },
  
  // Quiz endpoints
  QUIZ: {
    CATEGORIES: '/quiz/v1/categories',
    QUIZZES: '/quiz/v1/quizzes',
    LEADERBOARD: '/quiz/v1/leaderboard',
    PROGRESS: '/quiz/v1/progress/',
    BADGES: '/quiz/v1/badges',
    SESSIONS: '/quiz/v1/sessions',
    ANSWERS: '/quiz/v1/answers',
    RESULTS: '/quiz/v1/results',
    POPULAR: '/quiz/v1/quizzes/popular',
    RECOMMENDED: '/quiz/v1/quizzes/recommended',
    GAME: {
      START: '/quiz/v1/game/start',
      SUBMIT_ANSWER: '/quiz/v1/game/submit_answer',
      FINISH: '/quiz/v1/game/finish',
    }
  }
};

export default API_BASE_URL;
