CREATE TABLE "revoked_tokens" (
	"token" text PRIMARY KEY NOT NULL,
	"revoked_at" timestamp DEFAULT now() NOT NULL
);
