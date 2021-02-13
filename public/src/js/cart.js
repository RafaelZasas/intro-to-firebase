/**
 * Functionality related to specifically the cart page
 */
firebase.auth().onAuthStateChanged(populateCart)

/**
 * Calls checkout function which removes all the items from the cart then re renders the Cart HTML
 * @param {Number} total The total of the cart at the time of checkout
 * @return {Promise<void>}
 */
async function handleCheckout(total) {

    try {
        await checkout(total);
        await populateCart();
        showToast(`Thanks for your purchace! You total was $${total}.`, 'success');
    } catch (e) {
        showToast('There was a problem with the checkout.', 'danger');
        console.error(e);
    }
}

