// Select elements
const form = document.getElementById("formContainer");
const signUpBtn = document.querySelector("#btnDiv button");

const emailInput = document.getElementById("mobile");
const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username");
const fullNameInput = document.getElementById("fullName");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const usernameError = document.getElementById("usernameError");

// ============ Helper: hide all errors initially =============
function hideErrors() {
  emailError.classList.remove("active");
  passwordError.classList.remove("active");
  usernameError.classList.remove("active");

  emailError.textContent = "";
  passwordError.textContent = "";
  usernameError.textContent = "";
}

// ============ Validation functions (return true/false) ============
function validateEmail() {
  const value = emailInput.value.trim();
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const phonePattern = /^\d{10,15}$/;

  if (!value) {
    emailError.textContent = "Enter your email or mobile number.";
    return false;
  } else if (!emailPattern.test(value) && !phonePattern.test(value)) {
    emailError.textContent = "Enter a valid email or mobile number.";
    return false;
  }
  return true;
}

function validatePassword() {
  const value = passwordInput.value;
  if (!value) {
    passwordError.textContent = "Enter a password.";
    return false;
  } else if (value.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters.";
    return false;
  }
  return true;
}

function validateUsername() {
  const value = usernameInput.value.trim();
  if (!value) {
    usernameError.textContent = "Enter a username.";
    return false;
  } else if (value.length < 3) {
    usernameError.textContent = "Username must be at least 3 characters.";
    return false;
  }
  return true;
}

// ========= Enable/disable button (only checks filled inputs, not errors yet) =========
function updateButtonState() {
  if (
    emailInput.value &&
    passwordInput.value &&
    usernameInput.value &&
    fullNameInput.value
  ) {
    signUpBtn.classList.add("active");
    signUpBtn.disabled = false;
  } else {
    signUpBtn.classList.remove("active");
    signUpBtn.disabled = true;
  }
}

// ========= Listen to input changes (only toggles button) ==========
[emailInput, passwordInput, usernameInput, fullNameInput].forEach((input) => {
  input.addEventListener("input", updateButtonState);
});

// ========= Toggle password visibility =========
if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassword.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      passwordInput.type = "password";
      togglePassword.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}

// ==================== FORM SUBMIT ====================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideErrors();

  const validEmail = validateEmail();
  const validPassword = validatePassword();
  const validUsername = validateUsername();

  if (!validEmail || !validPassword || !validUsername) {
    if (!validEmail) emailError.classList.add("active");
    if (!validPassword) passwordError.classList.add("active");
    if (!validUsername) usernameError.classList.add("active");
    return;
  }

  // Prepare payload
  // const payload = {
  //   emailOrPhone: emailInput.value.trim(),
  //   password: passwordInput.value.trim(),
  //   username: usernameInput.value.trim(),
  //   fullName: fullNameInput.value.trim(),
  // };

  // console.log("Email/Phone:", payload.emailOrPhone);
  // console.log("Username:", payload.username);
  // console.log("Password:", payload.password);
  // console.log("Full Name:", payload.fullName);

  // Prepare payload
  const value = emailInput.value.trim();
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const phonePattern = /^\d{10,15}$/;

  const payload = {
    password: passwordInput.value.trim(),
    username: usernameInput.value.trim(),
    fullName: fullNameInput.value.trim(),
  };

  if (emailPattern.test(value)) {
    payload.email = value;
  } else if (phonePattern.test(value)) {
    payload.phone = value;
  }

  try {
    const response = await fetch(window.location.origin + "/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      window.location.href = "/login.html"; // redirect to login
    } else {
      // Show server errors if any
      if (result.field === "email") {
        emailError.textContent = result.message;
        emailError.classList.add("active");
      } else if (result.field === "username") {
        usernameError.textContent = result.message;
        usernameError.classList.add("active");
      } else {
        alert(result.message || "Signup failed");
      }
    }
  } catch (error) {
    console.error("Signup Error:", error);
    alert("Something went wrong. Try again later. " + (error && error.message ? error.message : ""));
  }
});

// Initialize
hideErrors();
updateButtonState();
