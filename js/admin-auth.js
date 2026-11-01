import { auth } from "./firebase.js";

import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/fireabse-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const loginForm = document.getElementById("admingLoginForm");
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");

async function checkAdmin(user) {
  const adminRef = doc(db, "admins", user.uid);
  const adminSnapshot = await getDoc(adminRef);

  return adminSnapshot.exists() && adminSnapshot.data().role === "admin";
}

onAuthStateChanged(auth, async (user) => {
  dashboardSection.hidden = true;
  
  if (!user) {
    loginSection.hidden = false;
    return;
  }

  loginSection.hidden = true;
  loginMessage.textContent = "Verifying administrator access...";

  try {
    const isAdministrator = await checkAdmin(user);

    if (isAdministrator) {
      dashboardSection.hidden = false;
      loginSection.hidden = true;
      loginMessage.textContent = "";
    } else {
      await signOut(auth);
      loginSection.hidden = false;
      loginSection.textContent = "Access denied. This account is not an administrator.";
    }
  } catch (error) {
    console.error("Administrator verification failed:", error);

    await signOut(auth);

    loginSection.hidden = false;
    loginMessage.textContent = "Unable to verify administrator access.";
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
    loginForm.reset();
    
  } catch (error) {
    console.error("Sign-in failed:", error);

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
