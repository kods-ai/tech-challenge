# Technical Challenge — WhatsApp Conversational Agent (45 minutes)

## Exercise format

This is an interactive analysis and system-design interview. The repository contains reference material, not a runnable application.

You do **not** need to:

- Install dependencies or run the code.
- Modify or compile the code.
- Provide API keys or credentials.
- Connect to WhatsApp, an LLM provider, or any internal service.

The code is intentionally incomplete and exists only as input for discussion.
You will record your decisions in a short `DESIGN.md`; you will not implement the system.

## Context

Acme Shop is a multi-vendor marketplace. It has a WhatsApp customer-service agent that uses a language model and internal services to answer order questions and request cancellations.

The prototype worked during a demo, but the team now wants to take it to production. Expected conditions include:

- 100,000 conversations per day.
- Peaks of 100 messages per second.
- Several consecutive messages from the same user.
- Duplicate webhooks and provider retries.
- Sensitive operations spanning orders, payments, and inventory.

The company must prevent fabricated answers, incorrect cancellations or refunds, cross-tenant access, and unnecessary exposure of personal information. Internal services may fail or time out independently.

### Relevant cancellation rules

- The customer must have verified their identity within the conversation.
- The order must belong to the customer and must not have shipped.
- Explicit confirmation is required. It is valid for five minutes and tied to one specific order.
- A cancellation may require updating the order, initiating a refund, and releasing inventory.
- Retries must not duplicate refunds or inventory releases.
- Orders above USD 500 require human approval.
- The user must receive an honest response when the final outcome is still unknown.

## Objective

During 45 minutes, we will analyze the current system and design a production-ready evolution together. The interviewer will manage the schedule; you are not expected to cover every possible aspect.

We are interested in how you understand problems, prioritize risks, work with AI, and communicate technical decisions. Perfect syntax, polished diagrams, and a complete architecture are not expected.

One section requires an AI assistant supplied or approved by the company. It will be a clean session with no personal data or previous conversations. Only that interaction will be shared so that we can understand your working process. The AI assistant is used externally; it is not connected to this repository.

## Current system

```text
WhatsApp
   │ webhook
   ▼
Conversation Handler ───► LLM
   │                       │
   └───────────────────────┘
              │
              ▼
       Internal Services
  Orders · Payments · Inventory
```

The relevant code is available in [materials/current-system.ts](materials/current-system.ts).

## Activities

### 1. Diagnose the current system

Review the system and explain:

- How it works.
- Its most important risks.
- Which three problems you would address first, and why.

### 2. Design its production evolution

Design a production-ready system that can:

- Report an order's status.
- Cancel an order and coordinate its payment and inventory effects.
- Maintain a multi-message conversation.
- Hand the conversation over to a human when necessary.

Record the proposed design in `DESIGN.md`. You may use a diagram, pseudocode, or prose. Explain the most important decisions and trade-offs. Concise working notes are sufficient.

### 3. Work with AI

Use an AI assistant to help design the trust boundary and workflow for `cancel_order`. The result should address:

- Arguments the model may propose versus trusted context supplied by the backend.
- Input and output contracts.
- A state machine or equivalent workflow description.
- Retries, concurrency, and uncertain outcomes.
- Prioritized test cases.

The operation must account for:

- Verified customer identity.
- An existing order belonging to the customer and the correct tenant.
- A cancellable order state.
- Explicit user confirmation.
- Idempotent execution.
- Safe coordination across Orders, Payments, and Inventory.
- An audit trail and human approval based on order value.

A complete implementation is not required. Use the available time to obtain a concrete proposal and test it against at least this scenario:

> Payments completes the refund but times out before returning a response. The same WhatsApp message is then processed by another worker.

At the end, explain what you would accept, what you would change, and what you would verify before using the result.

The number or length of prompts is not evaluated. We evaluate how the assistant helps you make progress and how you validate its output.

### 4. Git submission

Before the interview ends, publish your work to a new public Git repository using Git from the command line. Do not submit a ZIP file or use a web-based file uploader.

The repository must contain only:

- This candidate brief.
- `materials/current-system.ts`.
- Your `DESIGN.md`.
- A short `AI_NOTES.md` describing what you asked the assistant, what you accepted or rejected, and why. Do not publish the full AI transcript.

Requirements:

- Initialize the repository and configure the remote yourself.
- Create at least two meaningful commits so the history shows the initial proposal and the revision after the scenario change.
- Use clear commit messages.
- Push the commits and confirm that the public repository is accessible.
- Do not commit API keys, access tokens, personal data, customer data, or unrelated files.

The company will provide a temporary public repository or temporary Git credentials when needed. You are never required to expose credentials or use a personal Git account during screen sharing.

## What is not evaluated

- Perfect syntax.
- Knowledge of Meta's specific API.
- Knowledge of specific cloud product names.
- Completing every possible aspect of the problem.
- Use of a specific drawing tool or creation of a polished diagram.
- Local setup, API integration, or typing speed.

You may ask questions throughout the interview. Make any necessary assumptions explicit.
