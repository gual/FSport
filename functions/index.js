const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");

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
  deleteEvent,
  editEvent,
} = require("./API/events");

const {
  signUpUser,
  loginUser,
  uploadProfilePhoto,
} = require("./API/users");

// Events
app.get("/events", getAllEvents);
app.post("/events", postOneEvent);
app.delete("/events/:eventId", deleteEvent);
app.put("/events/:eventId", editEvent);

// Users
app.post('/signup', signUpUser);
app.post('/login', loginUser);
app.post('/user/image', auth, uploadProfilePhoto);

exports.api = functions.https.onRequest(app);
