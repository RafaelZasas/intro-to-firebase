async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        await firebase.auth().signInWithPopup(provider);
    } catch (error) {
        console.log(`Error Code:${error.code}\nError Message:${error.message}`)
    }
}

async function signOut() {
    try {
        await firebase.auth().signOut();
        console.log('User signed out successfully.')
    } catch (error) {
        console.log(`Error Code:${error.code}\nError Message:${error.message}`)
    }
}

async function verifyEmail() {
    try {
        const user = firebase.auth().currentUser
        await user.sendEmailVerification()
        alert('Check your inbox for ' + user.email)
    } catch (error) {
        console.log(`Error Code:${error.code}\nError Message:${error.message}`)
    }
}