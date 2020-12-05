let productsSection = document.querySelector(`#productsSection`);
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
