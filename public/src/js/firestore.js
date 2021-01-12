
/*
This section deals with firestore calls related to product data
 */

/**
 * Queries the firestore database for all the product docs within the selected type
 */
async function getProductsByType(productType) {
    const querySnapshot = await db.collection(`products/${productType}/inventory`).get()

    return querySnapshot.docs
}

/**
 * Queries firestore for the selected product document
 */
async function getProductInfo(docID, productType) {
    let docRef = db.collection(`products/${productType}/inventory`).doc(docID); // reference the product document

    try {
        return await docRef.get()
    } catch (error) {
        console.log("Error getting document:", error);
    }
}

async function deleteProduct(docPath) {
    await db.doc(docPath).delete()
    window.history.back()
}

/*
This section deals with firestore calls related to the user
 */


async function getUserData() {
    return await db.doc(`users/${getCurrentUser().uid}`).get();;
}

async function getAllUsers() {
    const usersCollection = await firebase.firestore().collection('users').get()
    return usersCollection.docs
}

/**
 * Inserts a new user into Firestore
 * @param {userCredential.user} user: the newly registered user
 * @returns {Promise<void>}
 */
async function insertNewUser(user) {
    // Sets user data to firestore on login
    const userRef = db.doc(`users/${user.uid}`);

    const data = { // data payload we want to save
        uid: user.uid,
        email: user.email,
        username: user.displayName,
        photoURL: 'https://picsum.photos/300', // random img
        permissions: { // for role based authentication
            user: true,
            edit: false,
            admin: false
        }
    };

    await userRef.set(data);
}

/**
 * Checks if the current user has the provided permission. 
 * Returns false if the user does not exist
 *
 * @returns {Promise<boolean>} Boolean promise which determines if user has the provided permission or not
 */
async function hasPermission(permission) {
    let user = getCurrentUser();
    if (!user) return false;

    const userDocReference = await db.doc(`users/${user.uid}`).get()

    if (!userDocReference.exists) return false

    return !!userDocReference.data().permissions[permission]
}

/**
 * Enables a specific permission for the user with the provided ID
 * @param {string} uid The ID of the target user
 * @param {string} permission The name of the permission to enable
 * 
 * @returns {Promise<void>}
 */
async function updatePermission(uid, permission) {
    const userRef = db.doc(`users/${uid}`);

    await userRef.update(
        'permissions',
        {
            user: permission === 'user',
            edit: permission === 'edit',
            admin: permission === 'admin',
        }
    )
}
