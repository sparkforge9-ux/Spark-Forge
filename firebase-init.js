// Single source of truth for Firebase config.
// Every page (dashboard.html, login.html) imports `app` from here instead of
// redeclaring firebaseConfig — one place to update if the project changes.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyAWsIbARFoFaXwjgKGnjMyLWcwuEwOcWhs",
    authDomain: "spark-forge-24546.firebaseapp.com",
    projectId: "spark-forge-24546",
    storageBucket: "spark-forge-24546.firebasestorage.app",
    messagingSenderId: "1067170553726",
    appId: "1:1067170553726:web:b46f86de4fd43be8e69d2f",
    measurementId: "G-RY0ZPNQNR6"
};

export const app = initializeApp(firebaseConfig);

// Analytics needs a browser environment with cookies/storage available —
// isSupported() avoids the hard throw that happened in the original file
// whenever it ran under strict privacy settings or in an iframe.
isSupported().then((ok) => { if (ok) getAnalytics(app); });
