✅ END-TO-END FLOW: MIGRATION DURING APP STARTUP
🟢 STEP 1 — App Boot Starts
main.ts → NestFactory.create(AppModule)


Nest starts building the application

No providers created yet

🟢 STEP 2 — Modules Are Loaded
imports → dynamic modules → providers registered


Dynamic module registers a factory provider

Provider token = MIGRATION_PROVIDER_TOKEN

So Nest now knows:

To create migration service, call this factory.

🟢 STEP 3 — Factory Provider Executes

When DI container resolves providers:

useFactory(datasource, config) → new DBMigrationService(...)


Now:

constructor() runs

env flags read:

MIGRATION_UP_MODE

MIGRATION_DOWN_MODE

SYNC_DB

⚠️ No DB work yet, only setup.

🟢 STEP 4 — onModuleInit() Runs (MAIN WORK)

After all providers in that module are created:

onModuleInit()
  → runMigrations()
     → init migration datasource
     → load migration files
     → execute up/down migrations


🔥 This is where:

DB schema updates

tables created

data migrated

And this happens:

BEFORE server starts

🟢 STEP 5 — onApplicationBootstrap() Runs (FINAL DECISION)

After ALL modules in the app are initialized:

onApplicationBootstrap()
  → if migration mode
        process.exit()


Used for:

CI/CD migration job

Init containers in Kubernetes

So app:

❌ exits if only migration needed

✅ continues if normal API mode

🟢 STEP 6 — Server Starts (If Not Exited)
app.listen()


Now only:

controllers

APIs

requests

Migrations never run again.

🔴 SHUTDOWN FLOW (If Exit or Kill)

If app is killed or exits:

SIGTERM or process.exit()
  → (optional) beforeApplicationShutdown()
  → process ends


But since process.exit() is used:

graceful shutdown hooks may NOT run

intentional for migration jobs

🎯 WHY LIFECYCLE EVENTS ARE USED
Hook	Why Used
constructor	read config, store flags
onModuleInit	DB is ready → run migrations
onApplicationBootstrap	decide whether to exit app

This ensures:

✅ migration runs once
✅ before any request
✅ after all providers ready

🧠 ONE-LINE INTERVIEW ANSWER

Migrations are executed during application bootstrap using onModuleInit, ensuring the database is ready before serving traffic. After all modules are initialized, onApplicationBootstrap checks migration mode and optionally terminates the app, which is useful for CI/CD or init-container based migration jobs.