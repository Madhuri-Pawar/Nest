# Providers
- Many of the basic Nest classes, such as services, repositories, factories, and helpers, can be treated as providers. 
- The key idea behind a provider is that it can be injected as a dependency, allowing objects to form various relationships with each other. 
- The responsibility of "wiring up" these objects is largely handled by the Nest runtime system.

# Provider registration
Now that we've defined a provider (CatsService) and a consumer (CatsController), we need to register the service with Nest so that it can handle the injection

@Module({
  controllers: [CatsController],//consumer
  providers: [CatsService],// provider
})
export class AppModule {}


# Dependency injection

1. constructor-based injection
constructor(private catsService: CatsService) {}

2. Property-based injection:

 @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
🧠 When to use which?

✅ Normal services → Constructor injection

✅ Tokens / config objects / dynamic values → Property injection with @Inject
=========================================

✅ Provider Scopes — Quick Notes

Default scope = Singleton

Provider is created once when app starts

Same instance used for all requests

- App Bootstrap

All providers are instantiated during startup

- App Shutdown
All providers are destroyed when app stops

- Request-scoped providers
New instance is created for each incoming request

Lifetime = only during that request

Use request scope when

You need request-specific data (like user, headers, trace IDs)

Trade-off

Request scope = more memory & slower than singleton

👉 Remember:
Singleton = app lifetime
Request-scoped = per HTTP request

example

✅ ConfigService (default scope) = common for all API requests

If ConfigService is singleton (default) and you inject it into any module/controller/service:

@Controller()
export class UserController {
  constructor(private readonly config: ConfigService) {}
}


Then:

✅ Only ONE instance of ConfigService is created

✅ All API requests use the same instance

✅ All controllers & services in that module (and even other modules if shared) use it

So for:

Request 1 → uses same ConfigService

Request 2 → uses same ConfigService

Request 1000 → still same ConfigService

⚠️ Important: Don’t store request data in singleton

❌ Bad (unsafe):

this.config.currentUser = user; // ❌ will mix users between requests


Because multiple users hit APIs at same time → data can overwrite.

✅ When you need per-request data

Use request-scoped service:

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  constructor(@Inject(REQUEST) private req: Request) {}
}


New instance for each API call

Safe to store request-specific info

🔁 Short Summary

ConfigService (default) → shared by all APIs

Same module or different module → still same instance

Request data → never store in singleton

Per-request logic → use request-scoped provider

# summary 
NestJS uses a DI container to register providers, builds a dependency graph at startup, creates instances by resolving dependencies recursively, caches them as singletons by default, and injects them where required. Request-scoped providers are created per request instead of being shared.

Questions:
✅ 1. What is a Provider in NestJS?

👉 A provider is any class or value that can be injected using DI (usually services).

@Injectable()
export class UserService {}

Registered in providers array

Managed by Nest’s DI container

✅ 2. What is Dependency Injection (DI)?

👉 DI means class does not create its own dependencies, Nest provides them.

Improves testability

Reduces tight coupling

Example:
Controller does not do new CatsService(), Nest injects it.

✅ 3. How does NestJS know what to inject?

👉 Using TypeScript metadata (reflection) from constructor types.

constructor(private catsService: CatsService) {}


Nest reads parameter type

Matches with provider token

✅ 4. What are Injection Tokens?

👉 Tokens are keys used to find providers in DI container.

Types:

Class name → CatsService

String → 'HTTP_OPTIONS'

Symbol

Used when:

Injecting config objects

Multiple implementations

✅ 5. What is the difference between useClass, useValue, useFactory?

👉 Different ways to define providers:

{ provide: A, useClass: B }     // replace class
{ provide: A, useValue: obj }  // fixed object
{ provide: A, useFactory: () => obj } // dynamic creation


Used for:

Mocks

External configs

Dynamic logic

✅ 6. What happens if provider is not in module?

👉 Nest throws:

Nest can't resolve dependencies…

Because:

Provider must be in same module

Or exported from another module

✅ 7. Singleton vs Request Scope?

Singleton (default) → one instance for whole app

Request scope → new instance per HTTP request

Request scope is slower, use only when needed

🎯 Final Tip for Interview

If asked “How DI works in NestJS?”, say:

Nest scans modules at bootstrap, registers providers in a DI container, builds a dependency graph, resolves dependencies using reflection metadata, creates instances recursively, caches them as singletons by default, and injects them into consumers.


export const ERROR_STATUS_CODE_MAP = 'ErrorStatusMap';

{
  provide: ERROR_STATUS_CODE_MAP,
  useFactory: () => {
    return Object.values(deploymentMap).reduce(..., new Map());
  },
}


✅ Meaning:

    Token: 'ErrorStatusMap'

    Value: a Map built at startup

    Built using deployment config

So Nest will:

    Call factory once at bootstrap

    Create Map

    Store it in DI container

    Reuse same Map everywhere (singleton)

    This is exactly same lifecycle as service — but lighter.

✅ 3. How It Gets Injected into Filter
@Inject(ERROR_STATUS_CODE_MAP)
private errorStatusMap: Map<unknown, number>


During app startup:

Nest creates ServiceToHttpExceptionFilter

Sees constructor parameter with @Inject('ErrorStatusMap')

Looks up provider with that token

Injects Map instance

So filter now has:

errorStatusMap = shared lookup table


✅ 4. How Error Handling Flow Works at Runtime

Because you registered:

{
  provide: APP_FILTER,
  useClass: ServiceToHttpExceptionFilter,
}


This makes it a GLOBAL exception filter.

So when any error happens:

🔥 Runtime Flow
Service throws error
→ Nest catches error
→ Finds global APP_FILTER
→ Calls ServiceToHttpExceptionFilter.catch()
→ Filter maps error → HTTP response
→ Response sent


Custom provider instance -> token 
service provider instance- >{ provide: MyService, useClass: MyService }
