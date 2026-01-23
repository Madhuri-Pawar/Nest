# Testing

🟡 Test Runtime

Command: npm run test

Flow:

Jest → loads *.spec.ts
     → Test.createTestingModule()
     → Builds mini Nest DI container
     → No server
     → Direct method calls

| Real App             | Tests                    |
| -------------------- | ------------------------ |
| NestFactory          | Test.createTestingModule |
| Real modules         | Fake test modules        |
| HTTP requests        | Direct method calls      |
| DB usually connected | DB usually mocked        |


# summary 
Jest does NOT run with app bootstrap.
Tests run only when you execute test commands, in a separate environment, with their own Nest testing container.

- Jest runs only when you run test commands:

npm run test
npm run test:watch
npm run test:e2e


Then flow is:

Jest starts Node process

Jest finds files like:

    *.spec.ts

    *.e2e-spec.ts

Jest executes test files

Inside test files → Nest Test Module is created

App code is imported but NOT bootstrapped

So:

Tests run in separate process, not during app runtime.

🟡 In Test Module

Test.createTestingModule()
Then:

Builds modules

NO HTTP server

You manually call methods

So tests are:

✔ fast
✔ isolated
✔ no network


🧩 Where Mocks Fit In

Instead of real service:

providers: [CatsService]


You can mock:

providers: [
  {
    provide: CatsService,
    useValue: { findAll: jest.fn() },
  },
]


Then Nest injects mock instead of real service.

🔥 Full Flow in One Line

When test runs:

Jest starts test file

Nest builds mini DI container

Providers are instantiated

Controller is created with injected service

You mock methods

You call controller function

Assertions run

No DB, no HTTP, no server.

🏗 Step-by-Step Flow

✅ Step 1: createTestingModule()
const moduleRef = await Test.createTestingModule({
  controllers: [CatsController],
  providers: [CatsService],
}).compile();


What happens internally:
1️⃣ Nest creates a Module Metadata

Just like:

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
class TestModule {}

But only in memory.

2️⃣ DI Container Is Built

Nest scans:

Controllers

Providers

and builds dependency graph:

CatsController → needs CatsService
CatsService → no deps

3️⃣ Providers Are Instantiated

Nest creates objects:

catsService = new CatsService()
catsController = new CatsController(catsService)


Exactly like runtime app startup.

4️⃣ compile() Finalizes Module

compile() means:

“Finish building module, resolve dependencies, make instances ready.”

Now moduleRef contains:

DI container

provider instances

controller instances

✅ Step 2: Getting Instances
catsService = moduleRef.get(CatsService);
catsController = moduleRef.get(CatsController);


This fetches the same instances that Nest created.

✅ Step 3: Mocking with jest.spyOn
jest.spyOn(catsService, 'findAll').mockImplementation(() => result);


Now:

Real method is replaced

Controller will receive fake data

✅ Step 4: Calling Controller Method
await catsController.findAll();