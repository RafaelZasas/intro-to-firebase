const functions = require("firebase-functions");
const admin = require('firebase-admin');
const {user} = require("firebase-functions/lib/providers/auth");

admin.initializeApp();
const db = admin.firestore();

exports.updateInventorySize = functions.firestore
    .document('products/{categoryId}/inventory/{productId}')
    .onWrite(async (change, context) => {
        if (change.before.exists && change.after.exists) return;

        const categoryDocumentReference = change.after.ref.parent.parent;
        const categoryDoc = await categoryDocumentReference.get();

        const oldInventorySize = categoryDoc.data().inventorySize ?? 0;
        const newInventorySize = change.before.exists ? oldInventorySize - 1 : oldInventorySize + 1;

        return categoryDocumentReference.update('inventorySize', newInventorySize);
    });


exports.syncProductsAndCart = functions.firestore
    .document('products/{categoryId}/inventory/{productId}')
    .onUpdate(async (change, context) => {
        const newProductData = change.after.data();

        const cartProducts = await db
            .collectionGroup('cart')
            .where('id', '==', context.params.productId)
            .get();

        return Promise.all(cartProducts.docs.map(productDoc => {
            return productDoc.ref.update(newProductData);
        }))
    });

exports.notifyOnPurchase = functions.firestore
    .document('users/{uid}/purchases/{purchaseId}')
    .onCreate(async (snapshot, context) => {
        const userDoc = await snapshot.ref.parent.parent.get();
        const userData = userDoc.data();
        const purchaseData = snapshot.data();

        console.log(userData);

        if (!userData.email) {
            throw new Error(`No user email found for ${userDoc.id}`);
        }

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

        // For purchases above 500 USD, we send a coupon of 20% off the cart value.
        if (userData.data()?.promotionSent && cartTotal > 500) {
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

function buildCouponHTML() {
    return `
        <h1>We decided to offer you a coupon code for this purchase or the next</h1>

        <h2>Use Coupon Code: <b><BIGSPENDER20/b> to get 20% off</h2>
        <p>Thank you for being a valuable customer! <br> We hope this makes your experience <i>even better</i> </p>`
}


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
