  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const captureBtn = document.getElementById('captureBtn');
  const submitBtn = document.getElementById('submitBtn');
  const locationInput = document.getElementById('location');
  const descriptionInput = document.querySelector('textarea');
// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyB49wyl8o802jaCJE2uNa9rXVAiT_pWs6w",
  authDomain: "lakwin-a2d36.firebaseapp.com",
  projectId: "lakwin-a2d36",
  storageBucket: "lakwin-a2d36.appspot.com",
  messagingSenderId: "372739001174",
  appId: "1:372739001174:web:706c1a4e6d5597d908e4f7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

  let capturedImageData = "";

  navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: "environment" } },
    audio: false
  })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Error accessing camera:", err);
  });

  captureBtn.addEventListener('click', () => {
    canvas.style.display = "block";
    video.style.display = "none";
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImageData = canvas.toDataURL("image/png");
  });

  // Auto-fill location
  window.onload = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          locationInput.value = `${lat}, ${lon}`;
        },
        (error) => {
          console.warn("Location access denied or failed.", error);
          locationInput.placeholder = "Enter location manually";
        }
      );
    } else {
      locationInput.placeholder = "Geolocation not supported";
    }
  };

  submitBtn.addEventListener('click', async () => {
    if (!capturedImageData) {
      alert("Please capture an image first.");
      return;
    }

    console.log("hello");
    const description = descriptionInput.value;
    const location = locationInput.value;

    if (!description || !location) {
      alert("Please fill all fields.");
      return;
    }

    // Convert base64 image to blob
    const response = await fetch(capturedImageData);
    const blob = await response.blob();
    const imageName = "issue_" + Date.now();

    // Upload to Firebase Storage
    const storageRef = firebase.storage().ref().child("issues/" + imageName);
    const snapshot = await storageRef.put(blob);
    const imageURL = await snapshot.ref.getDownloadURL();

    // Save to Firestore
    await firebase.firestore().collection("issues").add({
      imageURL,
      description,
      location,
      status: "Submitted",
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Issue submitted successfully!");
    // Reset UI
    canvas.style.display = "none";
    video.style.display = "block";
    descriptionInput.value = "";
    capturedImageData = "";
  });
