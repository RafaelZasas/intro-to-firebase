/**
 * Functionality related to specifically the cart page
 */
firebase.auth().onAuthStateChanged(populateCart)

/**
 * Removes a product from the product collection and then redraw the cart HTML
 * @param {String} productID The document ID of the product to be removed from users cart
 * @return {Promise<void>}
 */
async function remove(productID) {
    await removeFromCart(productID);
    await populateCart();
}

/**
 * Calls checkout function which removes all the items from the cart then re renders the Cart HTML
 * @param {Number} total The total of the cart at the time of checkout
 * @return {Promise<void>}
 */
async function handleCheckout(total) {
    await checkout(total);
    await populateCart();
}
