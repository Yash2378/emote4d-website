# /technology — page copy

> Audience: technical and procurement evaluators (e.g. a facility IT lead, an
> independent tester), plus curious technical readers. Voice: precise, honest, no
> hype. Describes the system that actually ships. No accuracy numbers, no "novel,"
> no invented internals.

---

## Hero

**Headline:** Privacy by architecture, not by policy.

**Subhead:** Most monitoring systems ask you to trust how they handle your video.
EMOTE4D is built so there's no video to handle in the first place.

---

## Section 1 — What the system actually sees

A camera in the room captures a frame. On the device, that frame is turned into a
stick figure — a set of body points — and the original image is discarded immediately.
The stick figure is all the rest of the system ever works with.

Because the conversion happens on the device and the image never leaves it, there is no
recording to store, no stream to intercept, and no cloud copy to secure. Privacy isn't
a setting you enable or a promise in a contract — it's a consequence of how the system
is built.

*[Build: pair this section with the hero stick-figure visual — the camera frame
resolving into the skeleton, captioned "this is everything the system ever sees."]*

---

## Section 2 — How detection works

EMOTE4D uses a two-stage pipeline, both stages running on the device:

1. **Screen.** A machine-learning model watches the stick figure's motion over time
   and flags movement that looks like a fall.
2. **Verify.** Before anyone is alerted, a separate step checks the result against the
   physical reality of a fall — is the person actually on the ground, horizontal, and
   still? A flag that doesn't hold up is dropped.

Splitting detection from verification is deliberate: it's what keeps a sudden movement,
a dropped object, or a tracking glitch from becoming a false alarm. A backup timer adds
a second safety net — if someone has been on the ground longer than they should be, the
system can raise an alert even when the first step didn't catch the moment of the fall.

When a fall is confirmed, designated caregivers get an SMS, after a short delay that
gives the system a final chance to stand down.

---

## Section 3 — It runs at the edge

Everything above happens on a small computer in the room — a Raspberry Pi — not in a
data center. The system works offline and doesn't depend on a cloud service staying
online to keep watching. Running at the edge is also what makes the privacy model
possible: the data never has anywhere else to go.

The camera is night-capable, so the system keeps working in a dark bedroom — where some
of the most serious falls happen.

---

## Section 4 — What we deliberately don't do

- **We don't store or transmit video.** There is no footage, anywhere.
- **We don't identify people.** No facial recognition — the system reads posture and
  motion, not who you are.
- **We don't depend on the cloud for safety.** The core detection runs locally and
  works offline.
- **We don't require a wearable.** Nothing for a resident to charge, wear, or refuse.

---

## Section 5 — How we talk about performance

Fall detection has a well-documented honesty problem: numbers that look excellent in a
lab routinely collapse in real homes and care settings. We take that seriously. EMOTE4D
is in pilot, we're measuring performance in real conditions — night, clutter, real
movement — and we plan to put the system through independent third-party testing rather
than rely on our own figures. When we publish results, we'll report the raw numbers and
the limitations alongside them. If you're evaluating us, hold us to that.

**CTA:** Questions about the architecture? Get in touch → /contact

---

*Copy note for the build: do not add accuracy/recall percentages, "novel," "9-state,"
"proprietary CNN," or "NVIDIA Jetson" anywhere on this page. Section 5 is a feature, not
a disclaimer — for a technical evaluator, demonstrated epistemic honesty is itself a
differentiator against competitors who quote inflated lab numbers.*
