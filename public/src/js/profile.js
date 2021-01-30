firebase.auth().onAuthStateChanged(populateProfile)

/**
 * Populates the users profile page with their information and email verification status
 * @param {firebase.auth.User} user The user object of the currently signed in user
 * @return {Promise<void>}
 */
async function populateProfile(user) {
    let verifyEmailButton = document.getElementById('verify-email')
    let userPhoto = user.photoURL;
    if (!user.photoURL) {
        let userDetails = await getUserData();
        userPhoto = userDetails.data().photoURL;
    }

    if (user) {
        document.getElementById('fullName').innerHTML = user.displayName;
        document.getElementById('small_profile_image').setAttribute('src', userPhoto);
        document.getElementById('email-verified-success').style.display = user.emailVerified ? "inline-flex" : "none"
        document.getElementById('email-verified-failure').style.display = user.emailVerified ? "none" : "inline-flex"
    }
    verifyEmailButton.style.display = !user || user.emailVerified ? "none" : "inline-flex"
}
