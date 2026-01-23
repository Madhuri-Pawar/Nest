# Custom execptions

✅ Basic Custom Exception (Nest way)

✅ Standard Enterprise Error Structure

✅ Global Exception Filter (best practice)

✅ When to use which strategy (interview-ready)


import { HttpException, HttpStatus } from '@nestjs/common';

// ✅ 1. Basic Custom Exception (Extend HttpException)
export class UserNotFoundException extends HttpException {
  constructor(userId: string) {
    super(
      {
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
        details: { userId },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

-  Use in service 
// if (!user) {
//   throw new UserNotFoundException(userId);
// }


- Response
// {
//   "message": "User not found",
//   "errorCode": "USER_NOT_FOUND",
//   "details": { "userId": "123" }
// }

// ✅ 2. Enterprise-Level Error Structure (Standardized)
// 🎯 Goal:

// Every API error should look the same.

// 🔹 Error Interface

export interface ApiError {
  statusCode: number;
  message: string;
  errorCode: string;
  path?: string;
  timestamp: string;
  details?: any;
}

// Refer global execption filter file
// Register Globally
// main.ts
// app.useGlobalFilters(new GlobalExceptionFilter());


// Or via provider:

// {
//   provide: APP_FILTER,
//   useClass: GlobalExceptionFilter,
// }


// ✅ 4. Domain-Based Custom Errors (Senior Design)

// Instead of random exceptions, group by domain.

// 📁 structure
// errors/
//  ├─ auth.errors.ts
//  ├─ user.errors.ts
//  ├─ payment.errors.ts
//  └─ system.errors.ts

// Example :  auth error

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        message: 'Invalid username or password',
        errorCode: 'AUTH_INVALID_CREDENTIALS',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}


✅ 5. Business vs System Errors (Interview Gold Point)
🔹 Business Errors

Expected failures

Example	Code
Invalid OTP	400
Insufficient balance	422
User not found	404

Handled with custom exceptions.

🔹 System Errors

Unexpected failures

Example
DB down
Kafka timeout
AWS failure

Handled by:

GlobalExceptionFilter

Logged to monitoring (CloudWatch, Sentry)


✅ 6. When to Use Which Strategy (Interview Answer)
✔ Controller Level

Only validation errors (DTO)

✔ Service Level

Throw business exceptions

throw new UserNotFoundException(id);

✔ Adapter / Integration Layer

Wrap external errors

catch (e) {
  throw new ExternalServiceException('B24', e.message);
}

✔ Global Filter

Formats response, logs error


✅ 7. Bonus: Error Codes for Microservices (Very Senior)

Always send:

errorCode

traceId

So logs can be correlated across services.

Example:

{
  "errorCode": "COMPLIANCE_SYNC_FAILED",
  "traceId": "abc-xyz-123"
}

🎯 Senior Interview One-Liner (You Can Say)

In NestJS, I use domain-specific custom HttpExceptions for business errors,
a global exception filter to standardize API responses and logging,
and error codes instead of relying only on HTTP status.
This helps in microservices for tracing, retries, and client-side handling.

