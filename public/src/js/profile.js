function populateProfile(){
    document.getElementById('fullName').innerHTML = app.user.displayName;
    document.getElementById('profile_image').innerHTML = app.user.image;
}
