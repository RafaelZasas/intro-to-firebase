let productsSection = document.querySelector(`#productsSection`);
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

function populateProductDetails(doc) {
    // this function will retrieve the details for the selected product

    let productDetails = document.querySelector(`#product`);
    let cardHTML = `
                 <div class="column is-full"> 
                 <a onclick="sessionStorage.setItem('docID','${doc.id}');" href="../html/productPage.html">
                        <!-- Save the ID of the selected doc to be used after page navigation-->
                        <div class="card-image">
                            <figure class="image is-5by4">
                                <img src= ${doc.data().image} alt=${doc.data().name}>
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="title is-4" >Brand: ${doc.data().brand}</p>
                            <p class="title is-4" >Name: ${doc.data().name}</p>
                            <p class="title is-4" >Price: $${doc.data().price}</p>
                        </div>

                </a>
            </div>
    `;

    productDetails.innerHTML = cardHTML;

}


function getProducts(product_type) {
    // this function queries the firestore database for all the product docs within the selected category

    sessionStorage.setItem("productType", product_type) // set globally for use in getProductInfo()

    let index = 0; // to keep track of which product document were passing through

    db.collection(`products/${product_type}/inventory`).get().then((querySnapshot) => {

        querySnapshot.docs.forEach((doc) => {

            populateProductCards(doc, index);// add each card individually; index is used to reference each of the cards
            index++;
        });

        productsSection.innerHTML += productsHTML; // adds all of the cards html to the products grid

    });


}


function getProductInfo() {
    // this function queries firestore for the selected product document

    let docID = sessionStorage.getItem("docID"); // retrieve selected doc ID from session storage
    let productType = sessionStorage.getItem("productType")

    let docRef = db.collection(`products/${productType}/inventory`).doc(docID); // reference the product document
    docRef.get().then(function (doc) {
        if (doc.exists) {
            populateProductDetails(doc);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}
