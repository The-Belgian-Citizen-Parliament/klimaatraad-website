const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const https = require("https");
const ObjectID = mongodb.ObjectID;

const MAILS_COLLECTION = "mails";

const app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  const server = app.listen(process.env.PORT || 8080, function () {
    const port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/api/mails/last", function(req, res) {
  db.collection(MAILS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/mails", function(req, res) {
  const newMail = req.body;
  newMail.createDate = new Date();

  if (!req.body.body) {
    handleError(res, "Invalid user input", "Must provide a body.", 400);
  } else if (!req.body.subject) {
    handleError(res, "Invalid user input", "Must provide a subject.", 400);
  } else if (!req.body.to) {
    handleError(res, "Invalid user input", "Must provide a 'to'.", 400);
  } else {
    db.collection(MAILS_COLLECTION).insertOne(newMail, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new mail.");
      } else {
        const savedMail = doc.ops[0];

        // Try to send mail
        if (process.env.MAILGUN_API_KEY) {
          try {
            const url = `https://api:${process.env.MAILGUN_API_KEY}@api.eu.mailgun.net/v3/klimaatraad.herokuapp.com`;
            https.post(url, {
              from: newMail.from,
              to: newMail.to,
              subject: newMail.subject,
              text: newMail.text,
            }, (mailError, params) => {
              handleError(res, mailError, "Failed to send mail");
            });
          } catch (mailError) {
            handleError(res, mailError, "Failed to send mail");
          }

          // Send mail worked: update record
          savedMail.sent = true;
          db.collection(MAILS_COLLECTION).updateOne({_id: new ObjectID(savedMail._id)}, savedMail, function(updateError, updatedMail) {
            if (updateError) {
              handleError(res, err.message, "Failed to set mail as sent");
            }
          });
        }

        res.status(201).json(savedMail);
      }
    });
  }
});
