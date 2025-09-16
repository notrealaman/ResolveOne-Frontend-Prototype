// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyDVr8m9f4Qj1vK-YS7d3e-0hHi32CEPWN8",
    authDomain: "prototype-resolveone.firebaseapp.com",
    projectId: "prototype-resolveone",
    storageBucket: "prototype-resolveone.firebasestorage.app",
    messagingSenderId: "154209863170",
    appId: "1:154209863170:web:c46ae5e9bc40d974e0891b",
    measurementId: "G-PVPR6YFYDC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
