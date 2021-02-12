firebase.auth().onAuthStateChanged(populateCart)

async function remove(id) {
    await removeFromCart(id);
    await populateCart();
}

async function handleCheckout(total) {
    await checkout(total);
    await populateCart();
}