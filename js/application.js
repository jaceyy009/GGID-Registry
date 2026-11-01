import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const form = document.getElementById("applicationForm");
const submitButton = document.getElementById("submitButton");
const message = document.getElementById("applicationMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  submitButton.disabled = true;
  message.textContent = "Submitting application...";

  const application = {
    applicantName: document.getElementById("applicantName").value.trim(),
    developerName: document.getElementById("developerName").value.trim(),
    email: document.getElementById("email").value.trim(),
    website: document.getElementById("website").value.trim(),
    reason: document.getElementById("reason").value.trim(),
    status: "pending",
    submittedAt: serverTimestamp()
  }

  try {
    await addDoc (
      collection(db, "applications"),
      application
    );

    message.textContent = "Your application has been submitted successfully.";

    form.reset();
  } catch (error) {
    console.error("Application submission failed:", error);

    message.textContent = "We couldn't submit your application. Please try again.";
  }

  submitButton.disabled = false;
});
