# Where to put your media

Everything is wired to these exact filenames. Drop a file in and it appears —
no code changes. Anything missing falls back cleanly, so a half-filled folder
never looks broken.

```
assets/
  hero/
    hero-desktop.jpg    ← STILL key art for the Press Start screen (760px+)
    hero-mobile.jpg     ← STILL key art for phones (portrait crop)
    hero.mp4            ← video for the menu screen onward (landscape)
    hero-mobile.mp4     ← optional portrait video cut, used under 760px
    hero.webm           ← optional, smaller, Chrome/Firefox prefer it
  fighters/
    slasher.png         ← portrait art, one per archetype
    stoic.png
    joker.png
    sleeper.png
    slasher.mp4         ← optional looping portrait, used on the result screen
    stoic.mp4
    joker.mp4
    sleeper.mp4
```

## Hero stills

The Press Start screen holds a single frame, the way a console title screen
opens on key art. It drifts slowly (a held-camera Ken Burns move) and picks up a
rain layer, vignette and grain — **all applied in CSS**, so ship the clean
original. Don't pre-darken or pre-texture the file; the page will over-darken it.

- `hero-desktop.jpg` — landscape or square-ish, ~2400px wide. Subject sits right
  of centre; the left half carries the headline.
- `hero-mobile.jpg` — portrait crop, ~1400×2000. Subject high in the frame, since
  the lockup sits across the middle.
- JPG, quality ~80. Keep each under ~600KB.

## Hero video

- **8–15 seconds, seamless loop.** It plays forever behind the title screen.
- **No audio track.** Strip it — it saves weight and the video is muted anyway.
- **Under ~3MB.** Most visitors arrive from Instagram on cellular.
- **Graded dark, low contrast.** Type sits on top of it. Anything bright or busy
  in the lower-left will fight the headline.
- **Keep the subject in the right third** on the landscape cut. The left is where
  the lockup lives.
- Landscape `hero.mp4` gets center-cropped hard on a phone. If that loses the
  shot, add `hero-mobile.mp4` as a 9:16 cut and it swaps automatically under
  760px.

Export: H.264 MP4, 1920×1080 (landscape) / 1080×1920 (portrait), CRF ~24.

## Fighter portraits

- **3:4 portrait**, roughly 900×1200, PNG or JPG.
- Framed head-and-shoulders to mid-torso, subject centered.
- **They need to read as a silhouette.** Before you get your result, each card
  shows the art flattened to a flat dark shape — so a distinct outline (hood,
  stance, shoulders) matters more than surface detail.
- Keep backgrounds dark or transparent; the card sits on near-black.

## Optional fighter video

If you have a short loop per archetype, drop `slasher.mp4` etc. alongside the
PNGs and the result screen plays it instead of the still. Same rules as the hero:
3–8s seamless loop, no audio, under 2MB, 3:4 framing. The PNG stays as the poster
frame, so always ship both.
