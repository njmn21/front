export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    result: string;  // El JWT token
    statusCode: number;
    message: string;
    success: boolean;
}