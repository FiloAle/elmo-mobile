# Elmo - Collaborative Navigation App 🚗✨

The mobile companion application for the **Elmo** ecosystem, designed to transform in-car navigation from a solitary task into a shared, collaborative experience.

## 📖 Overview
This application acts as the primary controller for passengers, allowing them to plan trips, manage the route, and interact with the vehicle's dashboard in real-time without distracting the driver.

## ✨ Key Features
* [cite_start]**Collaborative Planning:** Organize group trips, set pick-up points, and sync routes with friends before the journey begins[cite: 398].
* [cite_start]**Real-Time Sync:** Seamless bidirectional synchronization with the in-car main dashboard (iPad)[cite: 147].
* [cite_start]**Smart POI Search:** Utilize OpenStreetMap APIs to find nearby points of interest and add intermediate stops on the fly[cite: 141].
* [cite_start]**Expense Tracking:** Automated breakdown of trip costs (gas, tolls, parking) for the group[cite: 466].
* **AI Assistant:** Natural language interaction powered by Llama (via Groq API) for contextual suggestions.

## 🛠️ Tech Stack
* [cite_start]**Framework:** React Native (Expo)[cite: 141].
* **Mapping:** OpenStreetMap API.
* **LLM:** Llama (via Groq API).
* [cite_start]**Backend & Sync:** Node.js local server with WebSocket for multi-device state management[cite: 142].

## 🚀 Getting Started
1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Add your API keys (Groq, OSM) in the `.env` file.
4.  Start the app: `npx expo start`.

---
*Developed for the "Mobility Futures" exhibition at Politecnico di Milano (2026).*
