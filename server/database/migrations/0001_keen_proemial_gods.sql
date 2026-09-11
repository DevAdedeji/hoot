CREATE TABLE "channel" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"handle" text NOT NULL,
	"display_name" text NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"avatar_url" text,
	"banner_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "channel_owner_id_unique" UNIQUE("owner_id"),
	CONSTRAINT "channel_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
ALTER TABLE "channel" ADD CONSTRAINT "channel_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;