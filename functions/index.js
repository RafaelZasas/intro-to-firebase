const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();
db = admin.firestore();

exports.updateInventorySize = functions.firestore
    .document('products/{categoryId}/inventory/{productId}')
    .onWrite(async (change, context) => {
        if (change.before.exists && change.after.exists) return;

        const categoryDocumentReference = change.after.ref.parent.parent;
        const categoryDoc = await categoryDocumentReference.get();

        const oldInventorySize = categoryDoc.data().inventorySize ?? 0;
        const newInventorySize = change.before.exists ? oldInventorySize - 1 : oldInventorySize + 1;

        return await categoryDocumentReference.update('inventorySize', newInventorySize);
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
    })