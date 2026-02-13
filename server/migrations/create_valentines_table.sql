-- SQL to create the valentines table referenced by the new endpoints

CREATE TABLE valentines (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name  text,
  recipient    text NOT NULL,
  message      text NOT NULL,
  created_at   timestamptz   NOT NULL DEFAULT now()
);

-- index for quick lookups by recipient
CREATE INDEX ON valentines (recipient);
