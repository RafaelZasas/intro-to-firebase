/**
 * Returns the currently logged in user for use in other js files
 */
function getCurrentUser() {
    return firebase.auth().currentUser;
}

/**
 * Called by signInWithProvider, this function returns a provider instance from firebase
 * @param {String} providerName The name of the provider which will be mapped to its corresponding firebase auth provider
 * @return {firebase.auth.GoogleAuthProvider|firebase.auth.GithubAuthProvider}
 */
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

/**
 * Signs a user in using a provider and updates the firestore database with the user information
 * @param {String} providerName The name of the provider that the user selected
 * @return {Promise<void>}
 */
async function signInWithProvider(providerName) {
    const provider = getProviderInstance(providerName)
    let userCredential = await firebase.auth().signInWithPopup(provider);
    const method = userCredential.user.credential.signInOptions

    // track user login event with login method
    analytics.logEvent('login', {method});

    // determine if user data has already saved to firestore. Insert data otherwise.
    let userDetails = await getUserData();
    if (!userDetails) {
        await insertNewUser(userCredential.user);
    }
}

/**
 * This will sign the user out and output the event to the console
 * @return {Promise<void>}
 */
async function signOut() {
    try {
        await firebase.auth().signOut();
        // track user login event with login method
        analytics.logEvent('logout');
        console.log('User signed out successfully.')
    } catch (error) {
        console.log(`Error Code:${error.code}\nError Message:${error.message}`)
    }
}

/**
 * Sends an email to the user, prompting them to verify their email
 * @return {Promise<void>}
 */
async function verifyEmail() {
    try {
        const user = firebase.auth().currentUser
        await user.sendEmailVerification()
        alert('Check your inbox for ' + user.email)
    } catch (error) {
        console.log(`Error Code:${error.code}\nError Message:${error.message}`)
    }
}

/**
 * Sends an email to the user prompting them to reset their password
 * @param {String} email
 * @return {Promise<void>}
 */
async function resetPassword(email) {
    try {
        await firebase.auth().sendPasswordResetEmail(email)
        alert('Check your inbox for ' + email)
    } catch (error) {
        console.log(`Error Code:${error.code}\nError Message:${error.message}`)
    }
}

/**
 * Handles authentication using email and password
 * @param {String} email The users entered email
 * @param {String} password The users entered password
 * @return {Promise<void>}
 */
async function signIn(email, password) {
    let userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
    const method = userCredential.user.credential.signInOptions
    // track user login event with login method
    analytics.logEvent('login', {method});
}

/**
 * Handles authentication using email and password and updates the database with the new users document information
 * @param {String} email The users entered email
 * @param {String} password The users entered password
 * @return {Promise<void>}
 */
async function signUp(email, password) {
    let userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const method = userCredential.user.credential.signInOptions
    // track user login event with login method
    analytics.logEvent('sign_up', {method});
    await insertNewUser(userCredential.user);
}
