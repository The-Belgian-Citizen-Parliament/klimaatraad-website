CREATE TABLE mails (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  postal_code TEXT,
  city TEXT,
  allow_public BOOLEAN NOT NULL,
  stay_up_to_date BOOLEAN NOT NULL,
  mail_to TEXT NOT NULL,
  mail_subject TEXT NOT NULL,
  mail_body TEXT NOT NULL,
  sent_on TIMESTAMP NOT NULL
);
