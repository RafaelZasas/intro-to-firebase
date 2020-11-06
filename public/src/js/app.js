
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
const app = firebase;
app.initializeApp(firebaseConfig);
firebase.analytics(); // initialize firebase analytics

console.log(app)

function isUserLoggedIn(){
    var user = app.auth().currentUser;

    console.log(!!user) ; // print true if user exists
    if (user){ // check is user is signed in
        // hide the login and sign up buttons when user signs in
        document.getElementById('loginSection').hidden=true;
        // show the profile button when user signs in
        document.getElementById('ProfileSection').hidden=false;
    }
    return !!user;
}


