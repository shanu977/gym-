-- Phase 6F-4: preserve the frontend's multi-option variant selection on cart lines.
ALTER TABLE "CartItem" ADD COLUMN "variantSnapshot" JSONB;
