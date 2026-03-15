DROP INDEX "last_message_idx";--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "last_message_id" uuid;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_last_message_id_messages_id_fk" FOREIGN KEY ("last_message_id") REFERENCES "public"."messages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "created_idx" ON "messages" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "chats" DROP COLUMN "last_message";--> statement-breakpoint
ALTER TABLE "chats" DROP COLUMN "last_message_at";