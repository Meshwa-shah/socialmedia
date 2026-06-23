/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey:
    "AIzaSyArD6oqs-dY7Opzm23U7Fc8N3_gEv5HCvA",
  authDomain:
    "familygram-c77d9.firebaseapp.com",
  projectId:
    "familygram-c77d9",
  storageBucket:
    "familygram-c77d9.firebasestorage.app",
  messagingSenderId:
    "562517753727",
  appId:
    "1:562517753727:web:0ab4cfe44d43e86ed0644a",
  measurementId:
    "G-FGLLM7QT43"
});

const messaging =
  firebase.messaging();