let shippingInfoSection = document.getElementById('shippingInfo');
let billingSection = document.getElementById('billingInfo');
let paymentSection = document.getElementById('purchaseSection');
let cartInformationSection = document.getElementById('cartInformation');

async function addShippingInfo(){
    shippingInfoSection.innerHTML += `
    <hr class="solid">
    `
    billingSection.removeAttribute('hidden');
}

async function addBillingInfo(){
    let cartTotal = 0;
    billingSection.innerHTML += `
    <hr class="solid">
    `
    const snapshot = await getCart();
    const cartItems = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

    cartItems.forEach(item => {
        cartTotal += item.price;
        cartInformationSection.innerHTML += `
            <div class="level columns-mobile">
                <div class="level-left my-1 column-mobile">        
                        <div class="mx-1"><p class="title is-5">${item.name}</p></div>  
                        <div class="mx-2"><p class="title is-5">$${item.price}</p></div>   
                </div>
            </div>          
        `;
    })

    cartInformationSection.innerHTML += `
    <div class="column is-3 pl-0 pt-0"><hr class="solid"></div>
    <h2 class="title is-3 has-text-left">Total: $${cartTotal}</h2>
    <br>
    `

    paymentSection.removeAttribute('hidden');
}
