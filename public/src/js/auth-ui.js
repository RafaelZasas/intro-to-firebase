// // FirebaseUI config from https://github.com/firebase/firebaseui-web#starting-the-sign-in-flow
// var uiConfig = {
//     signInSuccessUrl: '../html/profile.html',
//     signInOptions: [
//         // Leave the lines as is for the providers you want to offer your users.
//         firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//         firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     ],
//     // tosUrl and privacyPolicyUrl accept either url string or a callback
//     // function.
//     // Terms of service url/callback.
//     tosUrl: 'https://www.google.com',
//     // Privacy policy url/callback.
//     privacyPolicyUrl: function () {
//         window.location.assign('<your-privacy-policy-url>');
//     }
// };

// // Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());

// // The start method will wait until the DOM is loaded.
// ui.start('#firebaseui-auth-container', uiConfig);
