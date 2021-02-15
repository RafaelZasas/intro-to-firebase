const functions = require("firebase-functions");

exports.helloWorld = functions.firestore
    .document('test/{id}')
    .onUpdate((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  return null;
});
