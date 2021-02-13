firebase.auth().onAuthStateChanged(populateCart)

async function remove(id) {
    await removeFromCart(id);
    await populateCart();
}

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