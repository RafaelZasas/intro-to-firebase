
function renderData(doc, index) {


    let productCard = document.querySelector(`#card${index}`);

    productCard.innerHTML = `
                            <div class="card-image">
                            <figure class="image is-4by3">
                                <img src= ${doc.data().image}
                                     alt="Shoe${index}">
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="title is-4" >${doc.data().name}</p>
                        </div>
    `

}


function getProducts(productType) {

    let products = {}; // map to store the ID of each document and its associated data
    let index = 0; // to keep track of which product document were passing through

    db.collection(`products/${productType}/inventory`).get().then((querySnapshot) => {

        querySnapshot.docs.forEach((doc) => {
            // todo: Figure out if should use this or keep original data structure from firestore
            products[doc.id] = {
                "brand": doc.data().brand,
                "price": doc.data().price,
                "name": doc.data().name,
                "onSale": doc.data().onSale
            }
            renderData(doc, index); // populate the display
            index++;
        });

    });

    console.log(products);

    return products;

}
