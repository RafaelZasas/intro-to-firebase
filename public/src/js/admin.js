

/**
 * Used in the Admin dashboard to populate a table with all of the site's users and their permissions
 * @return {Promise<void>}
 */
async function populateUsers() {

    const usersSection = document.getElementById('usersSection')
    const usersRows = document.getElementById('usersRows')
    if (await hasPermission('admin')) {
        const allUsers = await getAllUsers()
        const userRows = allUsers.map(userDoc => getUserRow(userDoc.data()))
        usersRows.innerHTML = userRows.join('\n')
    } else {
        usersSection.innerText = 'Insufficient permissions'
    }
}

/**
 * Defines a user row to be populated in the admin dashboard table of all users.
 * Contains the users name and their permissions
 * @param {firebase.auth.User} user User object for the nth user in the table
 * @return {string} The HTML for a single row in the users table
 */
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

/**
 * Changes the users permissions on firestore and re-draws the admin dashboard's user table
 * @param {String} uid The document ID of the user who's permissions is to be changed
 * @param {String} target The target permission to be changed on the users document
 * @return {Promise<void>}
 */
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

