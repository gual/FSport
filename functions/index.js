const functions = require("firebase-functions");
const app = require("express")();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

const {
  getAllEvents,
  postOneEvent,
} = require("./API/events");

app.get("/events", getAllEvents);
app.post("/events", postOneEvent);

exports.api = functions.https.onRequest(app);
