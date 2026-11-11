#!/usr/bin/env node
/**
 * Lemon Squeezy purchase → delivery webhook stub.
 *
 * Flow:
 *   1. Buyer purchases on Lemon Squeezy (product created in dashboard).
 *   2. LS calls this endpoint: POST {event:"order_created", ...}.
 *   3. We verify the HMAC signature, then email the buyer the license key
 *      (or trigger a post-purchase script — e.g., generate a watermarked PDF).
 *
 * Env (in .env, never committed):
 *   LEMONSQUEEZY_SIGNING_SECRET
 *   LEMONSQUEEZY_API_KEY
 *   LEMONSQUEEZY_STORE_ID
 *
 * NOTE: Lemon Squeezy API is read-mostly for products — product/file creation
 * happens in the dashboard; the REST API manages checkouts, license keys,
 * subscriptions, webhooks. See brain/research/marketplaces-api/00-SUMMARY.md.
 */

import crypto from 'node:crypto';

const SECRET = process.env.LEMONSQUEEZY_SIGNING_SECRET || '';

/** Verify LS webhook HMAC signature (hex SHA-256 of body). */
export function verifyLemonSqueezySignature(rawBody, signatureHex) {
  if (!SECRET) throw new Error('LEMONSQUEEZY_SIGNING_SECRET not set');
  const digest = crypto.createHmac('sha256', SECRET).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest, 'utf8'), Buffer.from(signatureHex, 'utf8'));
}

/** Minimal example HTTP handler (mount under e.g. /api/lemonsqueezy/webhook). */
export async function handleWebhook(rawBody, signatureHeader) {
  if (!verifyLemonSqueezySignature(rawBody, signatureHeader)) {
    return { status: 401, body: 'invalid signature' };
  }
  const payload = JSON.parse(rawBody.toString('utf8'));
  const event = payload?.meta?.event_name || 'unknown';
  switch (event) {
    case 'order_created':
      // TODO: generate license key / watermarked PDF, email buyer
      return { status: 200, body: 'queued' };
    default:
      return { status: 200, body: 'ignored' };
  }
}

export default handleWebhook;
