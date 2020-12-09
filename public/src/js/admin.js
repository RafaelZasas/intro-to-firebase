firebase.auth().onAuthStateChanged(getUsers)

async function getUsers(currentUser) {
    const $usersSection = document.getElementById('usersSection')
    if (await isAdmin(currentUser)) {

        const usersCollection = await firebase.firestore().collection('users').get()
        const emails = usersCollection.docs.map(userDoc => userDoc.data().email)

        $usersSection.innerText = `${emails.join(' | ')}`
    } else {
        $usersSection.innerText = 'Insufficient permissions'
    }
}

async function isAdmin(user) {
    if (!user) return false;
    const userDocReference = await firebase.firestore().doc(`users/${user.uid}`).get()
    if (!userDocReference.exists) return false
    return userDocReference.data().permissions.admin
}