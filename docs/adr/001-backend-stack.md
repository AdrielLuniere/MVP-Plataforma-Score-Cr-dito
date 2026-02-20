# ADR 001: Backend Stack Selection

## Status

Accepted

## Context

We need to build a scalable, secure, and maintainable backend for the European Credit Score Platform. The system requires strong data consistency (credit scores are financial data), type safety for maintainability, and a clear path to modularity (modular monolith first, microservices later).

## Decision

We have decided to use the following stack:

1.  **Runtime**: Node.js (LTS)
2.  **Language**: TypeScript
3.  **Framework**: Express.js
4.  **Database**: PostgreSQL
5.  **ORM**: Prisma

## Consequences

### Positive

- **Type Safety**: TypeScript ensures fewer runtime errors and better developer tooling.
- **Ecosystem**: Node.js/Express has a massive ecosystem of libraries for fintech (security, encryption, validation).
- **Data Integrity**: PostgreSQL is the gold standard for relational financial data.
- **Productivity**: Prisma offers an excellent developer experience with type-safe queries and automatic migrations.
- **Hiring**: Large pool of developers familiar with this stack.

### Negative

- **Boilerplate**: Express requires manual setup for architecture (unlike NestJS), but this gives us flexibility.
- **Performance**: While performant, Node.js single-threaded nature requires careful handling of CPU-intensive tasks (scoring algorithm), which we will offload to worker threads or separate services if needed.
