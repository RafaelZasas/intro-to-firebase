const functions = require("firebase-functions");

exports.onProductWrite = functions.firestore
    .document('products/{categoryId}/inventory/{productId}')
    .onWrite(async (change, context) => {
        if (change.before.exists && change.after.exists) return;
        
        const categoryDocumentReference = change.after.ref.parent.parent;
        const categoryDoc = await categoryDocumentReference.get();
        
        const oldInventorySize = categoryDoc.data().inventorySize ?? 0;
        const newInventorySize = change.before.exists ? oldInventorySize - 1 : oldInventorySize + 1
        
        return await categoryDocumentReference.update('inventorySize', newInventorySize)
    });
