firebase.auth().onAuthStateChanged(getUsers)

async function getUsers(currentUser) {
    const $usersSection = document.getElementById('usersSection')
    const $usersRows = document.getElementById('usersRows')
    if (await isAdmin(currentUser)) {

        const usersCollection = await firebase.firestore().collection('users').get()
        const userRows = usersCollection.docs
            .map(userDoc => getUserRow(userDoc.data()))

        $usersRows.innerHTML = userRows.join('\n')
    } else {
        $usersSection.innerText = 'Insufficient permissions'
    }
}

function getUserRow(user) {
    return `
    <tr>
        <td>${user.uid}</td>
        <td>${user.email}</td>
        <td>
            <div class="is-primary select">
                <select>
                    <option value="user" ${user.permissions.admin ? '' : 'selected'}>Mortal User</option>
                    <option value="admin" ${user.permissions.admin ? 'selected' : ''}>Almighty Admin</option>
                </select>
            </div>
        </td>
    </tr>
    `
}

async function isAdmin(user) {
    if (!user) return false;
    const userDocReference = await firebase.firestore().doc(`users/${user.uid}`).get()
    if (!userDocReference.exists) return false
    return userDocReference.data().permissions.admin
}