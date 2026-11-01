import { auth } from "./firebase.js";

import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/fireabse-auth.js";

const loginForm = document.getElementById("admingLoginForm");
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
  } else {
    loginSection.hidden = false;
    dashboardSection.hidden = true;
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginButton.disabled = true;
  loginMessage.textContent = "Signing in...";
  
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    loginMessage.textContent = "";
    loginForm.reset();
  } catch (error) {
    console.error("Adming sign-in failed:", error);

    loginMessage.textContent = "Sign-in failed. Check your credentials and try again.";
  }

  loginButton.disabled = false;
});

logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out failed:", error);
  }
});
