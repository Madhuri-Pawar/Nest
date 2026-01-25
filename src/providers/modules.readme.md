# Modules
A module is a class that is annotated with the @Module() decorator. This decorator provides metadata that Nest uses to organize and manage the application structure efficiently.

- Every Nest application has at least one module, the root module
- which serves as the starting point for Nest to build the application graph.
- This graph is an internal structure that Nest uses to resolve relationships and dependencies between modules and providers.
- Modules are highly recommended as an effective way to organize your components.
- 
# Feature modules
- A feature module organizes code that is relevant to a specific feature, helping to maintain clear boundaries and better organization
- This is particularly important as the application or team grows, and it aligns with the SOLID principles.

# Shared modules#
In Nest, modules are singletons by default, and thus you can share the same instance of any provider between multiple modules effortlessly.

- Every module is automatically a shared module. Once created it can be reused by any module. 
- Let's imagine that we want to share an instance of the CatsService between several other modules. 
- In order to do that, we first need to export the CatsService provider by adding it to the module's exports array, as shown below:

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}


Now any module that imports the CatsModule has access to the CatsService and will share the same instance with all other modules that import it as well.

Imp 
- module who having provider instance & if that module provider or whole module shared then that same instance can be used in shared
- If we were to directly register the CatsService in every module that requires it,
- but it would result in each module getting its own separate instance of the CatsService
- This can lead to increased memory usage since multiple instances of the same service are created,

Inshort 
- optimize same service multiple instances by sharing same provider instance 
- if in each module import service it makes created separate instance for same service (Con)

Adv
- By encapsulating the CatsService inside a module, such as the CatsModule, and exporting it, we ensure that the same instance of CatsService is reused across all modules that import CatsModule


# DI in module
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}

However, module classes themselves cannot be injected as providers due to circular dependency .

# Global modules
- If you have to import the same set of modules everywhere, it can get tedious.
- with help of @Global() we can make availble these module over app & no need to import into another module , it direct accessible 

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}

The @Global() decorator makes the module global-scoped. 
Global modules should be registered only once,
==================================================

# Dynamic Module
- A module that is configured at runtime, not fixed at compile time

Used when:
    config depends on env / user input / options
    Same module used with different configs

✅ How Dynamic Module Works (Steps)

🔹 1. Create static factory method
    @Module({})
    export class DbModule {
    static register(options: DbOptions): DynamicModule {
        return {
        module: DbModule,
        providers: [{ provide: 'DB_OPTIONS', useValue: options }],
        exports: ['DB_OPTIONS'],
        };
    }
    }
👉 register() returns module definition.

🔹 2. Import with Config
    @Module({
    imports: [DbModule.register({ host: 'localhost' })],
    })
    export class AppModule {}

👉 Now module is created with given options.

🔹 3. Inject Config Inside Providers
    @Injectable()
    export class DbService {
    constructor(@Inject('DB_OPTIONS') private opts: DbOptions) {}
    }

👉 Each import can have different config.

✅ Why We Need Dynamic Modules?

Configure libraries (DB, Redis, Kafka, HTTP)

Reuse same module with different settings

Avoid hardcoding values

Examples:

TypeOrmModule.forRoot()

JwtModule.register()

🧠 Memory Trick for Interview

Static module → fixed providers

Dynamic module → providers + config decided at import time

🎯 One-Line Interview Answer

Dynamic modules allow passing runtime configuration to a module using a static factory method that returns a DynamicModule object, enabling flexible and reusable module setup.
=============================================

✅ 1. What is a Module in NestJS?
✅ 2. Why do we need exports in modules?
✅ 3. Difference: Controller vs Service vs Module

✅ 4. What is a Global Module?
@Global()
@Module({ providers: [ConfigService], exports: [ConfigService] })
👉 Providers are available everywhere without importing module

Use for config, logging, DB
Don’t overuse → hurts clarity

✅ 6. What is Feature Module vs Root Module?

AppModule (Root) → starts application

Feature Modules → domain-specific (User, Payment, Order)

Keeps code:

Scalable

Maintainable

# summary
NestJS follows modular architecture where modules group controllers and providers, controllers handle requests, services contain business logic, and the DI container manages provider lifecycles and dependency resolution.


