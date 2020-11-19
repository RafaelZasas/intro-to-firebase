document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged(populateProfile)
    populateProfile()
})

function populateProfile(user) {
    if (user) {
        document.getElementById('fullName').innerHTML = user.displayName;
        document.getElementById('small_profile_image').setAttribute('src', user.photoURL);
    }
}
