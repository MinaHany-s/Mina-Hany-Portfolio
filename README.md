# Mina Hany — Systems Atlas

A React and Vite portfolio built around the invisible systems behind the web. The project showcase uses locally saved desktop and mobile captures from the three deployed public interfaces.

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

The contact form validates and prepares a message in the visitor's default email app. It does not claim delivery because this site has no email service or contact endpoint configured. There is no CV PDF in the project yet, so the portfolio offers an email link to request one rather than a placeholder download.

## Design system

The design tokens and responsive art direction live in `src/style.css`; Tailwind theme tokens are in `tailwind.config.js`. The interactive SVG network hero is in `src/components/HeroScene.jsx`; keeping it vector-based avoids a WebGL startup and large 3D runtime chunk. Scroll reveals and subtle parallax use GSAP and ScrollTrigger.
