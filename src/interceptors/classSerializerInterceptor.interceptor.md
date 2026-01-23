✅ What Is Response Transformation?

It means:

Before sending data to client, transform / sanitize / reshape response
without touching business logic.

Use cases:

Hide sensitive fields (password, tokens)

Rename fields

Add computed fields

Pagination wrapping

Mask PII



✅ Best Tool: ClassSerializerInterceptor

Uses class-transformer decorators.

import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string;

  @Expose()
  get displayName() {
    return this.username.toUpperCase();
  }
}

✅ Step 2 — Apply Interceptor
✔ Controller Level

@UseInterceptors(ClassSerializerInterceptor)
@Get('me')
getProfile(): UserResponseDto {
  return this.authService.getProfile();
}

=====================================
✔ Global (Enterprise Way)
main.ts
app.useGlobalInterceptors(
  new ClassSerializerInterceptor(app.get(Reflector)),
);

Now every response is sanitized automatically.


✅ Step 3 — Return Class Instance (IMPORTANT)

Interceptor works only if object is class instance.

❌ Wrong
return { id: 1, password: 'abc' }; // plain object → not transformed

✅ Correct
return plainToInstance(UserResponseDto, userEntity);


or if entity already class:

return user;


✅ Senior Optimization — Separate Internal vs API Models
❗ Never expose DB entities directly

Use:

Layer	            Model
DB	                 Entity
Service	             Domain model
API	                  Response DTO

✅ Example Flow
// service
const user = await repo.findOne();
return user;

// controller
return plainToInstance(UserResponseDto, user);


Now interceptor hides fields safely.


✅ Interview Answer (Strong One)

I use ClassSerializerInterceptor globally to sanitize responses and hide sensitive fields using Exclude/Expose decorators.
For large payloads or performance-critical endpoints, I avoid class-transformer and manually map DTOs.
I also use role-based serialization groups and custom interceptors for response wrapping and pagination metadata.


