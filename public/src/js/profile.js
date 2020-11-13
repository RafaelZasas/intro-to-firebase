function populateProfile() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            document.getElementById('fullName').innerHTML = user.displayName;
            document.getElementById('small_profile_image').setAttribute('src', user.photoURL);
        }
    })
}

function getFirestoreData(){
    var output = document.getElementById('forData');
    output.innerText = "test";
    console.log("test")
}

document.getElementById('btnGet').addEventListener('click', getFirestoreData);
