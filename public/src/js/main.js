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


        </div>
        <div id='loginSection'>
            <div class="navbar-end">
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
                                <input id="auth-signin-email" class="input" type="email" placeholder="Text input">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Password</label>
                            <div class="control">
                                <input id="auth-signin-password" class="input" type="password">
                            </div>
                        </div>
                        <p id="auth-signin-errors" class="help is-danger"></p>
                        <div class="control">
                            <button class="button" onclick="handleSignIn()">Sign In</button>
                        </div>
                    </div>
                    <div class="column">
                        <h1>Create one</h1>
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input id="auth-signup-email" class="input" type="email" placeholder="Text input">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Password</label>
                            <div class="control">
                                <input id="auth-signup-password" class="input" type="password">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Confirm Password</label>
                            <div class="control">
                                <input id="auth-signup-password-confirm" class="input" type="password">
                            </div>
                        </div>
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

    let deleteButton = `
        <button class="button is-danger" onclick="deleteProduct('${doc.ref.path}')">Delete</button>
    `

    productDetails.innerHTML = `
            <div class="column is-two-thirds is-offset-one-fifth"> 
                <p class="title is-1 is-spaced">Name: ${doc.data().name}</p>
                <p class="subtitle is-3">Brand: ${doc.data().brand}</p>
                    <div class="card-image">
                        <figure class="image is-5by4">
                            <img src= ${doc.data().image} alt=${doc.data().name}>
                        </figure>
                    </div>
                    <br>
                <p class="title is-3" >Price: $${doc.data().price}</p>
                ${await hasPermission('admin') ? deleteButton : ''}
            </div>
    `;

    // log event for user viewing a product
    analytics.logEvent('ProductViewed', {name: doc.data().name});

}

/**
 * Called on load and on re-draw of a product category's page, this function builds the HTML string
 * of cards which will populate the screen
 * @param {Array<{}>} docs The documents with each product's information, used to populate each card individually
 * @param {String} product_type The product type of the page the user is viewing
 * @param {String <"set" | "append">} strategy Determines if documents are being loaded for the first time or appended
 */
function populateProductCards(docs, product_type, strategy='set') {
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

    analytics.logEvent('category_viewed', {category: product_type})
}


let maxDocumentsReached = false // stops the scroll function from loading more documents when true
/**
 * Loads more products when user scrolls to the end of the screen
 * @param {String <"shoes"|"shirts"|"bags"|"hats">} type
 * @return {Promise<(function(*): Promise<void>)|*>}
 */
async function loadProductsOnScroll(type){
     return window.onscroll = async function (ev) {

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            // at the bottom of the page
            maxDocumentsReached? console.log('max documents loaded') : await loadMoreProducts(type)

        }
    };
}
