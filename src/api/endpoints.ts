import * as express from "express";
import * as bodyParser from "body-parser";
import { Pool } from "pg";
import * as mailgun from "mailgun-js";
import { Mail } from 'src/app/mail/mail';
import { mails } from './mails';

const SEND_TO_FAKE_MAILS = true; // TODO: WARNING: SWITCH OFF
const CHUNK_SIZE = 3; // TODO: WARNING: SET TO 10

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
      ORDER BY created_on DESC
      LIMIT 10`)
      .then((result) => res.status(200).json(result.rows))
      .catch(err => handleError(res, err.message, "Failed to get contacts."));
  });

  function createMail(mail: Mail): Promise<any> {
    return pool.query(`
      INSERT INTO mails(first_name, last_name, email, postal_code, city, lang, allow_public, stay_up_to_date, mail_to, mail_subject, mail_body, created_on, sent_on)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [mail.firstName, mail.lastName, mail.email, mail.postalCode, mail.city, mail.lang, mail.allowPublic, mail.stayUpToDate, mail.to, mail.subject, mail.body, new Date(), null]);
  }

  function toChunksOf(inputArray: string[], chunkSize) {
    const result = inputArray.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / chunkSize);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }

      resultArray[chunkIndex].push(item)

      return resultArray
    }, []);

    return result;
  }

  function createMailData(firstName: string, lastName: string, replyTo: string, recipients: string[], subject: string, body: string){
    return ({
      from: firstName + ' ' + lastName + ' <info@thecitizensparliament.be>', //  '<' + newMail.email + '>',
      'h:Reply-To': replyTo,
      to: recipients.join(', '),
      subject: subject,
      text: body,
    });
  }

  function createThankYouMailData(lang: string, to: string, firstName: string, stayUpToDate: boolean) {
    return ({
      from: mails[lang].from,
      to: to,
      subject: mails[lang].thankYou.subject,
      html: mails[lang].thankYou.bodyIntro.replace('$0', firstName) + (stayUpToDate ? mails[lang].thankYou.bodyUpToDate : '') + mails[lang].thankYou.bodyOutro,
    });
  }

  app.post("/api/mails", function(req, res) {
    const newMail = req.body as Mail;

    if (!validate(req, newMail)) return;

    createMail(newMail).then((inserted) => {
        const id = inserted.rows[0].id;
        newMail.id = id;
        console.log('Created email record: ', id);

        // Try to send mail
        if (process.env.MAILGUN_API_KEY) {
          try {
            const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN, host: 'api.eu.mailgun.net' });

            // If more than 10 recipients are selected, split them up.
            let recipients = newMail.to.split(', ');

            if (SEND_TO_FAKE_MAILS) {
              let counter = 0;
              recipients = recipients.map(() => `vsels${counter++}@teleworm.us`);
            }

            const recipientsAsChunks = toChunksOf(recipients, CHUNK_SIZE);
            const mailDataPerChunk = recipientsAsChunks.map(r => createMailData(newMail.firstName, newMail.lastName,
              newMail.email, r, newMail.subject, newMail.body));

            console.log(`Sending ${mailDataPerChunk.length} mail(s) per chunk of ${CHUNK_SIZE}.`);

            const sendPromises = mailDataPerChunk.map(mailData => {
              return new Promise((resolve, reject) => {
                mg.messages().send(mailData, (mailErr, body) => {
                  if (mailErr) {
                    console.log('Error sending mail to ' + mailData.to, mailErr);
                    reject(mailErr);
                  } else {
                    console.log('Mail seems to be sent to ' + mailData.to, body);
                    resolve(body);
                  }
                });
              });
            });

            Promise.all(sendPromises)
              .then((bodies) => {
                // All mails sent successfully
                console.log('All mails sent successfully!');
                newMail.sentOn = new Date();

                console.log('Sending thank you mail...');
                const thankYouData = createThankYouMailData(newMail.lang, newMail.email, newMail.firstName, newMail.stayUpToDate);

                mg.messages().send(thankYouData, (mailErr, body) => {
                  if (mailErr) {
                    handleError(res, mailErr, "Failed to send thank you mail");
                  } else {
                    console.log('Thank you mail seems to be sent: ', body);
                  }
                });

                pool.query(`
                  UPDATE mails SET sent_on = $1 WHERE id = $2`,
                  [newMail.sentOn, id])
                  .then(() => {
                    console.log('Mail marked as sent');
                    res.status(201).json(newMail);
                  })
                  .catch((updateError) => handleError(res, updateError.message, "Failed to set mail as sent"));
              })
              .catch((mailErr) => {
                // Error while sending at least one mail
                handleError(res, mailErr, "Failed to send mail");
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
    } else if (!mail.lang) {
      handleError(res, "Invalid user input", "Must provide a 'lang'.", 400);
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
