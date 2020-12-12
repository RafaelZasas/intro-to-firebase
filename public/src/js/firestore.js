
/*
This section deals with firestore calls related to product data
 */
let productsSection = document.querySelector(`#productsSection`);

/**
 * Populates all the products in the provided vategory (collection)
 * @param {string} productType 
 */
function getProducts(productType) {
    // this function queries the firestore database for all the product docs within the selected category

    sessionStorage.setItem("productType", productType) // set globally for use in getProductInfo()

    let index = 0; // to keep track of which product document were passing through

    db.collection(`products/${productType}/inventory`).get().then((querySnapshot) => {

        querySnapshot.docs.forEach((doc) => {

            populateProductCards(doc, index);// add each card individually; index is used to reference each of the cards
            index++;
        });

        productsSection.innerHTML += productsHTML; // adds all of the cards html to the products grid

    });
}

/**
 * Get the product information for the currently selected product (from Session Storage)
 */
function getProductInfo() {
    // this function queries firestore for the selected product document

    let docID = sessionStorage.getItem("docID"); // retrieve selected doc ID from session storage
    let productType = sessionStorage.getItem("productType")

    let docRef = db.collection(`products/${productType}/inventory`).doc(docID); // reference the product document
    docRef.get().then(function (doc) {
        if (doc.exists) {
            populateProductDetails(doc);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

async function deleteProduct(docPath) {
    await db.doc(docPath).delete()
    window.history.back()
}

/*
This section deals with firestore calls related to the user
 */

/**
 * Retrieves the user data from Firestore for the currently logged in user
 * @returns {firebase.firestore.DocumentReference}
 */
async function getUserData() {
    return await db.doc(`users/${getCurrentUser().uid}`).get();
}

/**
 * Retrieves all the users from the `users` collection
 * @returns {[firebase.firebase.DocumentReference]}
 */
async function getAllUsers() {
    const usersCollection = await firebase.firestore().collection('users').get()
    return usersCollection.docs
}

/**
 * Inserts a new user into Firestore
 * @param {userCredential.user} user: the newly registered user
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

    return await userRef.set(data);
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

    return  !!userDocReference.data().permissions[permission]
}

/**
 * Enables a specific permission for the user with the provided ID
 * @param {string} uid: the ID of the target user
 * @param {string} permission: the name of the permission to enable
 */
async function updatePermission(uid, permission) {
    const userRef = db.doc(`users/${uid}`);

    return await userRef.update(
        'permissions',
        {
            user: permission === 'user',
            edit: permission === 'edit',
            admin: permission === 'admin',
        }
    )
}
