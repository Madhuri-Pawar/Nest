# Middleware
✅ What is Middleware?

👉 Middleware is a function/class that runs before the route handler (controller).

It has access to:
    req
    res
    next()

Used to:
    Modify request
    End request
    Pass to next layer

✅ Role & Responsibilities

Middleware is responsible for:

✅ Logging requests

✅ Adding/modifying headers

✅ Attaching data to req (user, traceId)

✅ Blocking request (auth check, IP block)

❌ NOT for business logic

❌ NOT for response transformation

Runs before Guards, Pipes, Interceptors, Controllers.

✅ Request Lifecycle Position (Very Important)

👉 Order of execution:

    Middleware

    Guard

    Interceptor (before)

    Pipe

    Controller

    Interceptor (after)

✅ Scenarios Where Middleware is Used
Logging
    log method, URL, time, headers  

🔹 Auth Token Parsing
    Read JWT from header and attach to req.user

🔹 Request ID / Trace ID
    Add correlation-id for microservices tracing

IP Whitelisting / Blacklisting

🔹 Body Pre-processing
    decrypt request body before controller



Middleware functions can perform the following tasks:
   - execute any code.
   - make changes to the request and the response objects.
   - end the request-response cycle.
   - call the next middleware function in the stack.
   - if the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

- You implement custom Nest middleware in either a function, or in a class with an @Injectable() decorator
- The class should implement the NestMiddleware interface, while the function does not have any special requirements

Example:

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

- Dependency injection
 - Nest middleware fully supports Dependency Injection
 - ust as with providers and controllers, they are able to inject dependencies that are available within the same module.


# Applying middleware
- configure middleware at module level
- any http req comes it goes into app module because it cosumes the middleware 

 @Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}

2. Class-based Middleware (Most Used)

Supports:
    Dependency Injection
    Config, services, etc.

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // will take multiple middleware as agrs 
      .forRoutes(CatsController);
  }
}

3. Excluding routes
-  we may want to exclude certain routes from having middleware applied. This can be easily achieved using the exclude() method.

consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/{*splat}',
  )
  .forRoutes(CatsController);

4. Functional middleware

Used when:
    Simple logic
    No DI needed

import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
};

5. Multiple middleware
- In order to bind multiple middleware that are executed sequentially
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);

6. Global middleware
- If we want to bind middleware to every registered route at once, we can use the use() method that is supplied by the INestApplication instance:

✅ Apply to All Routes
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(process.env.PORT ?? 3000);



✅ Q1: Can middleware use DI?

✔ Yes, if class-based and marked with @Injectable().

✅ Q2: Can middleware be async?

✔ Yes, can use async/await before calling next().

✅ Q4: Is middleware executed for WebSockets?

❌ No.
Use Gateway Guards or Interceptors.

✅ Q5: How to share data from middleware to controller?
req.user = decodedUser; // attach to request 

Then in controller:
@Req() req


✅ Q6: Why not use middleware for auth?

Because:

    No access to route metadata

    Cannot check roles, permissions

So:

    Middleware → token parsing

    Guard → permission check


# Summary
Middleware in NestJS runs before routing and is used for request-level concerns like logging, token parsing, request mutation, and tracing. It is applied at module or app level and should not contain business logic or authorization rules, which are handled by Guards.

Use function-based middleware for simple stateless logic without dependencies, and class-based middleware when you need dependency injection, reusable logic, or enterprise-level features.

✅ Why Middleware Cannot Access Decorators but Guards Can
✅ Short Answer (Interview Style)

Middleware runs before Nest knows which controller and handler will execute, so it has no access to route metadata (decorators). Guards run after routing, so they can access handler and class decorators via ExecutionContext.

✅ Detailed but Simple Flow
🔹 Step 1: Middleware Phase (Before Routing)

At this stage:

Request just entered the app

Nest does not yet know:

Which controller

Which method (handler)

So middleware only has:

req, res, next

❌ No access to:

@Roles()

@UseGuards()

Route metadata

🔹 Step 2: Routing Happens

Now Nest decides:

Which controller

Which method to call

🔹 Step 3: Guard Phase (After Routing)

Now Guard gets:

canActivate(context: ExecutionContext)


From context, Guard can access:

Controller class

Handler method

All decorators metadata

context.getHandler()
context.getClass()


So Guard can read:

Roles

Permissions

Custom decorators