const admin = require("firebase-admin");
const functions = require("firebase-functions");

const {db} = require("../util/admin");

exports.getAllEvents = (request, response) => {
  db
    .collection("events")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      const events = [];

      data.forEach((doc) => {
        events.push({
          eventId: doc.id,
          type: doc.data().type,
          createdAt: doc.data().createdAt,
        });
      });

      return response.json(events);
    })
    .catch((err) => {
      functions.logger.error(
        "Error retrieving event",
        err
      );

      return response.status(500).json({error: err.code});
    });
};

exports.postOneEvent = (request, response) => {
  if (request.body.type.trim() === "") {
    return response.status(400).json({type: "Must not be empty"});
  }

  const newEventItem = {
    type: request.body.type,
    createdAt: admin.firestore.Timestamp.now(),
  };

  db
    .collection("events")
    .add(newEventItem)
    .then((doc)=>{
      const responseEventItem = newEventItem;

      responseEventItem.id = doc.id;

      return response.json(responseEventItem);
    })
    .catch((err) => {
      functions.logger.error("Error saving event", err);

      response.status(500).json({error: "Something went wrong"});
    });
};
