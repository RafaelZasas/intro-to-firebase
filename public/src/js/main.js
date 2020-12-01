/*
* This file serves as controller to populate DOM elements with HTML "widgets"
 */


/*
  This function will be called in every html page other than index due to path's being different
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
                            <a class="button is-primary" href="./profile.html">
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

/*
  This function will be called once an individual product is selected and firestore data is received
 */
function populateProductDetails(doc) {
    // this function will retrieve the details for the selected product

    let productDetails = document.querySelector(`#product`);

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


             
            </div>
    `;

}

let productsHTML = '';

function populateProductCards(doc, index) {

    let cardHTML = `
                 <div class="column is-one-quarter"> <!-- specify exactly 4 cards per row-->
                 <a onclick="sessionStorage.setItem('docID','${doc.id}');" href="../html/productPage.html">
                    <div class="card" id='card${index}' >
                        <div class="card-image">
                            <figure class="image is-4by3">
                                <img src= ${doc.data().image} alt="item${index}">
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="title is-4" >${doc.data().name}</p>
                        </div>
                    </div>
                </a>
            </div>
    `;

    productsHTML += cardHTML; // add the individual cards to the stack

}
