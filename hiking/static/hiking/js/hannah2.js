// -------------------- HELPER: Show Inline Error -------------------- //
function showError(id, message) {
  const span = document.getElementById(id);
  if (span) {
    span.textContent = message || "";
    span.style.color = message ? "red" : "";
  }
}

// -------------------- NAME VALIDATION -------------------- //
function validateFirstName() {
  const fname = document.getElementById("fname").value.trim();
  const regex = /^[A-Za-z]+$/;

  if (!fname) return showError("fnameError", "First name is required.");
  if (!regex.test(fname)) return showError("fnameError", "Please enter a valid first name.");
  showError("fnameError", null);
  return true;
}

function validateLastName() {
  const lname = document.getElementById("lname").value.trim();
  const regex = /^[A-Za-z]+$/;

  if (!lname) return showError("lnameError", "Last name is required.");
  if (!regex.test(lname)) return showError("lnameError", "Please enter a valid last name.");
  showError("lnameError", null);
  return true;
}

// -------------------- DOB VALIDATION -------------------- //
function validateDOB() {
  const dob = document.getElementById("dob").value;
  const spanId = "dobError";

  if (!dob) return showError(spanId, "Date of birth is required.");

  const today = new Date();
  const dobDate = new Date(dob);
  if (isNaN(dobDate.getTime())) return showError(spanId, "Please enter a valid date of birth.");

  const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
  if (dobDate > today) return showError(spanId, "Are you a time traveller...?");
  if (dobDate > minAgeDate) return showError(spanId, "You must be at least 16 years old.");

  showError(spanId, null);
  return true;
}

// -------------------- ADDRESS VALIDATION -------------------- //
function validateHouseNumber() {
  const val = document.getElementById("houseNum").value.trim();
  const regex = /^[\da-zA-Z]+$/;
  if (!val) return showError("houseNumError", "House/Unit number is required.");
  if (!regex.test(val)) return showError("houseNumError", "Please enter a valid house number.");
  showError("houseNumError", null);
  return true;
}

function validateStreet() {
  const val = document.getElementById("street").value.trim();
  const regex = /^[A-Za-z\s]+$/;
  if (!val) return showError("streetError", "Street name is required.");
  if (!regex.test(val)) return showError("streetError", "Street name must only contain letters.");
  showError("streetError", null);
  return true;
}

function validateSuburb() {
  const val = document.getElementById("suburb").value.trim();
  const regex = /^[A-Za-z\s]+$/;
  if (!val) return showError("suburbError", "Suburb is required.");
  if (!regex.test(val)) return showError("suburbError", "Suburb must only contain letters.");
  showError("suburbError", null);
  return true;
}

function validateState() {
  const val = document.getElementById("state").value;
  if (!val) return showError("stateError", "Please select a state.");
  showError("stateError", null);
  return true;
}

function validatePostCode() {
  const val = document.getElementById("postcode").value.trim();
  const regex = /^\d{4}$/;
  if (!val) return showError("postcodeError", "Postcode is required.");
  if (!regex.test(val)) return showError("postcodeError", "Postcode must be 4 digits.");
  showError("postcodeError", null);
  return true;
}

// -------------------- CONTACT VALIDATION -------------------- //
function validatePhoneNum() {
  const phone = document.getElementById("customerPhoneNum").value.trim();
  const regex = /^\d{8,12}$/;
  if (!phone) return showError("customerPhoneNumError", "Phone number is required.");
  if (!regex.test(phone)) return showError("customerPhoneNumError", "Enter a valid phone number.");
  showError("customerPhoneNumError", null);
  return true;
}

function validateEmail() {
  const email = document.getElementById("email").value.trim();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) return showError("emailError", "Email is required.");
  if (!regex.test(email)) return showError("emailError", "Please enter a valid email address.");
  showError("emailError", null);
  return true;
}

// -------------------- PASSWORD VALIDATION -------------------- //
function validatePassword() {
  const pwd = document.getElementById("pwd").value;
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^()\-])[A-Za-z\d!@#$%^()\-]{10,}$/;
  if (!pwd) return showError("pwdError", "Password is required.");
  if (!regex.test(pwd))
    return showError("pwdError", "Password must be 10+ chars, with upper, lower, number, and special (!@#$%^()-).");
  showError("pwdError", null);
  return true;
}

function validatePasswordConfirmation() {
  const pwd = document.getElementById("pwd").value;
  const confirm = document.getElementById("pwdconfirm").value;
  if (!confirm.value) return showError("pwdconfirmError", "Please confirm your password.");
  if (pwd !== confirm) return showError("pwdconfirmError", "Passwords do not match.");
  showError("pwdconfirmError", null);
  return true;
}

// -------------------- PROPERTY VALIDATION -------------------- //
function validatePropertyType() {
  const propertyOptions = document.querySelectorAll('input[name="propertyType"]');
  const selected = Array.from(propertyOptions).find(opt => opt.checked);
  const errorSpan = document.querySelector(".property-typeError");

  if (!selected) {
    errorSpan.textContent = "Please select your property type.";
    errorSpan.style.color = "red";
    return false;
  }

  errorSpan.textContent = "";
  toggleYardVisibility(selected.value); // show/hide yard section dynamically
  return true;
}

// -------------------- SHOW/HIDE AND VALIDATE YARD LOGIC -------------------- //
function toggleYardVisibility(selectedProperty) {
  const yardDiv = document.querySelector(".yard");

  // property types that REQUIRE yard selection
  const yardProperties = ["House", "Villa", "Duplex", "Townhouse"];

  if (yardProperties.includes(selectedProperty)) {
    yardDiv.style.display = "block";
  } else {
    yardDiv.style.display = "none";
    document.getElementById("yard").value = ""; // reset selection
    document.querySelector(".yardError").textContent = "";
  }
}

// yard shows up when certain types of property is selected
document.addEventListener("DOMContentLoaded", () => {
  const propertyRadios = document.querySelectorAll('input[name="propertyType"]');
  propertyRadios.forEach(radio => {
    radio.addEventListener("change", () => toggleYardVisibility(radio.value));
  });

  // hide yard by default
  document.querySelector(".yard").style.display = "none";
});

function validateYard() {
  const yardDiv = document.querySelector(".yard");
  const yardSelect = document.getElementById("yard");
  const yardError = document.querySelector(".yardError");

  // only validate if visible
  if (yardDiv.style.display === "none") {
    yardError.textContent = "";
    return true;
  }

  if (!yardSelect.value) {
    yardError.textContent = "Please select your yard size.";
    yardError.style.color = "red";
    return false;
  }

  yardError.textContent = "";
  return true;
}

// -------------------- MASTER FORM VALIDATION -------------------- //
function validateRegistrationForm() {
  const results = [
    validateFirstName(),
    validateLastName(),
    validateDOB(),
    validateHouseNumber(),
    validateStreet(),
    validateSuburb(),
    validateState(),
    validatePostCode(),
    validatePhoneNum(),
    validateEmail(),
    validatePassword(),
    validatePasswordConfirmation(),
    validatePropertyType(),
    validateYard(),
    validateChildren(),
  ];

  return results.every(Boolean);
}

// ------------------------ --------------------------- ---------------------------- //
// ------------------------ --------------------------- ---------------------------- //
// --------------------- FORM STEPS ------------------------- //

let currentStep = 0;
const steps = document.querySelectorAll(".form-step");

function showStep(n) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === n);
    });

    // Update indicators
    updateStepIndicator();
}

function updateStepIndicator() {
    const stepIndicators = document.querySelectorAll(".step-number");
    stepIndicators.forEach((indicator, i) => {
        indicator.classList.toggle("active", i === currentStep);
        indicator.classList.toggle("completed", i < currentStep);
    });
}

function nextStep() {
    const errMsg = document.getElementById('message');
    message.textContent = "";


    if (!validateRegistrationForm()) {
        message.textContent = " Please fix errors before proceeding.";
        return;
    }

    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
    } else {
        // If last step, submit the form
        if (validateRegistrationForm()) {
            document.getElementById('userCreation').submit();
        }
    }
}


function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    showStep(currentStep);
    updateStepIndicator();
});

// ------------------------ --------------------------- ---------------------------- //
// ------------------------ --------------------------- ---------------------------- //
// --------------------- SIDEBAR ------------------------- //
document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById("toggleBtn");
    const sidebar = document.getElementById("sidebar");

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", function () {
            sidebar.classList.toggle("collapsed")
        });
    }
});
