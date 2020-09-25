import * as express from "express";
import * as bodyParser from "body-parser";
import { Pool } from "pg";
import * as mailgun from "mailgun-js";
import { Mail } from 'src/app/mail/mail';

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code = null) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

export function bootstrap(app: express.Express) {
  app.use(bodyParser.json());

  // Create a database variable outside of the database connection callback to reuse the connection pool in your app.
  const opts = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL || 'postgres://$(whoami)?sslmode=disable',
    ssl: { rejectUnauthorized: false }
  } : {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
  };

  var pool = new Pool(opts);

  // Only get firstName, lastName, city; where public flag is true
  app.get("/api/mails/last", function(req, res) {
    pool.query(`
      SELECT first_name as "firstName", substring(last_name, 1, 1) as "lastName", city, created_on as "sentOn"
      FROM mails
      WHERE allow_public = true
      ORDER BY sent_on DESC
      LIMIT 20`)
      .then((result) => res.status(200).json(result.rows))
      .catch(err => handleError(res, err.message, "Failed to get contacts."));
  });

  app.post("/api/mails", function(req, res) {
    const newMail = req.body as Mail;

    if (!validate(req, newMail)) return;

    pool.query(`
      INSERT INTO mails(first_name, last_name, email, postal_code, city, allow_public, stay_up_to_date, mail_to, mail_subject, mail_body, created_on, sent_on)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [newMail.firstName, newMail.lastName, newMail.email, newMail.postalCode, newMail.city, newMail.allowPublic, newMail.stayUpToDate, newMail.to, newMail.subject, newMail.body, new Date(), null])
      .then((inserted) => {
        const id = inserted.rows[0].id;
        newMail.id = id;
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
                newMail.sentOn = new Date();

                pool.query(`
                  UPDATE mails SET sent_on = $1 WHERE id = $2`,
                  [newMail.sentOn, id])
                  .then(() => {
                    console.log('Mail marked as sent');
                    res.status(201).json(newMail);
                  })
                  .catch((updateError) => handleError(res, updateError.message, "Failed to set mail as sent"));
              }
            });
          } catch (mailError) {
            handleError(res, mailError, "Failed to send mail");
          }
        } else {
          console.log('No mail configured, returning');
          res.status(201).json(newMail);
        }
      })
      .catch(insertError => handleError(res, insertError.message, "Failed to create new mail."))
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
