# Configuration

✅ 1) Purpose of Configuration Module

The @nestjs/config module:

✔ Loads configuration from files / env
✔ Centralizes config access
✔ Prevents hard-coding secrets
✔ Enables type safety & schema validation

It’s critical for 12-factor apps.


✅ 2) How Configuration Is Loaded
🚀 Environment Files

Nest reads from .env in project root by default.

Example:

PORT=3000
DATABASE_URL=postgres://...
JWT_SECRET=secretkey


With:

ConfigModule.forRoot({
  isGlobal: true,
});


✔ automatically loads .env
✔ process.env is populated
✔ ConfigService is injectable everywhere


🧠 What Happens Internally?

ConfigModule loads .env before other modules

Values are available via ConfigService

You access config via config.get('KEY')

No need to import .env manually.

✅ 5) Multi-Environment (Dev vs Prod)
Best Practice
.env.development
.env.test
.env.production


Load environment-specific file:

ConfigModule.forRoot({
  envFilePath: `.env.${process.env.NODE_ENV}`,
});


Then set:

export NODE_ENV=production


before deploy.

✔ Why Use ConfigService Not process.env?
Reason	           Explanation
Testable	        You can mock config
Injectable	     Use DI like any provider
Validated	       With schema
Grouped	          Supports structured configs

✅ 8) Using YAML Instead of Env

You can define config in YAML:

# config/app.yaml
db:
  host: localhost


Load with:

ConfigModule.forRoot({
  load: [() => yaml.load(fs.readFileSync('config/app.yaml', 'utf8'))],
});


✔ more structured than env
✔ good for config that doesn’t change per environment

⚠ But still read secrets from env ideally.


❤️ Production vs Dev Configuration Flow
Environment	            Where config is stored	          Load order
Local Dev	            .env.development	           ConfigModule
Test	                .env.test	                      ConfigModule
Production	             Secrets Manager / CI/CD env	    ConfigModule
Docker	                ENV from Dockerfile	              ConfigModule

Steps:
✅ config/config.dev.yaml
✅ Recommended File Structure
config/
 ├── config.dev.yaml
 ├── config.prod.yaml
 └── config.test.yaml
 ✅ How to Load YAML in NestJS
 
1️⃣ Install packages
  npm install js-yaml

2️⃣ YAML Loader (check file yaml.loader.ts)

3️⃣ ConfigModule Setup (main module)
ConfigModule.forRoot({
  isGlobal: true,
  load: [loadYamlConfig],
});

✅ How to Access Config Anywhere
constructor(private config: ConfigService) {}

const dbHost = this.config.get<string>('database.host');
const bucket = this.config.get<string>('aws.s3.bucket');
const jwtSecret = this.config.get<string>('auth.jwt.accessSecret');


✅ Best Practice Strategy (Senior Level)
Config Type                  	         Where
Structure (ports, urls, flags)	          YAML
Secrets (passwords, keys)	            ENV / Secrets Manager
Overrides per env	                 config.dev.yaml / config.prod.yaml
Validation	                         Joi schema

🎯 Interview Answer (Short)

“I use YAML for centralized structured config and environment variables for secrets. Nest’s ConfigModule loads YAML per environment. I validate config on startup and inject via ConfigService instead of using process.env directly. In production, secrets come from secure stores like AWS Secrets Manager or Kubernetes secrets.”

