# MediMap 🏥📍

MediMap is a React-based web application that helps users discover **nearby hospitals** based on their current location or a manually entered address. It utilizes **OpenStreetMap Nominatim API** and browser **Geolocation API** to fetch and sort hospitals by distance using the **Haversine formula**.

## 🌐 Live Demo
🔗 [Visit Live App](https://tushar5687.github.io/Nearby-Hospital-Locator/)

---

## 🚀 Features

- 🔍 **Search Hospitals** by:
  - 📍 Current Location (Geolocation)
  - 🗺️ Custom Location Input (via Nominatim API)
- 📏 **Distance Calculation** (using latitude/longitude Haversine formula)
- 🧾 Display hospital:
  - Name
  - Address
  - Distance (in km)
  - "Book Appointment" button (UI only)
- 🧭 Clean card-based UI using **Tailwind CSS**
- 🔃 Loading spinner while fetching data

---

## 🛠️ Tech Stack

- **React** – SPA with component-based architecture
- **Tailwind CSS** – Styling and layout
- **OpenStreetMap (Nominatim API)** – Hospital and location data
- **Geolocation API** – Get user's live location
- **Custom Utilities** – Distance calculation via Haversine formula

---

## 📁 Project Structure

```bash
MediMap/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── LoadingSpinner.js
│   │   └── LoadingSpinner.css
│   │
│   ├── App.js
│   ├── App.css
│   ├── App.test.js
│   ├── index.js
│   ├── index.css
│   ├── logo.svg
│   └── reportWebVitals.js
│
├── .gitignore
├── LICENSE
├── README.md
├── package.json
└── package-lock.json
 
---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/Tushar5687/MediMap.git
cd MediMap

# 2. Install dependencies
npm install

# 3. Run the app locally
npm start





