# Interceptors
    An interceptor is a class annotated with the @Injectable() decorator and implements the NestInterceptor interface.

- Interceptors have a set of useful capabilities which are inspired by the Aspect Oriented Programming (AOP) technique. 
 - They make it possible to:

   - bind extra logic before / after method execution
   - transform the result returned from a function
   - transform the exception thrown from a function
   - extend the basic function behavior
   - completely override a function depending on specific conditions (e.g., for caching purposes)

✅ Interceptor Basics

    Interceptors implement intercept(context, next) method.

    They run after Guards, before Pipes & Route Handler response is sent.

✅ ExecutionContext (1st Argument)

    Same object used in Guards.

    Extends ArgumentsHost.

Gives info about:

    Controller

    Handler method

    Request / Response

    Type of app (HTTP, RPC, WS)

    Helps write generic interceptors that work everywhere.

✅ CallHandler (2nd Argument)

Has method: handle()

handle() calls the actual route handler.

❗ If you DON’T call handle(), controller method will NOT execute.

✅ Before & After Logic

Code before next.handle() → runs before controller

Code after next.handle() → runs after controller

Example flow:

Request → Interceptor (before) → Controller → Interceptor (after) → Response

✅ Observable & RxJS

handle() returns an Observable

You can use RxJS operators like:

map() → modify response

tap() → logging

catchError() → handle errors

✅ AOP Concept (Pointcut)

Calling handle() = Pointcut

It’s the exact place where interceptor logic is injected
before and after actual method execution.

✅ Use Cases of Interceptors

Logging request/response

Response transformation

Timeout handling

Caching

# Binding interceptors#
- In order to set up the interceptor, we use the @UseInterceptors() decorator imported from the @nestjs/common package.
-  Like pipes and guards, interceptors can be 
    - controller-scoped, method-scoped, or global-scoped.

@UseInterceptors(LoggingInterceptor)
export class CatsController {}

- we can also pass an in-place instance:
    @UseInterceptors(new LoggingInterceptor())
    export class CatsController {}

# Global interceptor
- In order to set up a global interceptor, we use the useGlobalInterceptors() method

    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new LoggingInterceptor());

- Global interceptors are used across the whole application, for every controller and every route handle

- As global interceptor we can directly access by any module

    @Module({
    providers: [
        {
        provide: APP_INTERCEPTOR,
        useClass: LoggingInterceptor,
        },
    ],
    })
    export class AppModule {}


# Response mapping#
    - We already know that handle() returns an Observable. The stream contains the value returned from the route handler, and - - - thus we can easily mutate it using RxJS's map() operator.

- Nest interceptors work with both synchronous and asynchronous intercept() methods.

Note :
 - Interceptors have great value in creating re-usable solutions to requirements that occur across an entire application.

For example, imagine we need to transform each occurrence of a null value to an empty string ''. 
We can do it using one line of code and bind the interceptor globally so that it will automatically be used by each registered handler.

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map(value => value === null ? '' : value )); // transform null value into string
  }
}


# Exception mapping#
- Another interesting use-case is to take advantage of RxJS's catchError() operator to override thrown exception
- refer errors.interceptor.ts

🔥 Big Picture: Where Interceptor Fits in Request Lifecycle

Client
  ↓
Express/Fastify Middleware
  ↓
Guards
  ↓
Interceptors (BEFORE)
  ↓
Pipes
  ↓
Controller Method
  ↓
Service
  ↓
Controller returns Observable/Promise/value
  ↓
Interceptors (AFTER via RxJS)
  ↓
Response sent to Client

👉 Interceptors wrap the execution of the route handler.


🧠 Key Concept: Interceptor = Wrapper Around Observable

Interceptor does NOT wait like async/await around the controller.
Instead, it works by wrapping the response stream.

Interceptor signature:
- intercept(context: ExecutionContext, next: CallHandler): Observable<any>


next.handle() returns an Observable of controller result

Interceptor returns a new Observable

Nest subscribes to that Observable and sends final value as HTTP response

So the interceptor is not “paused and resumed” —
it creates a pipeline that continues after controller finishes.


⚙️ What Happens Internally (Step-by-Step)
1. Request enters Nest

Express/Fastify passes request to Nest Router.

Nest figures out:

Controller

Method

Guards

Interceptors

Pipes


2. Interceptors are composed like middleware chain

If you have:

@UseInterceptors(A, B, C)


Nest builds execution like:

A.intercept(
  B.intercept(
    C.intercept(
      ControllerHandler
    )
  )
)


So execution order:

▶ Before:

A → B → C → Controller

◀ After (reverse):

Controller → C → B → A

Exactly like onion layers 🧅

Controller Returns Value → Converted to Observable


5. After Phase (RxJS Operators)

Interceptor attaches operators:

next.handle().pipe(
  map(data => transform(data)),
  tap(() => log()),
)


This runs when:

Controller finishes

Data is emitted



🧬 Is Interceptor Instance Alive Till Response?
✔ Yes — but not in blocking way.

Interceptor instance is:

Created once (singleton by default)

Its intercept() method sets up observable chain

After that, RxJS manages execution

There is no thread blocking or memory lock.

Everything is event-loop + observable callbacks.


🔁 How Async Flow Works

Think like this:

Request arrives
→ interceptor builds observable pipeline
→ controller runs
→ emits result
→ rxjs operators execute
→ response sent


Interceptor does not hold stack frame waiting.
It just registers callbacks in RxJS stream.


🧠 Why Interceptors Are Better Than Middleware for Response Logic

Middleware:

    Runs before controller only

    Cannot modify response body easily

    Doesn't know which handler will run

Interceptor:

    Knows controller + method (ExecutionContext)

    Can run before AND after

    Can change response data

    Can catch errors

    Works for HTTP, RPC, GraphQL, WS

So interceptor is true framework-level cross-cutting concern handler.



🧩 How Errors Flow Through Interceptors

If controller throws error:

Controller → throws
→ Observable emits error
→ Interceptor catchError() can handle
→ Exception Filter handles final error


So order:

Interceptor → Exception Filter → HTTP Response


Interceptors can:

transform errors

retry

log



❌ What Interceptors Should NOT Do Before Controller

This is very important for design clarity.

❌ Authorization

That’s Guard’s job.

❌ Validation

That’s Pipe’s job.

❌ Authentication

That’s Middleware or Guard.

❌ Business Rules

That’s Service layer.

So if you find yourself doing:

role checks

user existence checks

payload validation

👉 you are using interceptor incorrectly.

=================================
🤔 Then Why Not Do Everything in Guards or Pipes?

Because Interceptors are about:

Execution flow control and cross-cutting behavior

Guards → Should this run?
Pipes → Is data valid & transformed?
Interceptors → How should execution & response be wrapped?

Interview-Level One-Liner

    If interviewer asks:

    What kind of logic runs in interceptor before controller?

    You say:

    Pre-execution logic in interceptors is mainly for cross-cutting concerns such as logging, tracing, caching, timeouts, transaction boundaries, and short-circuiting execution. It is not meant for authorization or validation, which are handled by guards and pipes. Interceptors control how execution happens, not whether it should happen.


idempotency interceptor
Aim - avoid duplicate transfer to store , if find idempotency on table gives 500 then retry till max count
- to create transfer 
- accept request body
- generate request hash code 
- check first transfer exixt into idempotency table with same key
- if not exist then create idempotency record & add hash payload into table with all details
- If record exist then return prev generated req hash code 
- If idempotency key conflicts through 400 error


