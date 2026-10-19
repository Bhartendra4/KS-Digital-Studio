# Visitor Alerts (phone push when someone opens the site)

When a real visitor opens ksdigitalstudio.in, the site sends a push notification
to your phone with: page opened, where they came from (Google, Instagram, direct...),
approximate city/country (from Vercel), and device (Mobile/Desktop, OS, browser).

## How it works

- `components/ui/VisitPing.tsx` (in the root layout) pings `POST /api/visit`
  once per browser session. It skips `/admin`, bots/headless browsers, and your
  own browser if you opted out.
- `app/api/visit/route.ts` filters bots again, throttles (same IP max once per
  30 min, max 1 alert every 5 s overall), and calls `lib/visit-notify.ts`.
- `lib/visit-notify.ts` sends to ntfy.sh and/or Telegram.
- **Disabled by default.** With no env vars set, the endpoint returns 204 and sends nothing.

## Option A — ntfy (recommended, free, no account)

1. Install the **ntfy** app (Android: Play Store / F-Droid, iPhone: App Store).
2. Tap **+ / Subscribe to topic**. Use a long random name that nobody can guess,
   e.g. `ksds-visits-7f3k9q2xw8` (anyone who knows the topic can read it).
   Server: `ntfy.sh` (default).
3. In Vercel: Project > Settings > Environment Variables, add
   `NTFY_TOPIC = ksds-visits-7f3k9q2xw8` (Production).
4. Optional: `NTFY_PRIORITY=high` for a louder alert.

## Option B — Telegram bot

1. In Telegram, open **@BotFather** > `/newbot` > copy the bot token.
2. Send any message to your new bot, then open
   `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `chat.id`.
3. In Vercel add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.

Both options can be enabled together.

## Go live

1. Review the branch `jarvis/visit-alert`, merge it, and push.
2. Vercel redeploys automatically (or click **Redeploy** after adding env vars —
   env vars only apply to new deployments).
3. Open the site from your phone's mobile data / a private window to test.

## Don't alert on your own visits

Open `https://www.ksdigitalstudio.in/?noalert=1` once on each of your devices/browsers.
Re-enable with `?noalert=0`.

## Limitations

- **Notification, not a phone call.** Per-visit calls (e.g. Twilio) cost money per
  call, are slow, and would be unbearable with real traffic. If you ever want a
  call, use ntfy `urgent` priority or only alert on leads/bookings.
- **Google Analytics has no per-visit push alerts.** GA Realtime shows live visitors
  but only on its dashboard; it cannot ping your phone per visit.
- Throttle is per server instance (best-effort); a few duplicates are possible.
- Visitors who block JavaScript, or open the page with ad blockers that block
  beacons, won't trigger an alert.
- Lots of traffic = lots of notifications. Raise `VISIT_ALERT_THROTTLE_MIN` or
  remove the env var to turn it off instantly.
- Privacy: no IP or personal data is sent in the notification — only coarse city,
  device type and referring site. Mention visit analytics in the privacy policy.
