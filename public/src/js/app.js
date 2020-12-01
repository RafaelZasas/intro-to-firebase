
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics(); // initialize firebase analytics

document.addEventListener('DOMContentLoaded', () => {
    // call method to update UI according to users log in state
    firebase.auth().onAuthStateChanged(displayProfileUI)
});

/**
 * Checks if the user exists and changes the UI appropriately
 */
function displayProfileUI(user) {
    var $logInButton = document.getElementById('log-in');
    var $logOutButton = document.getElementById('log-out');
    var $profileButton = document.getElementById('profile');

    console.log('User: ', user);
    const userSignedIn = !!user
    // hide the login and sign up buttons when user signs in
    if ($logInButton) {
        $logInButton.hidden = userSignedIn;
    }
    // show the profile button when user signs in
    if ($profileButton) {
        $profileButton.hidden = !userSignedIn;
    }
    if ($logOutButton) {
        $logOutButton.hidden = !userSignedIn;
    }
}

function toggleAuthModal() {
    const $modal = document.getElementById('auth-modal')

    // toggle the visibility class
    if ($modal.classList.contains('is-active')) {
        $modal.classList.remove('is-active')
    } else {
        $modal.classList.add('is-active')
    }
}

/**
 * Gets user's email/password and signs them in
 */
async function handleSignIn() {
    const $errors = document.getElementById('auth-signin-errors')
    const $emailInput = document.getElementById('auth-signin-email')
    const $passwordInput = document.getElementById('auth-signin-password')

    try {
        $errors.innerText = ''
        await signIn($emailInput.value, $passwordInput.value)
        toggleAuthModal()
    } catch (e) {
        $errors.innerText = e.message
    }
}

/**
 * Gets user's email/password and signs them up
 */
async function handleSignUp() {
    const $errors = document.getElementById('auth-signup-errors')
    const $emailInput = document.getElementById('auth-signup-email')
    const $passwordInput = document.getElementById('auth-signup-password')
    const $passwordConfirmationInput = document.getElementById('auth-signup-password-confirm')

    try {
        $errors.innerText = ''
        if ($passwordInput.value !== $passwordConfirmationInput.value) {
            throw new Error('Passwords do not match')
        }
        await signUp($emailInput.value, $passwordInput.value)
        toggleAuthModal()
    } catch (e) {
        $errors.innerText = e.message
    }
}

/**
 * Signs in with the appropriate provider
 * @param {string} providerName - the string identifier for the provider
 */
async function handleSignInWithProvider(providerName) {
    $errors = document.getElementById('auth-provider-errors')
    try {
        await signInWithProvider(providerName)
        toggleAuthModal()
    } catch (e) {
        $errors.innerText = e.message
    }
}

/**
 * Gets user's email and sends them the password reset email
 */
async function handleResetPassword() {
    const $emailInput = document.getElementById('auth-signin-email')
    await resetPassword($emailInput.value)
}