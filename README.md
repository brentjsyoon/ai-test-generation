# AI-Enhanced Playwright Test Automation Framework

**Author:** Brent Yoon  
**Date:** March 6, 2026  

---

# Overview

https://github.com/user-attachments/assets/fe8762ab-b055-47be-b21a-ef6a74a175aa

This project is an **AI-enhanced Playwright test automation framework** built to test the **Zero Bank demo banking application**.

The framework combines **modern automation practices** with **AI-driven testing techniques** to improve:

- test coverage
- automation resilience
- security testing
- edge-case discovery

Application under test:

http://zero.webappsecurity.com/

---

# Key Capabilities

### Standard Automation
- Playwright test runner
- Page Object Model architecture
- Custom fixtures
- HTML reports
- Video recordings on failure
- Screenshot capture

### AI Augmented Testing
- AI generated edge cases
- automatic form schema extraction
- dynamic test execution
- AI locator self-healing
- automated anomaly detection

---

# Technologies

- **Playwright**
- **TypeScript**
- **Node.js**
- **OpenAI API**
- **HTML test reporting**

---

# Page Object Model

The framework uses the **Page Object Model (POM)** to keep automation maintainable.

Each page of the application is represented as a class.

Pages implemented:

- HomePage
- LoginPage
- OnlineBankingPage
- FeedbackPage
- PayBillsPage

---

# AI Integration

The most important feature of this framework is the **AI-driven testing layer**.

AI is used to:

- generate edge cases
- analyze form validation
- self-heal broken locators
- discover unexpected behaviors

## AI Feature 1: Form Schema Extraction

Before generating tests, the framework automatically analyzes the form structure.

It extracts:

- field id
- field name
- label
- input type
- required validation
- max length
- regex patterns

## AI Feature 2: Edge Case Generation

The AI system generates high-risk test cases automatically.

The model is instructed to produce cases targeting:

- validation bypass
- injection attacks
- boundary violations
- business logic flaws

Example generated test case:

```json
{
  "testName": "SQL injection attempt",
  "inputs": {
    "np_new_payee_name": "' OR 1=1 --",
    "np_new_payee_address": "Test Address",
    "np_new_payee_account": "12345"
  },
  "expected": "validation_error"
}
```

## AI Feature 3: Edge Case Execution Engine

The framework dynamically executes generated cases.

Process:

Extract Form Schema
        ↓
Generate Edge Cases (AI)
        ↓
Execute Test Inputs
        ↓
Compare Expected vs Actual
        ↓
Report Unexpected Behaviors

## AI Feature 4: Locator Self-Healing

UI updates often break automation because locators change.

The framework includes a self-healing locator system.

Workflow:

Locator fails
     ↓
Capture HTML context
     ↓
Send to AI model
     ↓
Receive alternative locators
     ↓
Attempt new locator automatically

Example AI locator suggestions:

```json
{
  "locators": [
    { "type": "css", "value": "button.primary" },
    { "type": "role", "value": "button", "name": "Submit" },
    { "type": "text", "value": "Submit" }
  ]
}
```
