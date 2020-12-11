firebase.auth().onAuthStateChanged(populateUsers)

async function showAdminDashboard() {
    const btnAdminDashboard = document.getElementById('btnAdminDashboard');
    if (await isAdmin(getCurrentUser())) {

        btnAdminDashboard.innerHTML = `
                            <a class="button is-primary" href="../html/admin.html">
                                <strong>Admin Dashboard</strong>
                            </a>
        `
    } else {
        btnAdminDashboard.innerText = 'nope';
    }
}

async function populateUsers(user) {
    const $usersSection = document.getElementById('usersSection')
    const $usersRows = document.getElementById('usersRows')
    if (await isAdmin(user)) {

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
<!--                make the mortal user option selected if user isn't admin-->
                    <option value="user" ${user.permissions.admin ? '' : 'selected'}>Mortal User</option>
<!--                make the Almighty Admin< option selected if user is admin-->
                    <option value="admin" ${user.permissions.admin ? 'selected' : ''}>Almighty Admin</option>
                </select>
            </div>
        </td>
    </tr>
    `
}

async function modifyPermissions(uid, target) {
    await updatePermission(uid, target.value)
    await populateUsers(getCurrentUser())
}

