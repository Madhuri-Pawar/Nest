# Guards
- A guard is a class annotated with the @Injectable() decorator, which implements the CanActivate interface

- client -> http request-> guard->route handler (@ResquestMapping)
- Guards decide whether a request is allowed to reach the route handler.
- Mainly used for authorization (roles, permissions, ACL).
- Often works with authentication (e.g., after token is validated).
- Unlike middleware, Guards know which controller & handler will run.

- Guards use ExecutionContext to access:

    handler

    class

    request details

Middleware is route-agnostic (doesn’t know next handler).

Guards are declarative (used via decorators like @UseGuards()).

Helps keep code DRY and structured.

✅ Execution Order (Important for Interview)

    Middleware

    ✅ Guards

    Interceptors

    Pipes

    Route Handler

    Interceptors (response)

👉 So: Guards run after middleware, but before pipes & interceptors.


import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

- Above code explain 

validateRequest()
- Add logic to validate conditions

canActivate()

- Every guard must implement a canActivate() function. 
- This function should return a boolean, indicating whether the current request is allowed or not. 
- It can return the response either synchronously or asynchronously (via a Promise or Observable). 
- Nest uses the return value to control the next action:

- if it returns true, the request will be processed.
- if it returns false, Nest will deny the request.

# Execution context
- The canActivate() function takes a single argument, the ExecutionContext instance
- The ExecutionContext inherits from ArgumentsHost
- ArgumentsHost used to get reference of req obj

# Role-based authentication
- refer file role guards

# Binding guards
- Controller-scope
- method scoped
- global scoped

- controller scope 

@Controller('cats')
@UseGuards(RolesGuard) // pass class direct will refer instance internally DI
export class CatsController {}


@Controller('cats')
@UseGuards(new RolesGuard())// pass inplace instance directly
export class CatsController {}

- Global scoped
- Global guards are used across the whole application, for every controller and every route handler

const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());

- Register guard at module level

    @Module({
    providers: [
        {
        provide: APP_GUARD,
        useClass: RolesGuard,
        },
    ],
    })
    export class AppModule {}


@UseGuards(EmployeesGuard, RoleGuard)
export class LoansController {}

👉 Execution Order
✅ EmployeesGuard runs first

✅ RoleGuard runs second

✅ If both return true, request reaches controller

❌ If any guard returns false or throws → request is blocked


- pattern

@UseGuards(AuthGuard, RolesGuard)

Because:

AuthGuard → validates token & sets req.user

RolesGuard → reads req.user.roles

If reversed, RolesGuard may fail because req.user is not set yet

When you create guard you need
- set metadata decorator
- set config key
- set config for conditions like roles or features in config dev yaml
- set provider class of guard into module 

- when any request comes to guard it connect to metadata inject the provider guard class & config 
- then run the gaurd can activate method then pick config.yaml file do the validation & return true/false

- when a guard returns false, the framework throws a ForbiddenException which catch by global exeception filter
- 
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}

- If you want to return different response
    throw new UnauthorizedException();

    