const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

/**
 * This function listens for documents being added or removed from a products inventory
 * and updates the inventorySize accordingly
 * @type {CloudFunction<Change<DocumentSnapshot>>}
 */
exports.updateInventorySize = functions.firestore
    .document('products/{categoryId}/inventory/{productId}')
    .onWrite(async (change, context) => {
        if (change.before.exists && change.after.exists) return;

        const categoryDocumentReference = change.after.ref.parent.parent;
        const categoryDoc = await categoryDocumentReference.get();

        const oldInventorySize = categoryDoc.data().inventorySize? categoryDoc.data().inventorySize: 0;
        const newInventorySize = change.before.exists ? oldInventorySize - 1 : oldInventorySize + 1;

        return categoryDocumentReference.update('inventorySize', newInventorySize);
    });


/**
 * This function listens for changes in a product document and updates the corresponding
 * product in all users cart collections.
 * @type {CloudFunction<Change<QueryDocumentSnapshot>>}
 */
exports.syncProductsAndCart = functions.firestore
    .document('products/{categoryId}/inventory/{productId}') // specify to listen for changes on inventory
    .onUpdate(async (change, context) => { // listen for doc update
        const newProductData = change.after.data();

        const cartProducts = await db
            .collectionGroup('cart')
            .where('id', '==', context.params.productId)
            .get();

        return Promise.all(cartProducts.docs.map(productDoc => {
            return productDoc.ref.update(newProductData);
        }))
    });

/**
 * A generic function which will run every Saturday at 8AM. Can be used to send news letters.
 * @type {CloudFunction<unknown>}
 */
exports.weeklyFunction = functions.pubsub
    .schedule('0 8 * * 6')
    .timeZone('America/Los_Angeles')
    .onRun((context) => {
        console.log('This will run every Saturday at 8AM!');
        return null;
            });

/**
 * A generic function which fires every minute. Used only for display purposes.
 * @type {CloudFunction<unknown>}
 */
exports.minuteFunction = functions.pubsub
    .schedule('* * * * *')
    .onRun((context) => {
        console.log('This will run every minute !');
        return null;
    });


/**
 * Sends user a confirmation email once they have purchased an item.
 * @type {CloudFunction<QueryDocumentSnapshot>}
 */
exports.notifyOnPurchase = functions.firestore
    .document('users/{uid}/purchases/{purchaseId}') // listen for changes in the purchases collection
    .onCreate(async (snapshot, context) => {
        const userDoc = await snapshot.ref.parent.parent.get();
        const userData = userDoc.data();
        const purchaseData = snapshot.data();

        // remove promotion sent flag to allow for new emails on cart creation
        await db.doc(`users/${userDoc.id}`).update({promotionSent: false});

        if (!userData.email) {
            throw new Error(`No user email found for ${userDoc.id}`);
        }

        // add the email to the mail collection which will trigger the extension and send the email
        return db.collection('mail').add({
            to: [userData.email],
            message: {
                subject: 'Your Order Confirmation',
                html: buildPurchaseConfirmationHTML(purchaseData)
            }
        })
    })

/**
 * After a user has added items to their cart, send a coupon if:
 * user hasn't received a promotion for this cart before
 * AND if cart value > $500 .
 */
exports.sendPromotion = functions
    .analytics
    .event('add_to_cart')
    .onLog(async (event) => {
        const uid = event.user.userId; // The user ID set via the setUserId API.
        const userData = await db.doc(`users/${uid}`).get(); // get users data from db
        const snapshot = await db.collection(`users/${uid}/cart`).get();
        // calculate the total of the cart
        const cartTotal = snapshot.docs.reduce((acc, item) => acc + item.data().price, 0);

        const debug = {
            uid,
            userData,
            cartTotal,
        }
        console.log(debug)

        // For purchases above 500 USD, we send a coupon of 20% off the cart value.
        if (!userData.data().promotionSent && cartTotal > 500) {
            // update user doc to specify that a promotional email has been sent to the user
            await db.doc(`users/${uid}`).update({promotionSent: true});

            // send an email to the user with the coupon
            return db.collection('mail').add({
                to: [userData.data().email],
                message: {
                    subject: 'We noticed you have quite a big cart',
                    html: buildCouponHTML()
                }
            });
        } else {
            return null
        }

    });

exports.saveQuestionFromForm = functions.https.onRequest(async (req, resp) => {
    await db.collection('questions').add({
        question: req.query.question
    }); 
    resp.status(200).send();
})

/**
 * Builds the HTML string for coupon code
 * @return {string} The html string to be mailed.
 */
function buildCouponHTML() {
    return `
        <h1>We decided to offer you a coupon code for this purchase or the next</h1>

        <h2>Use Coupon Code: <b><BIGSPENDER20/b> to get 20% off</h2>
        <p>Thank you for being a valuable customer! <br> We hope this makes your experience <i>even better</i> </p>`
}


/**
 * Builds the html string for confirmation of purchase.
 * @param {object} purchaseData The data corresponding to the users purchase
 * such as the items, value and cart value.
 * @return {string}
 */
function buildPurchaseConfirmationHTML(purchaseData) {
    if (!purchaseData.items) {
        throw new Error('No items in the purchase data were provided')
    }
    const productRows = purchaseData.items.map(item => {
        return `
        <tr>
            <td>${item.name}</td>
            <td>$${item.price}</td>
        </tr>
        `
    })
    return `
        <h1>Thank you for your purchase!</h1>

        <h2>Here's your order:</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
          ${productRows.join('\n')}
        </table>
        <br/>
        <b>Total: $${purchaseData.cartTotal}</b>`
}
