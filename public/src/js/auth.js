document.addEventListener('DOMContentLoaded', () => {
    const $logInButton = document.getElementById('log-in')

    $logInButton.addEventListener('click', async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);

        console.log(result.user);
    });
});