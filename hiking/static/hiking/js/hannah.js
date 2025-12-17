
/* 
    Hannah Cruz | 19865209
    PAR Group 12 | SEF Assessment Iteration 2
    Monday 14:00
*/

// I NEED TO FIX THIS CODE HOLY LORD, ITS 500 LINES OF ABSOLUTE BULL. //

// ------------------------ --------------------------- ---------------------------- //
// ------------------------ --------------------------- ---------------------------- //


// ------------------------ PHONE NUM VALIDATION ---------------------------- //
function validatePhoneNum(phone) {
    if (!phone) {
        return "Please enter a phone number."
    }

    if (!/\d/.test(phone)) {
        return "Please enter a valid phone number."
    }
}

// ----------------------------- EMAIL VALIDATION --------------------------------- //
function validateEmail(email) {
    if (!email) {
        return "Email is required.";
    } // check if user has actually put in something

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address.";
    } // check if that input is valid

    return null; // nothing if it is valid
}
// ----------------------------- ADDRESS VALIDATION --------------------------------- //
function validateHouseNumber(num) {
    if (!num) {
        return "House Number is required.";
    } // check if user has actually put in something

    const houseNumRegex = /[\da-zA-Z]/;
    if (!houseNumRegex.test(num)) {
        return "Please enter a valid House Number.";
    } // check if that input is valid

    return null; // nothing if it is valid
}

function validateStreetandSuburb(text) {
    if (!text) {
        return "Street/Suburb is required.";
    } // check if user has actually put in something

    const streetNSuburbRegex = /[a-zA-Z]/;
    if (!streetNSuburbRegex.test(text)) {
        return "Please enter a valid Street/Suburb.";
    } // check if that input is valid

    return null; // nothing if it is valid
}

function validatePostCode(code) {
    if (!code) {
        return "Post Code is required.";
    } // check if user has actually put in something

    const postCodeRegex = /\d/;
    if (!postCodeRegex.test(code)) {
        return "Please enter a valid Post Code.";
    } // check if that input is valid

    return null; // nothing if it is valid
}

// ----------------------------- PASSWORD VALIDATION --------------------------------- //

function validatePassword(pwd) {
    if (!pwd) {
        return "Please enter a valid password."
    }

    if (pwd.length <= 10) {
        return "Password must be at least 10 characters long.";
    } // check if pwd <= 10

    if (/\s/.test(pwd)) {
        return "Password cannot contain spaces.";
    } // check for space chars

    if (!/[A-Z]/.test(pwd)) {
        return "Password must contain at least one uppercase letter."
    } // check for uppercase

    if (!/[a-z]/.test(pwd)) {
        return "Password must contain at least one lowercase letter."
    } // check for lowercase

    if (!/\d/.test(pwd)) {
        return "Password must contain at least one number."
    } // check for number

    if (!/[!@#$%^()-]/.test(pwd)) {
        return "Password must contain at least one special character (!@#$%^()-)."
    } // check for valid special char

    return null; // nothing if it is valid
}


function validatePasswordConfirmation(pwd, confirmPwd) {
    if (pwd !== confirmPwd) {
        return "Passwords do not match.";
    } // check if passwords match

    return null; // nothing if it is valid
}

// ----------------------------- NAME VALIDATION --------------------------------- //

function validateFirstName(fname) {
    if (!fname) {
        return "First Name is required.";
    } // check if user has actually put in something

    const fNameRegex = /[a-zA-Z]/;
    if (!fNameRegex.test(fname)) {
        return "Please enter a valid first name.";
    } // check if that input is valid

    return null; // nothing if it is valid
}

function validateLastName(lname) {
    if (!lname) {
        return "Last Name is required.";
    } // check if user has actually put in something

    const lNameRegex = /[a-zA-Z]/;
    if (!lNameRegex.test(lname)) {
        return "Please enter a valid last name.";
    } // check if that input is valid

    return null; // nothing if it is valid
}

// ----------------------------- DOB VALIDATION --------------------------------- //
// ***************************** DOES NOT WORK -- NEED TO FIX ******************************** //
function validateDOB(dob) {
    const today = new Date();
    const dobDate = new Date(dob); // because JS takes inputs as string

    // check if valid
    if (!(dobDate instanceof Date) || isNaN(dobDate.getTime())) {
        return "Please enter a valid date of birth.";
    }

    // age minimum = 16 (16 years ago from today)
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 16);

    // too young if after minimum date, because why would a 5 year old adopt a pet
    // get your parents to adopt it
    if (dobDate > minDate) {
        return "You must be at least 16 years old.";
    }

    // just in case of time travellers...
    if (dobDate > today) {
        return "Are you a time traveller...?";
    }

    return null;

}

// ------------------------ --------------------------- ---------------------------- //

// ----------------------------- CREATE CONTAINER --------------------------------- //
const createNotificationContainer = () => {
    const container = document.createElement('div');
    container.id = 'validationNotifications';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 300px;
    `;

    document.body.appendChild(container);
    return container; // JS saying "ta-da! look what i made!"
};

// ----------------------------- INITIALIZE --------------------------------- //
let notificationContainer;
if (typeof document !== 'undefined') {
    notificationContainer = createNotificationContainer();
} // creates a container if the website has no issues

// ----------------------------- SHOW --------------------------------- //
function showNotification(message, isSuccess = false) {
    if (!notificationContainer) return; // doesn't do anything if no container

    // create div for notifications
    const notification = document.createElement('div');
    notification.className = `notification ${isSuccess ? 'success' : 'error'}`;

    // notification will contain message returned in validations
    notification.textContent = message;

    // add 'notification' to notificationContainer
    notificationContainer.appendChild(notification);

    // auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) { // check if it still exists
            notification.style.animation = 'slideout 0.3s ease'; // animation
            setTimeout(() => notification.remove(), 300); // remove 300 ms after animation
        }
    }, 5000); // 5000 ms timeout before dismissal

}

// ---------------------------- HELPER FUNC (STYLE) -------------------------------- //
function updateFieldStyling(field, hasError) {
    // update input border
    field.style.borderColor = hasError ? 'red' : 'green'; // ? -- if/else shorthand
    // if hasError -- do red border; else do green border

    // find associated label and update color
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) {
        label.style.color = hasError ? 'red' : '';
        label.style.fontWeight = hasError ? 'bold' : '';
    }
}

// Reset styling to normal
function resetFieldStyling(field) {
    field.style.borderColor = '#ddd';

    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) {
        label.style.color = '';
        label.style.fontWeight = '';
    }
}

// ------------------------ --------------------------- ---------------------------- //
// ------------------------ --------------------------- ---------------------------- //


// ------------------------ SET UP EVENT LISTENERS ---------------------------- //
window.setupValidationListeners = function () {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('pwd');
    const confirmField = document.getElementById('pwdconfirm');
    const fNameField = document.getElementById('fname');
    const lNameField = document.getElementById('lname');
    const dobField = document.getElementById('dob');
    const houseNumField = document.getElementById('houseNum');
    const streetField = document.getElementById('street');
    const suburbField = document.getElementById('suburb');
    const postCodeField = document.getElementById('postcode');
   /*  const phoneNumField = document.getElementById('customerPhoneNum'); */

    function setupFieldValidation(field, validationFunction) {
        if (!field) return; // checks if elements are loaded

        // onblur
        // ***************** ONLY WORKS WHEN PRESSING ENTER -- NEED TO FIX ******************** //
        for (var i = 0; i < field.length; i++) {
            field.addEventListener('blur', function () {
                validationFunction(field);
            });
        }

        // tab key press
        // ********************** DOES NOT WORK -- NEED TO FIX ************************* //
        field.addEventListener('keydown', function (e) {
            if (e.key === 'Tab' || e.keyCode === 9) {
                setTimeout(() => {
                    validationFunction(field);
                }, 10);
            }
        });
    }

    if (fNameField) {
        setupFieldValidation(fNameField, validateFirstName);
    }

    if (lNameField) {
        setupFieldValidation(lNameField, validateLastName);
    }

    if (dobField) {
        setupFieldValidation(dobField, validateDOB);
    }

    if (houseNumField) {
        setupFieldValidation(houseNumField, validateHouseNumber);
    }

    if (streetField) {
        setupFieldValidation(streetField, validateStreetandSuburb);
    }

    if (suburbField) {
        setupFieldValidation(suburbField, validateStreetandSuburb);
    }

    if (postCodeField) {
        setupFieldValidation(postCodeField, validatePostCode);
    }

    /* if (phoneNumField) {
        setupFieldValidation(phoneNumField, validatePhoneNum);
    } */

    if (emailField) {
        setupFieldValidation(emailField, validateEmail);
    }

    if (passwordField) {
        setupFieldValidation(passwordField, validatePassword);
    }

    if (confirmField) {
        setupFieldValidation(confirmField, validatePasswordConfirmation);
    }


    // Also set up form submission handler
    const form = document.getElementById('userCreation');
    if (form) {
        form.addEventListener('submit', function (e) {
            if (!validateRegistrationForm()) {
                e.preventDefault(); // no submission if validation fails
            }
        });
    }
};


// --------------------- RESTART WHEN USER STARTS TYPING ------------------------- //
window.setupFieldReset = function () {
    const fields = ['email', 'pwd', 'pwdconfirm', 'fname', 'lname', 'dob', 'houseNum', 'street', 'suburb']; // getting element ids into an array

    // for each field id...
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId); // get element from their id,
        if (field) { // if it exists,
            field.addEventListener('input', function () { // listen for input,
                resetFieldStyling(this); // if there is input, reset notifications
            });
        }
    });
};

// --------------------- FORM SUBMISSION VALIDATION ------------------------- //
window.validateRegistrationForm = function () {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('pwd');
    const confirmField = document.getElementById('pwdconfirm');
    const fNameField = document.getElementById('fname');
    const lNameField = document.getElementById('lname');
    const dobField = document.getElementById('dob');
    const houseNumField = document.getElementById('houseNum');
    const streetField = document.getElementById('street');
    const suburbField = document.getElementById('suburb');
    const postCodeField = document.getElementById('postcode');
    /* const phoneNumField = document.getElementById('customerPhoneNumm'); */


    const emailError = validateEmail(emailField.value);
    const passwordError = validatePassword(passwordField.value);
    const confirmError = validatePasswordConfirmation(passwordField.value, confirmField.value);
    const fNameError = validateFirstName(fNameField.value);
    const lNameError = validateLastName(lNameField.value);
    const dobError = validateDOB(dobField.value);
    const houseNumError = validateHouseNumber(houseNumField.value);
    const streetError = validateStreetandSuburb(streetField.value);
    const suburbError = validateStreetandSuburb(suburbField.value);
    const postcodeError = validatePostCode(postCodeField.value);
    /* const phoneNumError = validatePhoneNum(phoneNumField.value); */


    // reset all styling first
    resetFieldStyling(emailField);
    resetFieldStyling(passwordField);
    resetFieldStyling(confirmField);
    resetFieldStyling(fNameField);
    resetFieldStyling(dobField);
    resetFieldStyling(houseNumField);
    resetFieldStyling(streetField);
    resetFieldStyling(suburbField);
    resetFieldStyling(postCodeField);
/*  resetFieldStyling(phoneNumField); */


    if (fNameError) {
        updateFieldStyling(fNameField, true);
        showNotification(fNameError, false);
        fNameField.focus();
        return false;
    }

    if (lNameError) {
        updateFieldStyling(lNameField, true);
        showNotification(lNameError, false);
        lNameField.focus();
        return false;
    }

    if (dobError) {
        updateFieldStyling(dobField, true);
        showNotification(dobError, false);
        dobField.focus();
        return false;
    }

    if (houseNumError) {
        updateFieldStyling(houseNumField, true);
        showNotification(houseNumError, false);
        houseNumField.focus();
        return false;
    }

    if (streetError) {
        updateFieldStyling(streetField, true);
        showNotification(streetError, false);
        streetField.focus();
        return false;
    }

    if (suburbError) {
        updateFieldStyling(suburbField, true);
        showNotification(suburbError, false);
        suburbField.focus();
        return false;
    }
    
    if (postcodeError) {
        updateFieldStyling(postCodeField, true);
        showNotification(postcodeError, false);
        postCodeField.focus();
        return false;
    }

   /*  if (phoneNumError) {
        updateFieldStyling(phoneNumField, true);
        showNotification(phoneNumError, false);
        phoneNumField.focus();
        return false;
    } */

    if (emailError) {
        updateFieldStyling(emailField, true);
        showNotification(emailError, false);
        emailField.focus();
        return false;
    }

    if (passwordError) {
        updateFieldStyling(passwordField, true);
        showNotification(passwordError, false);
        passwordField.focus();
        return false;
    }

    if (confirmError) {
        updateFieldStyling(confirmField, true);
        showNotification(confirmError, false);
        confirmField.focus();
        return false;
    }

    showNotification("Registration successful! Form is valid.", true);
    return true;
};

// --------------------- INIT ON PAGE LOAD ------------------------- //
// onlyt runs in a browser environment after DOM is fully loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () { // wait for full load -- ensure all elements are available before manipulation
        // all other liteners run first
        setTimeout(() => {
            if (typeof window.setupFieldReset === 'function') { // check if setupFieldReset exists
                window.setupFieldReset(); // execute if so
            }
            if (typeof window.setupValidationListeners === 'function') {
                window.setupValidationListeners(); // init listeners
            }
        });
    });
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
        message.textContent = "⚠️ Please fix errors before proceeding.";
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

