✅ What is Metadata in NestJS?

👉 Metadata = extra information attached to classes, methods, or parameters
that Nest reads later to decide:

how to route requests

how to validate data

how to apply guards/interceptors

how to inject dependencies

It does not change the code, it only adds information about the code.

✅ How Metadata is Stored

Nest uses:

Reflect.defineMetadata()
Reflect.getMetadata()


from reflect-metadata package.

Example (conceptually):

@SetMetadata('roles', ['admin'])


internally becomes:

Reflect.defineMetadata('roles', ['admin'], handler)


So later Nest can read:

Reflect.getMetadata('roles', handler)


✅ Why Nest Needs Metadata

Because Nest is:

configuration-by-decorators framework

Instead of config files, you write:

@Controller()

@Get()

@Injectable()

@UseGuards()

All these only store metadata.
Nest later reads it and builds behavior.


✅ Metadata in Request Lifecycle (Very Important)

When HTTP request comes:

Request
 ↓
Router finds controller method
 ↓
Reads metadata:
   - guards
   - pipes
   - interceptors
   - filters
 ↓
Executes them in order


So decorators don’t execute logic —
they only mark metadata.

✅ Where Metadata Is Used in Nest
1️⃣ Routing
@Controller('users')
@Get(':id')


Metadata stores:

base path = users

method = GET

route = :id

Router uses this to match request.


# Custom Decorators (like Roles)
@Roles('admin')


Sets metadata:

roles = ['admin']


Guard reads it:

this.reflector.get('roles', context.getHandler())


🔥 This is classic metadata usage.

6️⃣ DI (Providers & Inject)
@Injectable()
constructor(private svc: UserService)


Nest reads metadata:

parameter types

injection tokens

Then resolves dependencies.

Without metadata, DI would not work.


✅ Do ALL Decorators Use Metadata?
✅ YES — in NestJS:

class decorators

method decorators

param decorators

custom decorators

All store metadata.

They are NOT executed at runtime per request.
They run once at app startup to attach metadata.

Middleware
 → Guards (from metadata)
 → Pipes (from metadata)
 → Interceptors (before)
 → Controller method
 → Interceptors (after)
 → Filters (if error)
So metadata = configuration for whole pipeline.


✅ What Happens at App Start vs Runtime
🟢 At App Startup (Bootstrap Phase)

Nest scans your code and collects metadata from decorators:

@Controller() → routes

@Get() → HTTP methods

@UseGuards() → which guards apply

@UseInterceptors() → interceptors

@UsePipes() → validation/transformation

@Injectable() → DI providers

constructor types → dependency graph

👉 Nest builds:

routing table

dependency graph

execution pipelines

⚠️ No request logic runs here — only configuration is prepared.


🔵 At Runtime (When Request Comes)

Now real data is involved:

Incoming Request
   ↓
Router finds controller + method (from metadata)
   ↓
Nest builds ExecutionContext
   ↓
Guards run (compare metadata + request data)
   ↓
Pipes run (validate/transform request data)
   ↓
Interceptors run (before)
   ↓
Controller method executes
   ↓
Interceptors run (after)
   ↓
If error → Exception Filters


So at runtime:

👉 metadata + request data are compared / evaluated together
to decide what to execute.

Example:

Metadata: @Roles('admin')

Request: user.role = 'user'

Guard compares → reject


# summary 
NestJS uses decorators to store metadata during bootstrap, and at runtime it uses that metadata together with request data to build the execution pipeline and enforce guards, validation, and interceptors.