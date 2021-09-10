const { db } = require('../util/admin');

exports.getAllEvents = (request, response) => {
  db
  .collection('events')
  .orderBy('createdAt', 'desc')
  .get()
  .then((data) => {
    let events = [];

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

    return response.status(500).json({ error: err.code});
  });
};
