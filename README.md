# SafeGuard — frontend prototype

Smart Community Security and Emergency Response System — resident + admin
frontend for **Jos, Plateau State**, built with Expo SDK 54 and Expo Router.
No backend: all data lives in `data/*.json` and in-memory React Context
(`context/AppContext.tsx`), so everything resets when the app reloads.

## Setup

```bash
pnpm install
pnpm dlx expo install --fix   # confirms every dependency matches SDK 54
pnpm exec expo start -c
```

Scan the QR code with Expo Go, or press `i` / `a` for a simulator.

If you're on pnpm and hit "Unable to resolve module" errors, this repo
already ships a `.npmrc` with `node-linker=hoisted`, which fixes the usual
Metro/pnpm mismatch. Delete `node_modules` and reinstall if you still see it.

## How it works

- **Login** has a Resident / Admin toggle plus an area dropdown (Jos North,
  Jos South, Bukuru, Rayfield, Terminus, Angwan Rogo, Farin Gada, Tudun Wada,
  Bauchi Road) and a "Enable location" button that requests real GPS
  permission via `expo-location`. The region itself is still picked
  manually — there's no backend to reverse-geocode against, so this is
  honestly a permission demo, not live geofencing.
- **Register** replaces the old free-text estate field with the same area
  dropdown, scoped to Jos, Plateau State only.
- **Resident tabs**: Home (Facebook-style feed — stories strip of active
  incidents, area/all-Jos toggle, compact stat strip, scrollable post feed),
  Feed (category filter + sort + area toggle), Report (unlimited photos and
  description length), Alerts, Profile.
- **Admin tabs**: Dashboard (scoped to the admin's coverage region), Manage
  (explicit Active / Responding / Resolved buttons per report, plus a
  my-region vs. all-Jos toggle), Profile.
- **Tap any report card** → full detail screen (`/incident/[id]`) with the
  complete, untruncated description, every attached photo, and a **Share**
  button that opens the native share sheet (WhatsApp, Facebook, Twitter/X,
  Instagram, Messages, etc. — whatever's installed). Admins additionally see
  the three status buttons right on the detail screen.
- Submitting a report or changing a status updates the shared `AppContext`
  state, so resident and admin views reflect it during the session.

## What's mocked vs. real

| Feature | Status |
|---|---|
| Login / register | Accepts anything, no validation |
| Reports feed | Seeded from `data/reports.json` (Jos locations), editable in-session |
| Alerts | Static, from `data/alerts.json` |
| Location permission | Real GPS permission request via `expo-location` |
| Region matching | Manual dropdown selection — no reverse geocoding |
| "Nearest" sort | Proxy only: your own region's reports float to the top |
| Photo attachments | Real device photo picker, unlimited count |
| Share | Real native share sheet (`Share.share`) |
| Admin status updates | In-memory only, resets on reload |

## Next steps if you want it real

- Swap `AppContext`'s in-memory state for Supabase or a REST API
- Reverse-geocode GPS coordinates into the region list for real "connect by
  location" instead of manual selection
- Push notifications (`expo-notifications`) for new incidents in your region
- Persist session with `AsyncStorage` so login survives app restarts
- Compress/resize images before upload once there's a real backend to send
  them to
