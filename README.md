# HangSmart

**HangSmart** is an intelligent social planning app that brings friends with diverse interests, schedules, and accessibility needs together by recommending common activities everyone can enjoy.

## 🚀 Features

- **AI-Powered Recommendations:** Automatically matches activities to diverse group preferences.
- **Inclusive Accessibility:** Supports special needs like wheelchair accessibility and audio captioning.
- **Group Scheduling:** Coordinates friends' availability seamlessly.
- **Location Integration:** Suggests accessible venues using Google Maps and Google Places APIs.
- **Real-Time Collaboration:** Instantly updates group members via real-time data synchronization.

## 🛠 Tech Stack

- **Frontend:** React, JavaScript
- **Backend:** Firebase (Authentication, Real-time Database)
- **AI Integration:** Perplexity API (Recommendation Engine)
- **Location APIs:** Google Maps, Google Places

## 📦 Installation

### Prerequisites
- Node.js v16 or later
- Firebase account & configuration
- API keys for Perplexity, Google Maps, and Google Places

### Setup

Clone the repository:
```bash
git clone https://github.com/yourusername/hangsmart.git
cd hangsmart
```

Install dependencies:
```bash
npm install
```

Set up environment variables by creating a `.env` file in your root directory:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

REACT_APP_PERPLEXITY_API_KEY=your_perplexity_api_key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Start the development server:
```bash
npm start
```

## 🤖 How it Works
HangSmart collects user preferences, schedules, and accessibility needs, utilizing AI to find common activities suitable for everyone. Recommendations are displayed interactively, with locations and details mapped clearly via Google Maps.

## 🎯 Challenges Solved

- Integrating multiple APIs for accurate, inclusive recommendations.
- Real-time synchronization of complex group data.
- Designing user interfaces to intuitively support diverse accessibility requirements.

## ✅ Future Improvements

- Real-time event ticket bookings
- Enhanced machine-learning-driven personalization
- Continuous accessibility enhancements based on user feedback

## 👥 Contributors

- [Muqueet](https://github.com/mmc03-ucb)
- [Farhan](https://github.com/farhan-2202)

---