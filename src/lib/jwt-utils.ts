// JWT utility functions
export interface JWTPayload {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  verified: boolean;
  provider: string;
  status: string;
  phone: string | null;
  profession: string | null;
  role: string;
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

export const getUserFromToken = (token: string): any => {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return {
    id: payload.user_id,
    email: payload.email,
    first_name: payload.firstname,
    last_name: payload.lastname,
    phone: payload.phone || '',
    profile_picture: null,
    role: payload.role,
    gender: null,
    profession: payload.profession,
    is_active: payload.status === 'Active',
    meeting_url: null,
    is_medical_staff: false,
    is_approved_staff: false,
    verified: payload.verified,
    provider: payload.provider,
  };
};
