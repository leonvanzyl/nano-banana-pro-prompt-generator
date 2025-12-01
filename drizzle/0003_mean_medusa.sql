CREATE TABLE "image_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "image_likes_unique" UNIQUE("image_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "image_likes" ADD CONSTRAINT "image_likes_image_id_generated_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."generated_images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_likes" ADD CONSTRAINT "image_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "image_likes_image_id_idx" ON "image_likes" USING btree ("image_id");--> statement-breakpoint
CREATE INDEX "image_likes_user_id_idx" ON "image_likes" USING btree ("user_id");