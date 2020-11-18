async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const auth_result = await firebase.auth().signInWithPopup(provider);
    } catch (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(`Error Code:${errorCode}\nError Message:${errorMessage}`)
    }
}

async function signOut() {
    try {
        await firebase.auth().signOut();
        // Sign-out successful.
        console.log('User signed out successfully.')
    } catch (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(`Error Code:${errorCode}\nError Message:${errorMessage}`)
    }
}