/*
* This file serves as controller to populate DOM elements with HTML "widgets"
 */


/**
 * This function will be called in every html page other than index due to path's being different
 */
function populateNavbar() {
    let headTag = document.querySelector('#navbar');
    headTag.innerHTML = `
    <div class="navbar-brand">
        <a class="navbar-item" href="../../index.html">
            <img src="../assets/dsc_lockup.png" width="112" height="28">
        </a>

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
           data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">

            <div class="navbar-item has-dropdown is-hoverable">

                <a class="navbar-link">
                    Products
                </a>

                <!--   dropdown section for products -->
                <div class="navbar-dropdown">
                    <a class="navbar-item" href="../html/shoes.html">
                        Shoes
                    </a>
                    <a class="navbar-item" href="../html/shirts.html">
                        Shirts
                    </a>
                    <a class="navbar-item" href="../html/bags.html">
                        Bags
                    </a>
                    <a class="navbar-item" href="../html/hats.html">
                        Hats
                    </a>
                </div>
            </div>
            
            <a class="navbar-item" href="https://dsc.community.dev"> <!--  could be cool to implement google maps api -->
                Locations
            </a>


            <!--  dropdown section for More -->
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                    More
                </a>

                <div class="navbar-dropdown">
                    <a class="navbar-item" href="../html/resources.html">
                        Resources
                    </a>
                    <a class="navbar-item" href="https://firebase.google.com/">
                        Firebase Console
                    </a>
                    <a class="navbar-item" href="https://github.com/RafaelZasas/intro-to-firebase/blob/develop/docs/CONTRIBUTING.md">
                        Contribute to this website
                    </a>
                    <hr class="navbar-divider">
                    <a class="navbar-item" href="https://github.com/RafaelZasas/intro-to-firebase/issues">
                        Report an issue
                    </a>
                </div>
            </div>

            <div class="navbar-item">
                <a href="../html/questions.html" class="button is-primary">
                    Ask Alex Astrum
                </a>
            </div>
        </div>
        <div id='loginSection'>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div id="shoppingCartBtn">
                        <div class="buttons">
                            <a class="button is-light" href="../html/cart.html">
                                <span class="icon is-medium">
                                    <i class="fas fa-shopping-cart"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="navbar-item">
                    <div class="buttons">
                        <div id="log-in">
                            <a class="button is-light" onclick="toggleAuthModal()">
                                <strong>Log in</strong>
                            </a>
                        </div>
                        <div id="profile">
                            <a class="button is-primary" href="../html/profile.html">
                                <strong>Profile</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="auth-modal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Log In</p>
                <button class="delete" aria-label="close" onclick="toggleAuthModal()"></button>
            </header>
            <section class="modal-card-body">
                <div class="columns">
                    <div class="column">
                        <h1>Have an account?</h1>
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input
                                 id="auth-signin-email"
                                 class="input"
                                 type="email"
                                 autocomplete="email"
                                 placeholder="Text input">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Password</label>
                            <form class="control">
                                <input
                                id="auth-signin-password"
                                class="input"
                                autocomplete="password"
                                type="password">
                            </form>
                        </div>
                        <p id="auth-signin-errors" class="help is-danger"></p>
                        <div class="control">
                            <button class="button" onclick="handleSignIn()">Sign In</button>
                        </div>
                    </div>
                    <div class="column">
                        <h1>Create one</h1>
                        <form class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input
                                 id="auth-signup-email"
                                 class="input"
                                 type="email"
                                 autocomplete="email"
                                 placeholder="Text input">
                            </div>
                        </form>
                        <form class="field" action="">
                            <label class="label" for="auth-signup-password">Password</label>
                            <div class="control">
                                <input
                                 id="auth-signup-password"
                                 class="input"
                                 autocomplete="new-password"
                                 type="password">
                            </div>
                        </form>
                        <form class="field">
                            <label class="label" for="auth-signup-password-confirm">Confirm Password</label>
                            <div class="control">
                                <input
                                 id="auth-signup-password-confirm"
                                  class="input"
                                  autocomplete="new-password"
                                  type="password">
                            </div>
                        </form>
                        <p id="auth-signup-errors" class="help is-danger"></p>
                        <div class="control">
                            <button class="button" onclick="handleSignUp()">Sign Up</button>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="control">
                    <button class="button" onclick="handleSignInWithProvider('google')">
                        <span class="icon">
                            <i class="fab fa-google"></i>
                        </span>
                        <span>Google</span>
                    </button>
                    <button class="button" onclick="handleSignInWithProvider('github')">
                        <span class="icon">
                            <i class="fab fa-github"></i>
                        </span>
                        <span>GitHub</span>
                    </button>
                </div>
                <p id="auth-provider-errors" class="help is-danger"></p>
            </section>
        </div>
    </div>
    `;
}

/**
 * This function will be called once an individual product is selected and firestore data is received
 * @param {String} doc the document of the selected product
 * @return {Promise<void>}
 */
async function populateProductDetails(doc) {
    // this function will retrieve the details for the selected product

    let productDetails = document.querySelector(`#product`);
    let product = {id: doc.id, ...doc.data()};

    window.addCart = () => {
        addToCart(product);
        showToast(`${product.name} was added to the cart.`, 'info')
    };

    let deleteButton = `
        <button class="button is-danger" onclick="deleteProduct('${doc.ref.path}')">
            <span>Delete</span>
            <span class="icon is-small">
                <i class="fas fa-times"></i>
            </span>
        </button>
    `
    let addToCartButton = `
        <button class="button is-primary" onclick="addCart()">
            <span>Add to Cart</span>
            <span class="icon is-small">
                <i class="fas fa-shopping-cart"></i>
            </span>
         </button>`

    productDetails.innerHTML = `
            <div class="column is-two-thirds is-offset-one-fifth"> 
                <p class="title is-1 is-spaced">Name: ${product.name}</p>
                <p class="subtitle is-3">Brand: ${product.brand}</p>
                    <div class="card-image">
                        <figure class="image is-5by4">
                            <img src= ${product.image} alt=${product.name}>
                        </figure>
                    </div>
                    <br>
                <p class="title is-3" >Price: $${product.price}</p>
                <div class="buttons">
                    ${await hasPermission('admin') ? deleteButton : ''}
                    ${addToCartButton}
                </div>
            </div>
    `;

    // log event for user viewing a product
    analytics.logEvent('product_viewed', {name: doc.data().name});

}

/**
 * Called on load and on re-draw of a product category's page, this function builds the HTML string
 * of cards which will populate the screen
 * @param {Array<{}>} docs The documents with each product's information, used to populate each card individually
 * @param {String} product_type The product type of the page the user is viewing
 * @param {String <"set" | "append">} strategy Determines if documents are being loaded for the first time or appended
 */
function populateProductCards(docs, product_type, strategy = 'set') {
    let productsSection = document.querySelector(`#productsSection`);
    let productsHTML = '';

    // add each card individually;
    docs.forEach(doc => {
        productsHTML += `
                     <div class="column is-one-quarter"> <!-- specify exactly 4 cards per row-->
                     <a onclick="sessionStorage.setItem('docID','${doc.id}');" href="../html/productPage.html?docID=${doc.id}&productType=${product_type}">
                        <div class="card" id='${doc.id}' >
                            <div class="card-image">
                                <figure class="image is-4by3">
                                    <img src= ${doc.image} alt="item_${doc.id}">
                                </figure>
                            </div>
                            <div class="card-content">
                                <p class="title is-4" >${doc.name}</p>
                                <p>$${doc.price}</p>
                            </div>
                        </div>
                    </a>
                </div>
        `;
    })

    // adds all of the cards html to the products grid
    if (strategy === 'set') {
        productsSection.innerHTML = productsHTML;
    } else if (strategy === 'append') {
        productsSection.innerHTML += productsHTML;
    }

    // log that a user has viewed a category of products
    analytics.logEvent('category_viewed', {category: product_type})
}


let maxDocumentsReached = false // stops the scroll function from loading more documents when true
/**
 * Loads more products when user scrolls to the end of the screen
 * @param {String <"shoes"|"shirts"|"bags"|"hats">} type
 */
async function loadProductsOnScroll(type) {
    const BOTTOM_OFFSET = 20;
    let loading = false

    window.onscroll = async e => {
        if (loading || maxDocumentsReached) return;

        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - BOTTOM_OFFSET) {
            // at the bottom of the page
            loading = true
            await loadMoreProducts(type)
            loading = false
        }
    };
}


/**
 * Renders the HTML for the Shopping Cart Screen
 * @return {Promise<void>}
 */
async function populateCart() {
    const { items, cartTotal } = await getCart();
    let cartSection = document.getElementById('cartItems');

    cartSection.innerHTML = '';

    /**
     * Global function to remove a  product from user's cart collection and then re renders the cart HTML
     * @param {int} index The index of the document to be removed from users cart
     */
    window.removeItemFromCart = (index) => {
        removeFromCart(items[index]);
        populateCart();
    }

    /**
     * Renders the HTML for the products in the users cart colleciton
     */
    const renderItems = () => {
        items.forEach((item, itemIndex) => {
            cartSection.innerHTML += `
            <div class="level columns-mobile">
                <div class="level-left my-4 column-mobile">
                    <div class="level-item">
                            <img class="image is-128x128" src= ${item.image} alt="item_${item.id}">
                    </div>
                         
                    <div class="has-text-centered-mobile">
                        <div class="row my-1"><p class="title is-5">${item.name}</p></div>
                        <div class="row my-2"><p class="title is-6">$${item.price}</p></div>        
                    </div>
                </div>
                <div class="level-right column-mobile">
                    <div class="level-item">
                        <a class="button is-light" onclick="removeItemFromCart(${itemIndex})">
                            <span class="icon is-medium has-text-danger">
                                <i class="fas fa-trash-alt"></i>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
                     
        `;
        })
    }

    /**
     * Adds the total and checkout button to the end of the shopping cart screen
     */
    const renderTotal = () => {
        cartSection.innerHTML += `
    <br>
     <div class="row has-text-centered-mobile">
        <p class="title is-3">Total: $${cartTotal}</p>
     </div>
     <div class="row my-3 has-text-centered-mobile">
        <a class="button is-primary" onclick="handleCheckout(${cartTotal})">
            <p>Checkout </p>
             <span class="icon"><i class="fas fa-credit-card"></i></span>
        </a>
     </div>
    `
    }

    /**
     * Renders HTML for the cart screen when user has no items in their shopping cart
     */
    const noItems = `
                <div class="column is-half is-offset-one-quarter"> <!-- specify exactly 4 cards per row-->
                    <div class="has-text-centered">
                        <h1 class="center">Cart is empty</h1>
                    </div>
                </div>
    `

    const hasItems = () => {
        renderItems();
        renderTotal();
    }

    items.length === 0 ? cartSection.innerHTML = noItems : hasItems()

    const analyticsParams = {
        currency: 'USD',
        value: cartTotal,
        items
    }

    // Log event when the cart is viewed
    analytics.logEvent('view_cart', analyticsParams);

}

/**
 * Add shipping info and show the billing section
 */
async function addShippingInfo(){
    const { items, shipping } = await getCart();
    let billingSection = document.getElementById('billingInfo');
    let shippingInfoSection = document.getElementById('shippingInfo');

    shippingInfoSection.innerHTML += `
    <hr class="solid">
    `
    document.getElementById('addShippingBtn').disabled = true;
    billingSection.removeAttribute('hidden');

    // Prepare ecommerce params
    const shippingParams = {
        currency: 'USD',
        value: shipping.toFixed(2), // Total Revenue
        coupon: 'None',
        shipping_tier: 'Ground',
        items
    };

    // Log add shipping info event
    analytics.logEvent('add_shipping_info', shippingParams);

    showToast(`Shipping Info Added`, 'success');

}

/**
 * Add billing info and show the purchase totals
 */
async function addBillingInfo(){
    let billingSection = document.getElementById('billingInfo');
    let cartInformationSection = document.getElementById('cartInformation');
    let paymentSection = document.getElementById('purchaseSection');
    const { items, cartTotal, shipping, tax } = await getCart();


    billingSection.innerHTML += `
    <hr class="solid">
    `

    items.forEach(item => {
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
    <h2 class="title is-3 has-text-left">Subtotal: $${cartTotal.toFixed(2)}</h2>
    <h2 class="title is-5 has-text-left">Shipping: $${shipping.toFixed(2)}</h2>
    <h2 class="title is-5 has-text-left">Tax: $${tax.toFixed(2)}</h2>
    <div class="column is-3 pl-0 pt-0"><hr class="solid"></div>
    <h2 class="title is-3 has-text-left">Total: $${(cartTotal + shipping + tax).toFixed(2)}</h2>
    <br>
    `
    document.getElementById('addBillingInfoBtn').disabled = true;
    paymentSection.removeAttribute('hidden');

    // Prepare ecommerce params
    const paymentParams = {
        currency: 'USD',
        value: cartTotal, // Total Revenue
        coupon: 'None',
        payment_type: 'Visa',
        items
    };

    // Log add payment info event
    analytics.logEvent('add_payment_info', paymentParams);

    showToast(`Billing Info Added`, 'success');
}
