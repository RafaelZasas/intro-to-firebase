function getProviderInstance(providerName) {
    switch (providerName) {
        case 'google':
            return new firebase.auth.GoogleAuthProvider()
        case 'github':
            return new firebase.auth.GithubAuthProvider()
        default:
            throw new Error(`Provider ${providerName} is not supported`)
    }
}

async function signInWithProvider(providerName) {
    const provider = getProviderInstance(providerName)
    await firebase.auth().signInWithPopup(provider);
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

async function resetPassword(email) {
    try {
        await firebase.auth().sendPasswordResetEmail(email)
        alert('Check your inbox for ' + email)
    } catch (error) {
        console.log(`Error Code:${error.code}\nError Message:${error.message}`)
    }
}

async function signIn(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password)
}

async function signUp(email, password) {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
}