
/*
This section deals with firestore calls related to product data
 */
let productsSection = document.querySelector(`#productsSection`);


/**
 * Queries the firestore database for all the product docs within the selected type
 */
async function getProducts(product_type) {
    sessionStorage.setItem("productType", product_type) // set globally for use in getProductInfo()

    const querySnapshot = await db.collection(`products/${product_type}/inventory`).get()

    // add each card individually; index is used to reference each of the cards
    querySnapshot.docs.forEach((doc, i) => populateProductCards(doc, i));

    productsSection.innerHTML += productsHTML; // adds all of the cards html to the products grid
}

/**
 * Queries firestore for the selected product document
 */
async function getProductInfo() {
    let docID = sessionStorage.getItem("docID"); // retrieve selected doc ID from session storage
    let productType = sessionStorage.getItem("productType")

    let docRef = db.collection(`products/${productType}/inventory`).doc(docID); // reference the product document

    try {
        const doc = await docRef.get()
    
        if (doc.exists) {
            populateProductDetails(doc);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
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
