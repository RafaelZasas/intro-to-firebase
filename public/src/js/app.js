
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
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

document.addEventListener('DOMContentLoaded', () => {
    const $logInButton = document.getElementById('log-in');
    const $logOutButton = document.getElementById('log-out');

    $logInButton.addEventListener('click', Auth.signInWithGoogle);
    $logOutButton.addEventListener('click', Auth.signOut);

    // call method to update UI according to users log in state
    firebase.auth().onAuthStateChanged(displayProfileUI)
});

/**
 * Checks if the user exists and changes the UI appropriately
 */
function displayProfileUI(user) {
    console.log('auth changed');
    const userSignedIn = !!user
    // hide the login and sign up buttons when user signs in
    document.getElementById('loginSection').hidden = userSignedIn;
    // show the profile button when user signs in
    document.getElementById('ProfileSection').hidden = !userSignedIn;
}