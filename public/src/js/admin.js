firebase.auth().onAuthStateChanged(getUsers)

async function getUsers(user) {
    const userDocReference = await firebase.firestore().doc(`users/${user.uid}`).get()
    const isAdmin = userDocReference.data().permissions.admin
    console.log(`This user is ${isAdmin ? '' : 'not '}an admin`);
}