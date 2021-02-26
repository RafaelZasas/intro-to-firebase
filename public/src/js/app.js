// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbhU8BmjoxnZ128tZyRUKc4U2p4Q0j9Iw",
    authDomain: "ecommerce-with-firebase-a7af6.firebaseapp.com",
    databaseURL: "https://ecommerce-with-firebase-a7af6.firebaseio.com",
    projectId: "ecommerce-with-firebase-a7af6",
    storageBucket: "ecommerce-with-firebase-a7af6.appspot.com",
    messagingSenderId: "1086804382186",
    appId: "1:1086804382186:web:c8ca6c306569919e132293",
    measurementId: "G-7FEL1DERZ2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics(); // initialize firebase analytics
const db = firebase.firestore(); // object of our firestore database to be used throughout the site
const remoteConfig = firebase.remoteConfig();
remoteConfig.settings.minimumFetchIntervalMillis = 3600; // BEWARE: Only keep this low for development

document.addEventListener('DOMContentLoaded', () => {
    // call method to update UI according to users log in state
    firebase.auth().onAuthStateChanged(async user => {
        await displayProfileUI(user);
        user && analytics.setUserId(user.uid);
    })
});

window.onunload = function () {
    analytics.logEvent('user_exited');
}

/**
 * Checks if the user exists and changes the UI appropriately
 * @param  {Firebase.auth.User} user: The user object returned from firebase
 */
async function displayProfileUI(user) {
    let logInButton = document.getElementById('log-in');
    let logOutButton = document.getElementById('log-out');
    let adminPanelButton = document.getElementById('admin-panel');
    let profileButton = document.getElementById('profile');
    let cartBtn = document.getElementById('shoppingCartBtn');

    let chromeUser = remoteConfig.getValue('chrome_users')._value;
    let safariUser = remoteConfig.getValue('safari_users')._value;
    let purchaser = remoteConfig.getValue('purchaser')._value;
    let lucky_winner = remoteConfig.getValue('lucky_winner')._value;

    console.table([{chromeUser, safariUser, purchaser, lucky_winner}]);

    // remoteConfig.fetchAndActivate()
    //     .then((val) => {
    //         if(val){ console.log('Refreshed Remote Config') };
    //     })
    //     .catch((err) => {
    //         console.log(`error: ${err}`);
    //         // ...
    //     });

    const userSignedIn = !!user
    // hide the login and sign up buttons when user signs in
    if (logInButton) {
        logInButton.hidden = userSignedIn;
    }
    // show the profile button when user signs in
    if (profileButton) {
        profileButton.hidden = !userSignedIn;
    }

    if (logOutButton) {
        logOutButton.hidden = !userSignedIn;
    }

    if (adminPanelButton) {
        const isAdminUser = await hasPermission('admin')
        adminPanelButton.hidden = !userSignedIn || !isAdminUser
    }

    if (cartBtn) {
        cartBtn.hidden = !userSignedIn;

        if (chromeUser) {
            document.getElementById('cart-icon').setAttribute('class', 'button is-primary');
        } else if (safariUser) {
            document.getElementById('cart-icon').setAttribute('class', 'button is-info');
        }

        if (lucky_winner) {
            showToast('Congratulations - You\'re a Lucky Winner!', 'info');
        }
    }
}

/**
 * Brings up a modal which allows users to register or log in
 */
function toggleAuthModal() {
    const modal = document.getElementById('auth-modal')
    if (modal.classList.contains('is-active')) {
        modal.classList.remove('is-active')
    } else {
        modal.classList.add('is-active')
    }
}

/**
 * Provides email and password to the auth/sign in function
 * @return {Promise<void>}
 */
async function handleSignIn() {
    const errors = document.getElementById('auth-signin-errors')
    const emailInput = document.getElementById('auth-signin-email')
    const passwordInput = document.getElementById('auth-signin-password')
    try {
        errors.innerText = ''
        await signIn(emailInput.value, passwordInput.value)
        toggleAuthModal()
    } catch (e) {
        errors.innerText = e.message
    }
}


/**
 * Provides email and password to the auth/sign up function
 * @return {Promise<void>}
 */
async function handleSignUp() {
    const errors = document.getElementById('auth-signup-errors')
    const emailInput = document.getElementById('auth-signup-email')
    const passwordInput = document.getElementById('auth-signup-password')
    const passwordConfirmationInput = document.getElementById('auth-signup-password-confirm')

    try {
        errors.innerText = ''
        if (passwordInput.value !== passwordConfirmationInput.value) {
            throw new Error('Passwords do not match')
        }
        await signUp(emailInput.value, passwordInput.value)
        toggleAuthModal()
    } catch (e) {
        errors.innerText = e.message
    }
}

/**
 * This handles authentication using a provider and passes the provider instance name
 * to the auth/ sign in with provider function
 * @param providerName The name of the provider which will be used to authenticate
 * @return {Promise<void>}
 */
async function handleSignInWithProvider(providerName) {
    let errors = document.getElementById('auth-provider-errors')
    try {
        await signInWithProvider(providerName)
        toggleAuthModal()
    } catch (e) {
        errors.innerText = e.message
    }
}

/**
 * Sends the users entered email to the reset password function
 * @return {Promise<void>}
 */
async function handleResetPassword() {
    const emailInput = document.getElementById('auth-signin-email')
    await resetPassword(emailInput.value)
}

function getResultsPerPage() {
    return window.innerWidth <= 1024 ? 2 : 8
}

async function updateSearchResults(option) {
    const searchValue = document.getElementById('search').value.toLowerCase()
    const categoriesDropdown = document.getElementById('category')
    const minPrice = document.getElementById('price-min').value
    const maxPrice = document.getElementById('price-max').value
    const searchResultsList = document.getElementById('search-results')

    const selectedCategories = []
    for (const option of categoriesDropdown.children) {
        if (option.classList.contains('is-active')) {
            selectedCategories.push(option.innerText)
        }
    }

    let filteredProducts = await getFilteredProducts(
        selectedCategories,
        parseInt(minPrice),
        parseInt(maxPrice),
        option,
        getResultsPerPage()
    )

    // filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(searchValue))


    if (filteredProducts.length === 0) {
        searchResultsList.innerHTML = '<p>No products found</p>'
    } else {
        searchResultsList.innerHTML = filteredProducts.map(product => `<a class="panel-block">${product.name}</a>`).join('\n')
    }
}

/**
 * Populates the page with the selected product information.
 * Triggered when user selects a product on either of the category pages
 * @return {Promise<void>}
 */
async function populateCurrentProduct() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let docID = urlParams.get("docID"); // retrieve selected doc ID from query params
    let productType = urlParams.get("productType")

    const product = await getProductInfo(docID, productType)

    await populateProductDetails(product)
}

let priceSortAsc = true;
let nameSortAsc = true;
let optionsMap = {
    sortByName: {desc: false},
    sortByPrice: {desc: false},
    priceFilter: {minPrice: null, maxPrice: null}
}

/**
 *
 * Retrieves all the inventory of a given product category and populates the categories page with cards
 * @param productType The category to be requested from firestore and populated on the screen.
 * @param {null | String | {any: any} } options The metric by which we want to filter the data. defaults to null
 * @return {Promise<void>}
 */
async function getProducts(productType, options = null) {
    optionsMap.priceFilter = options?.priceFilter;

    if (options?.sortByPrice) {
        console.log('sorting by price')
        priceSortAsc = !priceSortAsc

        // change the icon's direction
        document.getElementById('valueSort').innerHTML = `
            <span class="tooltiptext">Sort by price</span>
            <i class="fas fa-funnel-dollar"></i>
            <i class="fas fa-sort-${priceSortAsc ? 'up' : 'down'}"></i>`

        // configure query options
        optionsMap.sortByName = null
        optionsMap.sortByPrice = {desc: !priceSortAsc};

    } else if (options?.sortByName) {
        console.log('sorting by name')

        nameSortAsc = !nameSortAsc

        document.getElementById('nameSort').innerHTML =
            `<span class="tooltiptext">Sort by name</span>
            <i class="fas fa-sort-alpha-${nameSortAsc ? 'up' : 'down'}"></i>`
        optionsMap.sortByPrice = null
        optionsMap.sortByName = {desc: !nameSortAsc};

    }

    productsRetrieved = 0;
    maxDocumentsReached = false;

    const products = await getFilteredProducts(productType, optionsMap, getResultsPerPage());

    populateProductCards(products, productType);
}

/**
 * Loads the next x products where x = 2 on mobile && 4 on tablet or higher and appends to screen
 * @param {String <"shoes"|"shirts"|"bags"|"hats">} productType
 * @return {Promise<void>}
 */
async function loadMoreProducts(productType) {
    const products = await getFilteredProducts(productType, {loadMore: true, ...optionsMap}, getResultsPerPage());

    populateProductCards(products, productType, 'append');
}
