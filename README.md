# Tapza Care

A React Native patient app prototype for the Tapza Care assignment. It includes a config-driven home, doctor and service booking, prescriptions, and a shared medicine-reminder list.

## Run it

1. Install Node.js 20 or newer.
2. In this folder, run npm install.
3. Connect an Android device or start an emulator.
4. Run npm run android to build and launch the native development client. For later JavaScript reloads, use npm run start:dev.
5. Run npm run typecheck for TypeScript checking.

The Android native project is already generated. To regenerate it after changing native plugins, use npm run prebuild:android.

## Installable build

The public repository is https://github.com/ss1290/tapza-care. Download the APK from https://github.com/ss1290/tapza-care/releases/latest. The APK is signed with the project's debug key for assignment review and sideloading; it is not a Play Store build.

To build another release APK on Windows:

~~~powershell
cd android
.\gradlew.bat assembleRelease
~~~

Install the APK by copying it to an Android device, opening it, and allowing installation from that file source when Android asks.

## Project structure

- App.tsx contains navigation, booking interactions, loading and error states, and preview controls.
- src/types.ts defines API and layout data types.
- src/config.ts provides Everyday and Diwali layouts, themes, doctors, services, and sample prescriptions.
- src/configValidation.ts checks the mock home configuration and skips unknown section types.
- src/mockApi.ts supplies delayed mock endpoints and selectable endpoint failures.
- src/SectionRenderer.tsx renders the home sections, backgrounds, and entrance/parallax motion.
- src/bookingState.ts handles optimistic booking, reconciliation, and rollback.
- src/i18n.ts provides English, Hindi, and Telugu labels for the main flows.

## Architecture

The home uses a vertical FlatList; horizontal chips and doctor cards stay inside their sections. mockApi mirrors the assignment endpoint shapes and keeps the last valid home layout in memory. The preview sheet switches the local config between Everyday and Diwali and can simulate latency, endpoint failures, and empty prescriptions.

Bookings appear immediately and are reconciled with the mock response. A failed confirmation removes the optimistic booking. Prescription details expand to show dose timing, and the reminder page uses the same taken state.

## Demo material

- Silent screen recording: docs/TapzaCare-demo-silent.mp4
- Screenshots: docs/screenshots

The recording has no voice-over. It shows both home themes, a forced booking failure, and medicine reminders.

## What is cut

The endpoints are in-memory mocks; there is no live server, authentication, persistent storage, or scheduled local notifications. Some secondary home shortcuts are visual previews. Automated tests were removed at the user's request, although the assignment asks for config, renderer, and booking-state tests. AI_LOG.md was also removed at the user's request, although the assignment asks for it.

This is a single initial snapshot; the requested meaningful 48-hour commit history cannot be recreated honestly after the fact. The repository has an initial snapshot plus a publication update; the requested 48-hour history cannot be recreated honestly. Exact assignment hours were not tracked, so I have not estimated them.
