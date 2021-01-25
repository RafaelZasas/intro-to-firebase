
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
firebase.analytics(); // initialize firebase analytics
const db = firebase.firestore(); // object of our firestore database to be used throughout the site

document.addEventListener('DOMContentLoaded', () => {
    // call method to update UI according to users log in state
    firebase.auth().onAuthStateChanged(displayProfileUI);
});


/**
 * Checks if the user exists and changes the UI appropriately
 */
async function displayProfileUI(user) {
    let logInButton = document.getElementById('log-in');
    let logOutButton = document.getElementById('log-out');
    let adminPanelButton = document.getElementById('admin-panel')
    let profileButton = document.getElementById('profile');

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
}

function toggleAuthModal() {
    const modal = document.getElementById('auth-modal')
    if (modal.classList.contains('is-active')) {
        modal.classList.remove('is-active')
    } else {
        modal.classList.add('is-active')
    }
}

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

async function handleSignInWithProvider(providerName) {
    let errors = document.getElementById('auth-provider-errors')
    try {
        await signInWithProvider(providerName)
        toggleAuthModal()
    } catch (e) {
        errors.innerText = e.message
    }
}

async function handleResetPassword() {
    const emailInput = document.getElementById('auth-signin-email')
    await resetPassword(emailInput.value)
}

function handleCategorySelected(category) {
    const categoriesSelect = document.getElementById('category')

    for (child of categoriesSelect.children) {
        if (child.classList.contains('is-active')) {
            child.classList.remove('is-active')
        }
    }

    category.classList.add('is-active')

    updateSearchResults()
}

async function populateCategories() {
    const categories = await getAllCategories()
    const categoriesSelect = document.getElementById('category')

    categoriesSelect.innerHTML = categories
        .map((category, i) => {
            return `<a onclick="handleCategorySelected(this)" class="${i === 0 ? 'is-active' : ''}">${category}</a>`
        })
        .join('\n')

    updateSearchResults()
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
        option
    )

    // filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(searchValue))


    if (filteredProducts.length === 0) {
        searchResultsList.innerHTML = '<p>No products found</p>'
    } else {
        searchResultsList.innerHTML = filteredProducts.map(product => `<a class="panel-block">${product.name}</a>`).join('\n')
    }
}