firebase.auth().onAuthStateChanged(populateUsers)

async function populateUsers(currentUser) {
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
                <select onchange="modifyPermissions('${user.uid}', this)">
                    <option value="user" ${user.permissions.admin ? '' : 'selected'}>Mortal User</option>
                    <option value="admin" ${user.permissions.admin ? 'selected' : ''}>Almighty Admin</option>
                </select>
            </div>
        </td>
    </tr>
    `
}

async function modifyPermissions(uid, target) {
    await updatePermission(uid, target.value)
    populateUsers(firebase.auth().currentUser)
}