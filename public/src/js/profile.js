firebase.auth().onAuthStateChanged(populateProfile)

function populateProfile(user = getCurrentUser()) {
    var $verifyEmailButton = document.getElementById('verify-email')

    if (user) {
        document.getElementById('fullName').innerHTML = user.displayName;
        document.getElementById('small_profile_image').setAttribute('src', user.photoURL);
        document.getElementById('email-verified-success').style.display = user.emailVerified ? "inline-flex" : "none"
        document.getElementById('email-verified-failure').style.display = user.emailVerified ? "none" : "inline-flex"
    }
    $verifyEmailButton.style.display = !user || user.emailVerified ? "none" : "inline-flex"
}
