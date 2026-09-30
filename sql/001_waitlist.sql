BEGIN;

CREATE TABLE IF NOT EXISTS waitlist_signups (
  phone text PRIMARY KEY,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  referral_code text NOT NULL,
  referred_by text,
  CONSTRAINT waitlist_phone_e164 CHECK (phone ~ '^\+[1-9][0-9]{6,14}$'),
  CONSTRAINT waitlist_source_length CHECK (length(btrim(source)) > 0 AND length(source) <= 64),
  CONSTRAINT waitlist_referral_code_format CHECK (referral_code ~ '^[A-Za-z0-9_-]{32}$'),
  CONSTRAINT waitlist_referral_code_unique UNIQUE (referral_code),
  CONSTRAINT waitlist_referrer_format CHECK (referred_by IS NULL OR referred_by ~ '^[A-Za-z0-9_-]{32}$'),
  CONSTRAINT waitlist_no_self_referral CHECK (referred_by IS NULL OR referred_by <> referral_code),
  CONSTRAINT waitlist_referrer_fk FOREIGN KEY (referred_by)
    REFERENCES waitlist_signups (referral_code) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS waitlist_referred_by_idx ON waitlist_signups (referred_by);

-- Requests access this private table only through the server connection.
-- Owners bypass RLS; no policy grants public/anonymous/browser access to phone numbers.
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON waitlist_signups FROM PUBLIC;

COMMIT;
