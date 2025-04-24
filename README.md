# 🧠 Group Activity Recommender

A web app that lets friends form groups, enter their interests and availability in free-form text, and get AI-generated activity suggestions using Perplexity API.

---

## 🚀 High-Level Architecture

### 🖼️ Frontend
- **React** with **Tailwind CSS** or **Material UI** for modern UI

### 🔧 Backend
- **Node.js + Express** or **Python + FastAPI**

### 🗃️ Database
- **Firebase Firestore** or **MongoDB**  
  (Flexible NoSQL structure supports varied user input)

### 🔐 Authentication
- **Firebase Auth** or **Auth0**
- Supports Google sign-in or email/password

### 🤖 LLM Recommendation API
- **Perplexity API**  
  Used to suggest common activities based on users’ natural language inputs

---

## ⚙️ Core Features and Flow

### 1. 🧾 User Authentication
- Sign in with Google or email/password
- Store basic user info (UID, name, email) in the database

### 2. 👥 Group Flow
- Users can **create** or **join** a group
- Groups identified by a unique code (UUID or 6-digit code)

### 3. 🗨️ Interest Input
- Free-form text input:  
  _"I love Italian food and hiking, free Tue/Thu 6–9PM"_
- Stored per user under `groups/{groupID}/preferences/{userID}`

### 4. 🧠 LLM Integration
- Once 2+ users submit their preferences:
  - Send a prompt to Perplexity API:
    ```
    Suggest a common activity for these users:
    User 1: Italian food, hiking, Tue/Thu 6–9PM
    User 2: Sushi, movies, Wed/Thu evenings
    ```

### 5. 🧭 Recommendation Display
- Display suggested activity with helpful links  
  (e.g., Google Maps location or YouTube trailer)

---

## 🛠️ Step-by-Step Implementation Guide

### Step 1: Project Setup
- Initialize monorepo or separate frontend/backend folders
- Set up Firebase or MongoDB

### Step 2: Authentication
- Implement Firebase Auth (Google or email/password)
- Store user info in DB on login

### Step 3: Group Logic
- **Create group**: generate UUID, store creator's user ID
- **Join group**: validate group code, add user to members list

### Step 4: Interest Input
- Input field with placeholder:
  _"Mention your interests, food preferences, and availability..."_
- Store text in database

### Step 5: Trigger Matching
- When 2+ users submit:
  - Backend aggregates text
  - Query Perplexity API with combined preferences
  - Parse and display the recommendation

### Step 6: Frontend UI
**Pages:**
- `Home`: Login / Signup
- `Dashboard`: Create or join a group
- `Group Page`: Submit interests, view group info, see suggestions

**Components:**
- `InterestForm`
- `GroupInfo`
- `RecommendationDisplay`
- Map view (optional) with activity location

---

## ✨ Optional Enhancements

- Use structured form inputs instead of free text
- Integrate with calendar APIs to match availability
- Display compatibility scores between users
- Use embeddings to semantically match user preferences

---

## 📦 Tech Stack Summary

| Layer       | Tech Choices                      |
|-------------|-----------------------------------|
| Frontend    | React, Tailwind CSS / MUI         |
| Backend     | Node.js + Express / Python + FastAPI |
| Auth        | Firebase Auth / Auth0             |
| Database    | Firebase Firestore / MongoDB      |
| AI API      | Perplexity API                    |

---
