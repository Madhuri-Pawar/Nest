
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);



// @Get()
// async findOne(@User() user: UserEntity) {
//   console.log(user);
// }

// passing Data

// Let's assume, for example, that our authentication layer validates requests and attaches a user entity to the request object.
// The user entity for an authenticated request might look like:

// {
//   "id": 101,
//   "firstName": "Alan",
//   "lastName": "Turing",
//   "email": "alan@email.com",
//   "roles": ["admin"]
// }