# Passport (authentication)
- Passport is the most popular node.js authentication library, well-known by the community and successfully used in many production applications.
- It's straightforward to integrate this library with a Nest application using the @nestjs/passport module. 

- At a high level, Passport executes a series of steps to:

    - Authenticate a user by verifying their "credentials" (such as username/password, JSON Web Token (JWT), or identity token from an Identity Provider)
    - Manage authenticated state (by issuing a portable token, such as a JWT, or creating an Express session)
    - Attach information about the authenticated user to the Request object for further use in route handlers
    - Passport has a rich ecosystem of strategies that implement various authentication mechanisms

- Passport provides a strategy called passport-local that implements a username/password authentication mechanism

$ npm install --save @nestjs/passport passport passport-local
$ npm install --save-dev @types/passport-local


# Built-in Passport Guards
✅ Two Authentication States in App

    ❌ Unauthenticated user

    ✅ Authenticated user

✅ Case 1: When User is NOT Logged In

We need to do two things:

🔹 A. Restrict Protected Routes

    Use JWT Guard

    Checks if request has valid JWT

If no token → deny access

👉 Example: JwtAuthGuard

🔹 B. Handle Login (Start Authentication)

User sends username + password to /auth/login

We must run Passport Local Strategy

How do we trigger strategy?
👉 Using AuthGuard('local')

This guard:

Reads credentials

Calls validate() in LocalStrategy

Attaches req.user

Then controller:

Generates JWT and returns it

👉 Example: LocalAuthGuard

✅ Case 2: When User IS Logged In

Client sends JWT in Authorization header

Use JwtAuthGuard

Guard validates token

Allows access to protected routes

✅ Types of Guards in Passport Flow
Purpose	Guard Used
Login (validate username/password)	AuthGuard('local')
Protect APIs after login	AuthGuard('jwt')

Both are Guards, but:

Local Guard → starts authentication

JWT Guard → checks existing authentication

✅ One-Line Senior Interview Answer

In NestJS with Passport, we use a LocalAuthGuard to initiate authentication during login and issue JWTs, and a JwtAuthGuard to protect routes and validate tokens for already authenticated users.

# Notes

🧠 Passport Strategies in NestJS — Quick Points
🔹 Overall Purpose of Passport

Passport is the authentication abstraction library Nest builds on.

It separates how a user is authenticated from when and where you enforce it.

- Nest integrates it via @nestjs/passport and @UseGuards().

🧩 1) Local Strategy (Username/Password Login)

What it is:

A strategy for validating credentials (username/password).

Uses passport-local under the hood.

- How it works:

    You create a class extending PassportStrategy(Strategy, 'local').

    Implement validate(username, password) to verify credentials via your service.

    If valid → return user object, else throw error.

- Why use a Guard?

    Using @UseGuards(AuthGuard('local')) on /auth/login triggers Passport’s local flow to extract creds and call validate().

    Login route isn’t protected yet — it initiates auth.

- Impact vs traditional validate:

    Traditional: you manually compare username/password and then issue token.

    Passport local: wraps this in a strategy + guard so validation logic lives in one place (SRP).

    You don’t have to parse credentials or manage errors in the controller — the guard does it.

🔑 2) JWT Strategy (Token-Based Validation)

- What it is:

    A strategy for verifying JSON Web Tokens on protected routes.   

    Uses passport-jwt.

How it works:

    Create JwtStrategy extending PassportStrategy(Strategy, 'jwt').

    Configure it to extract token (e.g., from Authorization header).

    Implement validate(payload) → returns user data that gets attached to req.user.

What the Guard does:

    @UseGuards(AuthGuard('jwt')) protects routes by:

    Extracting JWT

    Verifying signature & expiry

    Running validate()

    Attaching user info on success

    Throwing 401 on failure automatically.

Impact vs traditional validate:

    Traditional: you manually decode/verify token in each request.

    Passport JWT: you centralize token verification logic and reuse it across routes.

    No redundant parsing — Passport + Guard pipeline handles it for you.

🔄 Traditional Validate Methods vs Passport Strategies
Approach	                   Login Validate	          Token Check	                   Complexity
Manual (no Passport)	       Controller checks creds	  Each route validates token	        Lots of repetitive code
Passport-Local	               Encapsulated in strategy	      N/A	                               Controller clean
Passport-JWT	                 N/A	                    Encapsulated in strategy	              Guard reusable


🧠 Interplay Between Guards & Strategies
🔹 LocalAuthGuard

    Triggers passport-local strategy

    Handles credential extraction + validation

    Populates req.user on success

🔹 JwtAuthGuard

    Triggers passport-jwt strategy

    Validates token and attaches user

    Enforces authentication on protected routes

Important Distinction:

    Local auth doesn’t protect routes — it implements authentication.

    JWT auth protects routes — it checks authentication.

🎯 Short Senior Interview Notes

Passport local strategy is used to handle initial authentication (login), cleanly abstracting credential logic via validate().

Passport JWT strategy is used to protect routes with token validation, verifying signature and expiry before allowing access.

Guards are what tie strategies to routes; they determine if a request is allowed or rejected before reaching your controller.

This pattern removes duplicated validation code and leverages a consistent, centralized pipeline for auth checks.