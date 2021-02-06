/*
This section deals with firestore calls related to product data
 */

let lastDoc = null
let productsRetrieved = 0;
/**
 * Gets a list of products that have been filtered by price, sorted by price or name or searched for
 * @param {String} category The category of product being queried
 * @param {Object} options The configuration for the query consisting of optional query params
 * @return {Promise<(*&{id: *})[]>}
 */
async function getFilteredProducts(category, options, resultsPerPage) {
    const categoryInfo = await db.doc(`products/${category}`).get();
    const maxProducts = categoryInfo.data().inventorySize;

    console.log(options)

    // base query
    let query = db.collection(`products/${category}/inventory`);

    query = options.sortByPrice?.desc ?  query.orderBy('price', 'desc'): query.orderBy('price')

    query =  options.sortByName?.desc === true ? query.orderBy('name', 'desc') : query.orderBy('name')

    if (options.priceFilter){
        query = options.priceFilter.minPrice ?
            query.where('price', '>=', options.priceFilter.minPrice) :
            query = query.where('price', '<=', options.priceFilter.maxPrice);
    }

    if (lastDoc) {
        query = query.startAfter(lastDoc)
    }

    const snapshot = await query.limit(resultsPerPage).get();

    // update the number of retrieved products
    productsRetrieved += resultsPerPage
    if (productsRetrieved >= maxProducts) {
        maxDocumentsReached = true;
    }

    // update the last document reference
    if (!options.loadMore) {
        lastDoc = null
    }
    lastDoc = snapshot.docs[snapshot.docs.length - 1]
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}


/**
 *  Queries firestore for the selected product document
 * @param {String} docID The document ID of the selected product
 * @param {String} productType The category/ product type of the selected product
 * @return {Promise<Firebase Document>} The product document retrieved from firestore
 */
async function getProductInfo(docID, productType) {
    let docRef = db.collection(`products/${productType}/inventory`).doc(docID); // reference the product document

    try {
        return await docRef.get()
    } catch (error) {
        console.log("Error getting document:", error);
    }
}

/**
 * Deletes a selected product from the firestore database
 * @param {String} docPath The path to the document which is to be deleted
 * @return {Promise<void>}
 */
async function deleteProduct(docPath) {
    await db.doc(docPath).delete()
    window.history.back()
}

/*
This section deals with firestore calls related to the user
 */

/**
 * Gets the information of the currently signed in user's document
 * @return {Promise<*>}
 */
async function getUserData() {
    return await db.doc(`users/${getCurrentUser().uid}`).get();
}

/**
 * Retrieves all of the user documents form firestore
 * @return {Promise<Array>} List of all the user documents
 */
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

