firebase.auth().onAuthStateChanged(populateUsers)

async function populateUsers() {

    const usersSection = document.getElementById('usersSection')
    const usersRows = document.getElementById('usersRows')
    if (await hasPermission('admin')) {
        const usersCollection = await firebase.firestore().collection('users').get()
        const userRows = usersCollection.docs
            .map(userDoc => getUserRow(userDoc.data()))

        usersRows.innerHTML = userRows.join('\n')
    } else {
        usersSection.innerText = 'Insufficient permissions'
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
    try {
        await updatePermission(uid, target.value)
        await populateUsers(getCurrentUser())
    } catch (error) {
        console.error(error)
        console.log(error.code);
        if (error.code === 'permission-denied') {
            alert(error.message)
        }
    }
    finally {
        window.location.reload()
    }
}

