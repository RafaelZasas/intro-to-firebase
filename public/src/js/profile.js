function populateProfile() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            document.getElementById('fullName').innerHTML = user.displayName;
            document.getElementById('small_profile_image').setAttribute('src', user.photoURL);
        }
    })
}
