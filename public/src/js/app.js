
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbhU8BmjoxnZ128tZyRUKc4U2p4Q0j9Iw",
    authDomain: "ecommerce-with-firebase-a7af6.firebaseapp.com",
    databaseURL: "https://ecommerce-with-firebase-a7af6.firebaseio.com",
    projectId: "ecommerce-with-firebase-a7af6",
    storageBucket: "ecommerce-with-firebase-a7af6.appspot.com",
    messagingSenderId: "1086804382186",
    appId: "1:1086804382186:web:c8ca6c306569919e132293",
    measurementId: "G-7FEL1DERZ2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics(); // initialize firebase analytics
const db = firebase.firestore(); // object of our firestore database to be used throughout the site

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
    if ($modal.classList.contains('is-active')) {
        $modal.classList.remove('is-active')
    } else {
        $modal.classList.add('is-active')
    }
}

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