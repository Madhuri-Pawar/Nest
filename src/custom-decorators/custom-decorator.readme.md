🔥 Real Architecture Flow (Senior Level)

1. At Startup

    Scan all modules

    Read decorators

2. Build:

    routes

    providers graph

    metadata maps

3. At Request Time

    Match route

    Create ExecutionContext

    Read metadata:

        guards

        roles

        pipes

    Execute pipeline

Decorators are static configuration, not runtime logic.

⚠️ Important Interview Point
❌ Decorators do NOT:

Validate input

Authorize users

Modify response

✅ They only:

Attach metadata

Register classes

Describe intent

Actual behavior is implemented in:

Guards

Pipes

Interceptors

🎯 One-Line Interview Answer

Decorators in NestJS are used to attach metadata to classes, methods, and parameters. Nest reads this metadata during application bootstrap and request handling to build routing, dependency injection, validation, guards, and interceptors. Decorators themselves don’t execute logic; they describe how the framework should behave.


🧩 Types of Decorators in NestJS
✅ 1. Class Decorators

Used for:

Controllers

Providers

Modules

Example:

@Controller('users')
@Injectable()
@Module()


They tell Nest:

how to register this class in DI & routing system



✅ 2. Method Decorators

Used for:

Routes

Guards

Interceptors

Example:

@Get()
@Post()
@UseGuards(AuthGuard)


They attach metadata to method:

route type

required guards

interceptors

✅ 3. Parameter Decorators (Very Powerful)

Example:

create(@Body() dto, @Param('id') id)


How this works:

At runtime Nest:

Knows controller method

Reads parameter metadata

Extracts values from request

Injects them into arguments

✅ 4. Custom Decorators

Example:

export const User = createParamDecorator(
  (data, ctx) => ctx.switchToHttp().getRequest().user
);


Now in controller:

me(@User() user) {}


So decorators can:

intercept argument creation pipeline

- const request = ctx.switchToHttp().getRequest();
contains :
  - request.body

    request.params

    request.query

    request.headers



🔥 Very Common Real-World Custom Decorators
Decorator	                    Purpose
@CurrentUser()	                  Extract req.user
@UserId()	                      Extract only user ID
@Roles()	                      Metadata for guards
@Tenant()	                      Multi-tenant routing
@IpAddress()	                  Real client IP
@RequestId()	                  Correlation ID
@DeviceInfo()	                  From headers

we have built-in decorators then why need custom & in which case

Built-in
    @Body()

    @Param()

    @Query()

    @Headers()

    @Req()

👉 So why do we need custom param decorators at all?

Because custom decorators solve problems that basic decorators can’t solve cleanly.

✅ When Do We Need Custom Decorators?
✅ 1. To Extract Frequently-Used Derived Data

Instead of repeating this everywhere:

@Req() req
const userId = req.user.id;


You write once:

@User('id') userId: string

✔ Benefits:

Less boilerplate

Cleaner controllers

Consistent access logic


We use custom decorators when we want to extract or derive commonly-used request data in a reusable, clean, and type-safe way, especially when that data is attached by guards or middleware and not directly coming from body, params, or query. They help keep controllers clean and separate infrastructure concerns from business logic.