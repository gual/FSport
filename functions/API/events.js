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
      functions.logger.error("Error retrieving event", err);

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

exports.deleteEvent = (request, response) => {
  const document = db.doc(`/events/${request.params.eventId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({error: "Event not found"});
      }

      return document.delete();
    })
    .then(() => {
      response.json({message: "Event deleted successfully"});
    })
    .catch((err) => {
      functions.logger.error("Error deleting event", err);

      return response.status(500).json({error: err.code});
    });
};

exports.editEvent = ( request, response ) => {
  if (request.body.eventId || request.body.createdAt) {
    response.status(403).json({message: "Not allowed to edit"});
  }

  const document = db.collection("events").doc(`${request.params.eventId}`);

  document
    .update(request.body)
    .then(()=> {
      response.json({message: "Event updated successfully"});
    })
    .catch((err) => {
      functions.logger.error("Error editing event", err);

      return response.status(500).json({error: err.code});
    });
};
