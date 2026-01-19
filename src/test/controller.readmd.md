# Request object

import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}


# Nest provides decorators for all of the standard HTTP methods:
 @Get(), @Post(), @Put(), @Delete(), @Patch(), @Options(), and @Head()


# Route wildcards


@Get('abcd/*')
findAll() {
  return 'This route uses a wildcard';
}

The 'abcd/*' route path will match abcd/, abcd/123, abcd/abc, and so on. The hyphen ( -) and the dot (.) are interpreted literally by string-based paths.


# Request payloads

For requestBody payload need DTO structure for validation 

- DTO defines how data is sent over the network.

- Use classes, not interfaces, for DTOs in NestJS.

- Classes exist at runtime; interfaces are removed after compilation.

- NestJS features (Pipes, Validation, Transformation) need runtime metadata.

- Decorators like @IsString() work only with class-based DTOs.

- Therefore, DTO must be a class for validation and reflection to work.



# Basic Controller Concepts
⭐ One-Line Revision (Perfect for Interview)

Controller role: Handles HTTP request and sends response.

No business logic: Keeps code clean, reusable, and testable.

Routing: Done using decorators like @Controller() and @Get() which NestJS reads at runtime.

Classes exist at runtime; interfaces are removed after compilation.
=========================================

What is a controller in NestJS?

What role does a controller play in request–response lifecycle?
 Answer:
The controller is the entry point for HTTP requests. It receives the request, extracts required data (params, body, query), calls the service to perform business logic, and then returns the response to the client.

In short:

Controller = request handler + response sender, not business processor.
=========================================

Difference between Controller and Service?
=======================

Why should business logic not be written in controllers?
-Answer:
Controllers should stay thin and only handle HTTP-related work. Business logic should be in services because:

Makes code reusable (same logic used by jobs, queues, other APIs)

Improves testability

Keeps controllers simple and readable

Follows separation of concerns

In short:

Controllers manage requests, services handle business rules.
==================================

How does NestJS map HTTP requests to controller methods?
- NestJS uses decorators to map routes to methods.

@Controller('users')
export class UsersController {

  @Get(':id')
  getUser(@Param('id') id: string) {}
}
This means:

@Controller('users') → base route /users

@Get(':id') → GET request to /users/:id

At runtime, NestJS uses metadata from these decorators to match incoming HTTP requests to the correct method.

In short:

Decorators define routes, NestJS router maps request → method.
====================================


🔹 Decorators Used in Controllers

What is @Controller() and how does routing work?

Difference between @Get(), @Post(), @Put(), @Patch(), @Delete()?

When to use @Patch() vs @Put()?

@Put() → Replace the entire resource
@Patch() → Update only some fields

Interview line:

PUT is full update, PATCH is partial update.
===========================================

Purpose of @Param(), @Query(), @Body()?

✅ Route Params (@Param) — For Resource Identity
👉 Used to identify which resource
What kind of values in Params?

Numeric IDs (123)

UUIDs (550e8400-e29b...)

Business IDs (ORD-999, TXN-7788)

Never sensitive data (no password, no tokens)

✅ Query Params (@Query) — For Filtering, Pagination, Search
GET /users?status=active&role=admin
GET /payments?page=2&limit=50
GET /orders?from=2025-01-01&to=2025-01-31

GET /payments?status=SUCCESS&bank=HDFC
GET /settlements?from=2025-01-01&to=2025-01-31
GET /users?sort=createdAt&order=desc
GET /customers?search=rahul

=====================================================

Difference between @Req() and @Request()?
👉 No difference.
Both give access to the same request object (Express/Fastify).
@Request() is just an alias of @Req().

Interview line:
Both are same, only naming difference.
===========================================

Difference between @Res() and standard return values?
✅ Standard return (Recommended)
return data;

NestJS handles response automatically

Interceptors, pipes, status codes work properly

Cleaner and testable

Using @Res()
res.status(200).json(data);

You control response manually

Bypasses NestJS response handling

Interceptors won’t work

Use @Res() only when:

Streaming files

Custom headers

Redirects

Interview line:

Avoid @Res() unless low-level response control is needed.
===================================


Why should we avoid using @Res() directly?

🔹 Request Validation & DTOs

Why are DTOs used in controllers?

Why DTOs should be classes and not interfaces?

How does ValidationPipe work with controllers?
Flow:

Request body/query comes

NestJS converts it to DTO class

ValidationPipe runs class-validator decorators

If valid → controller method runs

If invalid → error returned automatically

Works only with class-based DTOs.
====================================================

What happens if validation fails?
Request does not reach controller

NestJS returns:

400 Bad Request

Error message with failed fields

{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}

=====================================

How to validate query params vs body params?
Body validation:
@Post()
create(@Body() dto: CreateUserDto)

Query validation:
@Get()
find(@Query() dto: SearchUserDto)

=========================================

How to make a field optional in DTO?

🔹 Pipes in Controllers

What are pipes and when are they executed?
✅ What are Pipes and when are they executed?

Pipes are used to:

✅ Validate data

✅ Transform data

They run:
👉 After Guard, before Controller method

Example uses:

Convert string → number

Validate request fields
=========================================

Difference between global, controller-level, and method-level pipes?

| Level           | Applies To                    |
| --------------- | ----------------------------- |
| Global Pipe     | All APIs                      |
| Controller Pipe | All routes in that controller |
| Method Pipe     | Only that API method          |


app.useGlobalPipes(new ValidationPipe());

@UsePipes(MyPipe)
@Controller()

@UsePipes(MyPipe)
@Get()

========================================
✅ What is ParseIntPipe?

Built-in pipe to:

Convert string → number

Validate it is a number

@Get(':id')
get(@Param('id', ParseIntPipe) id: number)
============================================

If not number → 400 error
===========================================

✅ When to use Pipes instead of Middleware?
Use Case	                   Middleware	                  Pipe
Request logging	             ✅ Yes	                    ❌ No
Auth token check             ✅ Yes / Guard better	      ❌ No
Data validation	            ❌ No	                     ✅ Yes
Data transformation	        ❌ No	                     ✅ Yes
Needs DTO metadata	        ❌ No	                     ✅ Yes

Key difference:

Middleware → before routing, no DTO info

Pipe → after routing, has method + DTO info

Interview line:

Use pipes for validating and transforming request data
================================================================

How to create a custom pipe?

When would you use pipes instead of middleware?

🔹 Exception Handling

How does NestJS handle exceptions in controllers?

What is HttpException?

Difference between throw new Error() and throw new HttpException()?

How to create custom exception filters?

How to return proper HTTP status codes from controller?

🔹 Guards & Authorization

What are guards and where are they executed?

Difference between guards and middleware?

How does @UseGuards() work?

How to protect controller routes using JWT?

Role of @Roles() decorator?

Order of execution: Middleware → Guard → Pipe → Interceptor → Controller?

🔹 Interceptors in Controllers

What is an interceptor?

Difference between interceptor and middleware?

How to transform response using interceptors?

How to log request/response time in controllers?

How to handle response mapping globally?

🔹 API Versioning & Routing

How to version APIs in NestJS controllers?

Difference between URI versioning and header versioning?

How to define route prefixes?

How to handle backward compatibility?

🔹 File Uploads & Form Data

How to handle file uploads in controllers?

Difference between FileInterceptor and FilesInterceptor?

How to validate uploaded files?

How to upload multipart/form-data?

🔹 Performance & Best Practices

Should controllers be async?

How to handle large request payloads?

How to handle bulk APIs safely?

Why should controllers be thin?

How to avoid controller bloating?

🔹 Testing Controllers

How to unit test controllers?

Difference between unit testing controller vs e2e testing?

How to mock services in controller tests?

What is TestingModule?

🔹 Swagger & API Docs

How does Swagger integrate with controllers?

Purpose of @ApiTags(), @ApiOperation(), @ApiResponse()?

How to document request body using DTOs?

How to hide endpoints from Swagger?

🔹 Real-World Scenario Questions (Senior Level)

How would you design controllers for bulk insert APIs?

How to handle idempotency in POST controllers?

How to return consistent API response structure?

How to handle partial failures in batch APIs?

How to secure controllers in multi-tenant systems?

🧠 One-Line Interview Tip

Controllers handle HTTP concerns only — validation, routing, guards, and response formatting — never business logic.


⭐ Super Short Revision Lines

PUT = full update, PATCH = partial update

@Req() and @Request() are same

Avoid @Res() unless manual control needed

ValidationPipe runs before controller, blocks invalid requests

Pipes validate & transform input

Global pipe → all APIs, Method pipe → single API

ParseIntPipe converts param to number

Pipes > Middleware for validation