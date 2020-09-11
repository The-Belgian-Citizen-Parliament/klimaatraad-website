import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongodb from "mongodb";
import * as mailgun from "mailgun-js";
import { Mail } from 'src/app/mail/mail';

const MAILS_COLLECTION = "mails";

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code = null) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

export function bootstrap(app: express.Express) {
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
  });

  // Only get firstName, lastName, city; where public flag is true
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
    const newMail = req.body as Mail;

    if (!validate(req, newMail)) return;

    db.collection(MAILS_COLLECTION).insertOne(newMail, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new mail.");
      } else {
        const id = doc.ops[0]._id;
        newMail._id = id;
        console.log('Created email record: ', newMail);

        // Try to send mail
        if (process.env.MAILGUN_API_KEY) {
          try {
            console.log('Sending mail...');
            const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
            const data = {
              from: newMail.email,
              to: newMail.to,
              subject: newMail.subject,
              text: newMail.body,
            };
            mg.messages().send(data, (mailErr, body) => {
              if (mailErr) {
                handleError(res, mailErr, "Failed to send mail");
              } else {
                console.log('Mail seems to be sent: ', body);

                db.collection(MAILS_COLLECTION).replaceOne({_id: new mongodb.ObjectID(newMail._id)}, newMail, function(updateError, updatedMail) {
                  if (updateError) {
                    handleError(res, err.message, "Failed to set mail as sent");
                  } else {
                    console.log('Mail marked as sent');
                    res.status(201).json(newMail);
                  }
                });
              }
            });
          } catch (mailError) {
            handleError(res, mailError, "Failed to send mail");
          }
        } else {
          console.log('No mail configured, returning');
          res.status(201).json(newMail);
        }
      }
    });
  });

  function validate(res, mail: Mail) {
    if (!mail.firstName) {
      handleError(res, "Invalid user input", "Must provide a firstName.", 400);
    } else if (!mail.lastName) {
      handleError(res, "Invalid user input", "Must provide a lastName.", 400);
    } else if (!mail.email) {
      handleError(res, "Invalid user input", "Must provide a 'email'.", 400);
    } else if (!mail.city) {
      handleError(res, "Invalid user input", "Must provide a 'city'.", 400);
    } else if (!mail.postalCode) {
      handleError(res, "Invalid user input", "Must provide a 'postalCode'.", 400);
    } else if (!mail.subject) {
      handleError(res, "Invalid user input", "Must provide a 'subject'.", 400);
    } else if (!mail.body) {
      handleError(res, "Invalid user input", "Must provide a 'body'.", 400);
    } else if (!mail.to) {
      handleError(res, "Invalid user input", "Must provide a 'to'.", 400);
    } else return true;
    return false;
  }
}
