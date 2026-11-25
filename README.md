# Mina Hany — Systems Atlas

A React and Vite portfolio built around the invisible systems behind the web. The project showcase uses locally saved desktop and mobile captures from the three deployed public interfaces; the large Cinemato captures are resized, compressed WebP assets.

## Run locally

```sh
npm install
npm run dev
```

Build with `npm run build` and preview with `npm run preview`.

## Edit content and links

Profile, project details, technology groups, screenshots, and outbound links are centralized in `src/data/content.js`. English and Arabic interface copy, project case-study details, and metadata are maintained in `src/data/translations.js`. The language preference is stored in localStorage; Arabic switches the document to RTL and uses IBM Plex Sans Arabic.

The Notely images show its publicly accessible sign-in screen; the authenticated notes workspace is not included in the captures.

The bilingual “Beyond the Code” section uses the five original ECPC photos in `public/assets/ECPCpics`. Its photo viewer supports keyboard navigation, Escape to close, and RTL-aware arrow keys.

The bilingual contact form submits directly to Formspree using the React integration and the configured form endpoint. A direct email link remains available. There is no CV PDF in the project yet, so the portfolio offers an email link to request one rather than a placeholder download.

## Design system

The design tokens and responsive art direction live in `src/style.css`; Tailwind theme tokens are in `tailwind.config.js`. The hero's Three.js request-flow model is lazy-loaded from `src/components/HeroScene3D.js`, with a custom SVG fallback for reduced-motion and unsupported-WebGL environments. Drag the request between API, service, and data layers, or use the keyboard-accessible layer buttons. The scene pauses when off-screen; scroll reveals and subtle parallax use GSAP and ScrollTrigger.
