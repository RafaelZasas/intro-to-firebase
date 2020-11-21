
let productsSection = document.querySelector(`#productsSection`);
let productsHTML ='';


function populateProductCards(doc, index) {

    let cardHTML = `
                 <div class="column is-one-quarter"> <!-- specify exactly 4 cards per row-->
<!--                 todo: create onCLick events to display individual Product Details -->
                <a href="" id=${doc.id}>  <!--store doc ID in card for reference purposes -->
                    <div class="card" id='card${index}'>
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


function getProducts(productType) {

    let products = {}; // map to store the ID of each document and its associated data
    let index = 0; // to keep track of which product document were passing through

    db.collection(`products/${productType}/inventory`).get().then((querySnapshot) => {

        querySnapshot.docs.forEach((doc) => {
            
            
            // todo: determine if we even need a locally stored map of documents
            products[doc.id] = {
                ...doc.data() // this replaces the need for individual assignments such as "brand": doc.data().brand,
            }

            populateProductCards(doc, index); // add each card individually; index is used to reference each of the cards
            index++;
        });

        productsSection.innerHTML += productsHTML; // adds all of the cards html to the products grid

    });

    console.log(products);

    return products;

}
