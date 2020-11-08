class Auth {
    static isSignedIn() {
        return !!firebase.auth().currentUser
    }

    static async signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        try {
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.
            const auth_result = await firebase.auth().signInWithPopup(provider);
        } catch (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(`Error Code:${errorCode}\nError Message:${errorMessage}`)
        }
    }

    static async signOut() {
        await firebase.auth().signOut()
    }
}
