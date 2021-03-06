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
    console.log('Filter options:', options)

    const maxProducts = await getInventorySizeForCategory(category)


    let query = db.collection(`products/${category}/inventory`)

    if (options.sortByPrice) { // if sort by price is not null or undefined
        query = options.sortByPrice.desc ? query.orderBy('price', 'desc') : query.orderBy('price');
    }

    if (options.sortByName) { // if sort by name is not null or undefined
        query = options.sortByName.desc ? query.orderBy('name', 'desc') : query.orderBy('name');
    }

    if (!options.sortByName && !options.sortByPrice) { // sort by price by default
        query = query.orderBy('price')
    }

    if (options.priceFilter) { // if sort by price filter is not null or undefined
        if (options.priceFilter.minPrice) {
            query = query.where('price', '>=', options.priceFilter.minPrice);
        }

        if (options.priceFilter.maxPrice) {
            query = query.where('price', '<=', options.priceFilter.maxPrice);
        }
    }

    if (options.loadMore) { // update the last document reference
        query = query.startAfter(lastDoc)
    }

    const snapshot = await query.limit(resultsPerPage).get()

    lastDoc = snapshot.docs[snapshot.docs.length - 1] || null

    // update the number of retrieved products
    productsRetrieved += snapshot.docs.length
    if (productsRetrieved >= maxProducts) {
        maxDocumentsReached = true;
    }

    return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
}

/**
 * Retrieves the number of products in the given category's inventory
 * @param {string} category The target category
 */
async function getInventorySizeForCategory(category) {
    const categoryInfo = await db.doc(`products/${category}`).get();
    const maxProducts = categoryInfo.data().inventorySize;

    console.log(`Inventory Size for ${category} is ${maxProducts}`);

    return maxProducts;
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
        return await docRef.get();
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
    await db.doc(docPath).delete();
    window.history.back();
}

/**
 * Adds a given product to the users shopping cart sub-collection
 * @param {Object} product The product ID & it's information that is being added to the cart.
 * @return {Promise<void>}
 */
async function addToCart(product) {
    console.log(`Added product to cart: ${product.name}`);
    const analyticsParams = {
        id: product.id,
        name: product.name,
        currency: 'USD',
        value: product.price,
        items: [{quantity: 1, ...product}]
    }
    // Log event when a product is added to the cart
    analytics.logEvent('add_to_cart', analyticsParams);
    return await db.doc(`users/${getCurrentUser().uid}/cart/${product.id}`).set(product);
}

/**
 *
 * @return {Promise<Object[]>} Items in the users cart
 */
async function getCart(){
    const snapshot = await db.collection(`users/${getCurrentUser().uid}/cart`).get();
    const cartTotal = snapshot.docs.reduce((acc, item) => acc + item.data().price, 0);
    const items = snapshot.docs.map(doc => ({ id: doc.id,  ...doc.data() }))
    return {
        shipping: 0.05 * cartTotal,
        tax: 0.14 * cartTotal,
        cartTotal,
        items
    }
}

/**
 * Removes an item from the users cart sub-collection
 * @param {String} product The document of the product to be deleted
 * @param {Boolean} [checkout=false] Optional param to specify if cart removal event should be logged
 * @return {Promise<void>}
 */
async function removeFromCart(product, checkout=false){

    console.log(`Removed ${product.name} from cart`);
    await db.doc(`users/${getCurrentUser().uid}/cart/${product.id}`).delete();

    const analyticsParams = {
        currency: 'USD',
        value: product.price,
        items: [product]
    }

    // Log remove from cart event if user isn't checking out
    !checkout ? analytics.logEvent('remove_from_cart', analyticsParams): '';

}

/**
 * Checkout users cart by removing each product in the users cart collection
 * @param {Number} cartTotal The sum of cart item prices
 * @return {Promise<void>}
 */
async function checkout(cartTotal){
    const { items } = await getCart();
    const analyticsParams = {
        currency: 'USD',
        value: cartTotal, // Total Revenue
        coupon: 'None',
        items
    }
    // Log event
    analytics.logEvent('begin_checkout', analyticsParams);
    window.location.href = 'checkout.html';

}

/**
 * Complete the purchase with the current cart
 */
async function completePurchase(){
    const { items, tax, shipping, cartTotal } = await getCart();
    await db.collection(`users/${getCurrentUser().uid}/purchases`).add({ items, cartTotal });

    const analyticsParams = {
        transaction_id: 'T12345',
        affiliation: 'Intro To Firebase',
        currency: 'USD',
        value: cartTotal, // Total Revenue
        coupon: 'None',
        tax,
        shipping,
        items
    }
    // Log event
    analytics.logEvent('purchase', analyticsParams);
    await Promise.all(items.map(doc => {
        return removeFromCart(doc, true);
    }));
    document.getElementById('checkoutSection').innerHTML = `<h3 class="title is-1 has-text-centered">Thank You :)</h3>`
    showToast(`Purchase successful - Thank You!`, 'success');
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
    const usersCollection = await firebase.firestore().collection('users').get();
    return usersCollection.docs;
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

