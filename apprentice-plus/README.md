# Apprentice+ (prototype)

A working React Native (Expo) prototype of Apprentice+ — an all-in-one app for
apprentices to build a digital portfolio, revise, prepare for End-Point
Assessment (EPA), and track progress, across any apprenticeship standard.

This is a **from-scratch functional prototype**, not a production build. It's
meant to demonstrate the dynamic course engine and core screens end-to-end so
you have something real to run, extend, and push to GitHub.

## What's included

- **Dynamic course engine** — courses are plain JSON files (`src/data/courses/`).
  Adding a new apprenticeship standard means dropping in a new JSON file and
  adding one import line in `src/data/coursesIndex.js` — no other app code
  changes.
- **3 bundled courses**, built from the published standards:
  - Bricklayer (ST0095 v1.2)
  - Carpentry and Joinery — Site Carpenter pathway (ST0264 v1.4)
  - Carpentry and Joinery — Architectural Joiner pathway (ST0264 v1.4)
- **Home dashboard** — XP, overall progress, daily goal, achievements, EPA
  gateway readiness.
- **Assignments** — photo evidence (image picker), activity statements, and
  per-KSB question responses; exportable as a PDF.
- **Academy** — modules with quizzes and resource lists; passing a quiz (≥70%)
  awards a certificate and XP.
- **KSB Matrix** — every Knowledge/Skill/Behaviour in the standard, whether
  it's been evidenced yet, and which assignments/modules map to it. Filter to
  "Gaps only" to see what's left before Gateway.
- **Documents** — every exported assignment PDF, stored and re-shareable.
- **Settings** — profile, notification toggle, and enrolling in / switching
  between courses.

Progress, profile, and documents persist locally on-device via
`@react-native-async-storage/async-storage` — there's no backend in this
prototype (see "Not included" below).

## Getting started

Requires Node.js 18+ and the Expo Go app (iOS/Android) or an emulator.

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go, or press `i` / `a` for an iOS/Android
simulator, or `w` for web.

> This was written and syntax-checked in an environment without network
> access, so `npm install` has not been run against it here — if you hit a
> version mismatch, run `npx expo install --fix` after installing.

## Project structure

```
App.js                      Root: wraps navigation in the two context providers
src/
  data/
    coursesIndex.js          Course engine entry point — register courses here
    courses/*.json           One file per apprenticeship standard/pathway
  context/
    CourseEngineContext.js   Enrolled courses + active course selection
    ProgressContext.js       Per-course progress, XP, achievements, documents
  navigation/
    AppNavigator.js          Bottom tabs + stacks
  screens/                   One file per screen
  components/                 Reusable UI: ProgressBar, XPBadge, KsbChip, QuizCard
  utils/
    storage.js               AsyncStorage read/write helpers
    xp.js                    XP amounts, achievement rules, progress %, gateway logic
    pdfExport.js             Builds assignment evidence HTML → PDF → share sheet
```

## Course JSON schema

Every file in `src/data/courses/` follows this shape:

```jsonc
{
  "courseId": "bricklayer-st0095-v1-2",
  "title": "Bricklayer",
  "standardCode": "ST0095",
  "version": "1.2",
  "level": 2,
  "pathway": null,                 // e.g. "Site Carpenter" for multi-pathway standards
  "route": "Construction and the built environment",
  "typicalDurationMonths": 30,
  "ksbs": {
    "knowledge": [{ "code": "K1", "text": "..." }],
    "skills":    [{ "code": "S1", "text": "..." }],
    "behaviours":[{ "code": "B1", "text": "..." }]
  },
  "assignments": [
    {
      "id": "bricklayer-st0095-v1-2-a1",
      "order": 1,
      "title": "Health & Safety",
      "ksbs": ["S1", "S2", "K1", "K2", "K3", "B1"],
      "activities": [
        { "type": "photo_evidence", "prompt": "...", "minPhotos": 1 },
        { "type": "activity_statement", "prompt": "...", "minWords": 150 },
        { "type": "question", "ksbCode": "K1", "prompt": "...", "responseType": "text" }
      ],
      "exportable": true,
      "exportFormat": "pdf"
    }
  ],
  "academy": {
    "modules": [
      {
        "id": "...-mod-...-a1",
        "title": "Health & Safety",
        "linkedAssignmentId": "...-a1",
        "quiz": [{ "id": "...", "type": "multiple_choice", "stem": "...", "options": ["..."], "correctIndex": 0, "linkedKsbs": ["K1"] }],
        "resources": [{ "id": "...", "title": "...", "type": "video", "url": "" }],
        "certificateOnCompletion": true
      }
    ]
  },
  "practicalAssessments": [ { "id": "...", "title": "...", "linkedKsbs": ["S1", "..."] } ],
  "ksbMatrix": { "K1": { "assignments": ["...-a1"], "academyModules": ["...-mod-...-a1"] } },
  "gatewayReadiness": {
    "requiredAssignments": ["..."],
    "requiredAcademyModules": ["..."],
    "requiredPracticalAssessments": ["..."]
  }
}
```

To add a fourth standard: build a JSON file in this shape, save it under
`src/data/courses/`, import it in `coursesIndex.js`, and add it to
`ALL_COURSES`. Every screen in the app reads from this generic shape, so
nothing else needs to change.

## Known gaps / what's NOT included

This is a prototype, so the following are deliberately out of scope and would
need work before any real deployment:

- **No backend / accounts.** Everything is local to the device via
  AsyncStorage. There's no sync across devices, no auth, and no way for a
  tutor/employer to view a learner's portfolio remotely.
- **Quiz questions are auto-generated drafts** (flagged `"generated": true` in
  the JSON) — simple recall questions built from the KSB text, not reviewed
  for pedagogical quality or difficulty.
- **Academy resources are placeholders** (empty `url` fields) — titles are
  sensible guesses; no real videos/PDFs are attached.
- **PDF export is basic** — one HTML→PDF pass per assignment; no combined
  portfolio export, no watermarking/branding pass, no EPA report generator
  yet.
- **No Functional Skills content** — the Academy structure could hold it, but
  no Functional Skills modules have been written.
- **No push notifications** — the Settings toggle is stored but doesn't wire
  up to any actual notification scheduling yet.
- **Not tested against a real device/emulator** in this environment (no
  network access to install dependencies) — files are syntax- and
  bracket-balance-checked, not runtime-verified. Run `npx expo start` and
  fix anything Metro flags on first run.

## License

No license file included — add one (MIT, Apache-2.0, etc.) before making the
repository public if you want to set terms for reuse.
