# EMOTE4D Website — Build & Content Brief

> **Read this before changing the site.** It is the source of truth for structure,
> design, voice, and — most importantly — factual claims. If a claim is not in the
> "True facts" section below, do not put it on the site. Ask first. Never invent
> statistics, accuracy numbers, testimonials, or technical details.

---

## What EMOTE4D is (one sentence)

A privacy-first fall-detection system for elderly care that runs entirely on a small
device in the room and never stores or transmits video — it sees only an anonymous
stick figure.

## Who the site is for (audiences, in priority order)

1. **Care facilities (B2B2C)** — senior-living operators and their procurement, IT,
   and clinical leads. The strategically important buyer; the previous site ignored them.
2. **Families / caregivers (B2C)** — adult children protecting an aging parent.
3. **Evaluators & partners** — independent testers, the AgeTech ecosystem, investors
   (lighter touch; no dedicated page yet).

## Site structure (split by AUDIENCE, not topic)

- `/` — one clear idea, then a fork to "For families" and "For care facilities"
- `/families` — consumer/caregiver story, waitlist CTA
- `/facilities` — operator story (copy in `facilities.md`)
- `/technology` — privacy-by-architecture + how it works (copy in `technology.md`)
- `/about` — mission, team, pilot status
- `/contact` — keep the existing Formspree form, segmented by visitor type

Do not add pages (blog, pricing, investors, careers) until there is a distinct
audience AND real content. A thin page is worse than a missing one.

---

## Design system

**Goal:** calm, human, trustworthy, fast. It should look hand-built and editorial,
not like a generic AI-generated SaaS landing page.

**Palette** (starting point — one accent, warm neutrals, high contrast):
- Paper / background: `#FBF8F3` (warm ivory)
- Ink / primary text: `#1C1B19` (warm near-black, never pure #000)
- Primary accent: `#2F5D50` (deep pine green — health, calm, trust; not clinical blue, not startup orange). Use sparingly: CTAs, links, key marks.
- Warm accent (optional, rare): `#B8643E` (muted terracotta) for a single point of emphasis
- Neutrals: warm grays for secondary text and borders (e.g. `#6B6862`, `#E7E1D8`)

**Typography:**
- Headlines: a humanist serif (e.g. Fraunces or Newsreader) — warmth and trust, which suit eldercare far better than another all-Inter SaaS page.
- Body: a clean, readable sans (e.g. IBM Plex Sans or Public Sans). NOT default Inter everywhere.
- Generous line-height, a real type scale, clear hierarchy. Base font ≥ 18px.

**Layout:**
- Editorial. Left-aligned hero, intentional asymmetry, generous whitespace.
- No centered-everything. No glassmorphism, floating glass cards, or radial-glow gradient heroes.

**Hero visual (the centerpiece):**
- A clean SVG of a camera frame resolving into a simple stick-figure skeleton,
  captioned: *"This is everything the system ever sees."*
- This is the product's entire idea — make it the visual anchor. No pulse rings, no abstract 3D blobs.

**Motion & accessibility (hard requirements — audience skews older):**
- Base font ≥ 18px; WCAG AA contrast minimum; full keyboard navigation; semantic HTML; real alt text.
- Minimal JS. Respect `prefers-reduced-motion`. Motion only where it carries meaning.

---

## Voice & copy rules

- Plain, concrete, short sentences. Specificity over polish.
- Use real specifics: Neepawa and Brandon, Manitoba; the founder's actual voice.
- Honest beats impressive. State limitations where relevant; it builds trust with the buyers who matter.
- **Banned filler words:** "advanced", "cutting-edge", "powerful", "seamless",
  "revolutionary", "next-gen", "AI-powered" (as filler), "best-in-class".
- No emoji in headings or UI.

---

## True facts (single source of truth — never drift from this)

- **Hardware:** Raspberry Pi 5 + Raspberry Pi Camera Module 3 (NoIR / night-capable).
- **Software:** MediaPipe pose estimation running on-device, feeding a two-stage
  detection pipeline: (1) a machine-learning model screens motion for a fall, then
  (2) a separate verification step confirms the person is actually on the ground
  before any alert is sent. A backup timer can also flag a person who has remained
  down too long even if the primary step missed the event.
- **Privacy (the core differentiator):** no image is ever stored or transmitted. The
  device produces only an on-device stick figure. It IS a camera — say so honestly,
  and make the privacy architecture the reason that's not a problem.
- **No facial recognition.** The system does not identify people; it reads posture/motion.
- **Alerts:** SMS to designated caregivers/responders, after a short verification delay that reduces false alarms.
- **Stage:** pilot launching 2026, starting in Manitoba (Neepawa / Brandon). Pre-launch.
- **Team:** Yash Darji (Founder & CEO), Meet Patel (Co-founder), Bhavesh Patel (Advisor).
- **Facility claims must be framed as design intent, not validated results:** "designed
  against alert fatigue," "built to pass privacy review" — never "proven to reduce X."

### Never claim
- NVIDIA Jetson, or TensorFlow as the stack. (It's Raspberry Pi + MediaPipe.)
- "Novel," "superior accuracy," "9-state posture machine," or any specific accuracy/recall percentage.
- That there is no camera, or that it's "not a camera." (It is — that's fine, lead with the privacy architecture.)
- Any testimonial, customer logo, validated savings figure, or deployment outcome that has not actually happened.

---

## Deploy

- Astro + Tailwind, static output.
- Primary: GitHub Pages — **preserve the existing `CNAME` (emote4d.com)** via a GitHub Action build step.
- Fallback: Vercel.

## Process for contributors (incl. Claude Code)

1. Read this file first.
2. Build incrementally: design system + shared layout → Home → audience pages. Review each before moving on.
3. If you need a claim, number, or asset not in "True facts," ASK. Do not invent it. No lorem ipsum.
