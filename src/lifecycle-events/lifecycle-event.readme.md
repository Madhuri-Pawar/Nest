# Example: DB Connection Service

@Injectable()
export class DbService
  implements OnModuleInit, OnApplicationBootstrap, BeforeApplicationShutdown
{
  constructor() {
    console.log('constructor');
  }

  async onModuleInit() {
    console.log('onModuleInit: connect to DB pool');
  }

  async onApplicationBootstrap() {
    console.log('onApplicationBootstrap: app fully started');
  }

  async beforeApplicationShutdown() {
    console.log('beforeApplicationShutdown: close DB pool');
  }
}

Output on startup:
constructor
onModuleInit: connect to DB pool
onApplicationBootstrap: app fully started


On shutdown:

beforeApplicationShutdown: close DB pool
=====================================================


✅ What Are Lifecycle Events in NestJS?

They are special methods that Nest calls automatically at different stages of:

    app startup

    module initialization

    app shutdown

Used for:

    DB connections

    loading cache

    starting consumers

    graceful shutdown

🔄 Lifecycle Order (Simplified)
🟢 App Startup
constructor()
↓
onModuleInit()
↓
onApplicationBootstrap()

🔴 App Shutdown
beforeApplicationShutdown()


✅ Real Production Scenarios
✔ onModuleInit

    Validate env config

    Setup module-level cache

    Warm repositories

✔ onApplicationBootstrap

    Start cron jobs

    Start Kafka consumers

    Start polling jobs

✔ beforeApplicationShutdown

    Close DB connections

    Flush logs

    Graceful worker shutdown


✅ Who Can Implement OnModuleInit?

👉 Any class that is a provider can implement it:

✅ Services (@Injectable())

✅ Guards

✅ Interceptors

✅ Pipes

✅ Custom providers

⚠️ Controllers (technically yes, but not best practice)

Because Nest creates all of these through the DI container.


✅ Best Practice — Where to Use It?
🥇 BEST: Services
✅ Use when:

DB connection setup

Load config into memory

Init SDKs (AWS, Firebase, Kafka)

Prepare caches

@Injectable()
export class KafkaService implements OnModuleInit {
  async onModuleInit() {
    await this.connect();
  }
}


👉 Reason:
Services are singleton, app-level logic → perfect for lifecycle hooks.


🥈 Guards / Interceptors (Only if needed)
Example use cases:

Load role-permission map once

Preload rules

Setup metrics

@Injectable()
export class RolesGuard implements CanActivate, OnModuleInit {
  private rules;

  onModuleInit() {
    this.rules = loadRulesFromDB();
  }
}


⚠️ But still better to move heavy logic into a service and inject it.


✅ Difference from Request Lifecycle

Very important interview line:

Lifecycle hooks run once at app startup, not per request.

Guards, pipes, interceptors normally run per request,
but onModuleInit() runs only once when provider is created.


🧠 Quick Decision Table
Component	           Use OnModuleInit?	             Why
Service	               ✅ Yes (best)	                  App-level logic
Guard	               ⚠️ Sometimes	                  Load rules once
Interceptor	           ⚠️ Rare	                        Setup metrics
Controller	           ❌ Avoid	                    Should stay thin
Middleware	           ❌ No                     	No lifecycle hooks


