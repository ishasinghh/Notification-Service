export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UserNotFoundError extends CustomError {
  constructor() {
    super("User not found", 401);
  }
}

export class InvalidCredentialsError extends CustomError {
  constructor() {
    super("Invalid credentials", 401);
  }
}
export class InvalidTokenError extends CustomError {
  constructor() {
    super("Invalid token", 401);
  }
}
