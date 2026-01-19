✅ What Is Lazy Loading in NestJS?

By default, Nest eagerly loads all modules at app startup.

Lazy loading means modules are loaded only when needed instead of on bootstrap.

Don’t confuse it with Angular lazy loading — Nest’s lazy loading is just dynamic on-demand module initialization, not route splitting.

✅ How to Lazy Load a Module
1. Import and use LazyModuleLoader
constructor(private lazyModuleLoader: LazyModuleLoader) {}

2. Load a module dynamically
const { LazyModule } = await import('./lazy.module');
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);


load() returns a module ref that can give you providers via moduleRef.get(...)

Once loaded, it’s cached — later loads are fast.

✅ What Lazy Loading Does (and Doesn’t)

✔ Loads providers on demand
✔ Reduces cold-start time (e.g., in serverless functions)
✔ Keeps module graph shared — lazy modules integrate into the DI graph

❌ Does not let you register controllers, routes, or middleware dynamically after bootstrap — the HTTP server (e.g., Fastify) won’t pick up new routes at runtime.
❌ Lifecycle hooks (e.g., onModuleInit) don’t run for lazy modules.

✅ Common Scenarios to Use Lazy Loading
🌀 Serverless & Cold Starts

Functions (AWS Lambda, Cloud Run) that need minimal startup time

Load only the module required for that invocation, keep heavy logic deferred.

🛠 Worker / Cron / Event Processors

A worker that processes multiple task types (jobs, events, webhooks)

Load only the module relevant to this particular job request.

⚠ NOT Useful For

Simple monoliths where startup latency isn’t a concern

Controllers, resolvers, middleware — these can’t be registered lazily in Nest.

✅ What Happens Internally

Lazy modules are cached after first load → subsequent loads are fast.

They become part of the existing module dependency graph and can share providers.

✅ Pros & Cons (Senior Notes)
✨ Pros

🚀 Faster startup for serverless environments

💡 Only initialize heavy dependencies when truly needed

🧠 Good for conditional workflows

⚠ Cons

🚦 Controllers/routes in lazy modules won’t work if loaded after app bootstrap

🔧 Lifecycle hooks won’t run

📦 Adds complexity — not always worth it in monolithic apps

🧠 Interview-Friendly Summary

In NestJS, lazy loading uses LazyModuleLoader to dynamically import and initialize modules at runtime, reducing initial startup cost — especially useful for serverless and worker scenarios. Controllers, middleware, and transport subscriptions cannot be dynamically registered this way, and lazy modules don’t run lifecycle hooks.