function populateProfile() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            document.getElementById('fullName').innerHTML = user.displayName;
            document.getElementById('profile_image').innerHTML = user.image;
        }
    })
}
