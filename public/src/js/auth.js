
document.addEventListener('DOMContentLoaded', () => {
    const $logInButton = document.getElementById('log-in');
    $logInButton.addEventListener('click', async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        const auth_result = await firebase.auth().signInWithPopup(provider);

        // Raf- I added this as given by docs: https://firebase.google.com/docs/auth/web/auth-state-persistence
        app.auth().setPersistence(app.auth.Auth.Persistence.SESSION)
            .then(function() {
                // Existing and future Auth states are now persisted in the current
                // session only. Closing the window would clear any existing state even
                // if a user forgets to sign out.
                // ...
                // New sign-in will be persisted with session persistence.
                return auth_result

            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(`Error Code:${errorCode}\nError Message:${errorMessage}`)
            });

        isUserLoggedIn(); // call method to update UI according to users log in state
    });
});
