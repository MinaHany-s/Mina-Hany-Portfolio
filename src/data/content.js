export const profile = {
  name: 'Mina Hany',
  role: 'Aspiring Backend Engineer · Full-Stack Developer',
  location: 'Egypt',
  intro: 'I build full-stack applications and follow the request beyond the screen: into the routes, sessions, data, and decisions that make a product work.',
  email: 'minahany0001@gmail.com',
  github: 'https://github.com/MinaHany-s',
  linkedin: 'https://www.linkedin.com/in/mina--hany/',
};

export const projects = [
  {
    id: 'notely', number: '01', name: 'NOTELY', label: 'Full-stack · Authentication · Security',
    summary: 'A full-stack note-taking application and a hands-on study in the systems around a sign-in flow: token lifecycles, session handling, and layered security.',
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Mongoose'],
    features: ['JWT authentication and authorization', 'Access and refresh tokens with rotation', 'HTTP-only cookies and secure cookie settings', 'Express sessions stored in MongoDB', 'CSRF defenses, CAPTCHA, and login rate limiting', 'Password hashing and email validation'],
    desktopImage: '/assets/projects/notely-signin-desktop.png',
    mobileImage: '/assets/projects/notely-signin-mobile.png',
    screenshotLabel: 'Live capture · public sign-in screen',
    screenshotNote: 'The deployed site opens at sign-in; its notes workspace requires an authenticated account.',
    repositories: [
      { label: 'Frontend repository', url: 'https://github.com/MinaHany-s/NOTELY-WEBSITE' },
      { label: 'Backend repository', url: 'https://github.com/MinaHany-s/NOTELY' },
    ],
    live: 'https://notelyy-drab.vercel.app/',
    api: 'https://notely-five-pied.vercel.app/',
  },
  {
    id: 'cinemato', number: '02', name: 'CINEMATO', label: 'React · TypeScript · TMDB API',
    summary: 'A responsive movie and series discovery experience built around TMDB, with browsing, search, title details, trailers, and locally saved favorites.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'React Router', 'Axios', 'TMDB API', 'Vite'],
    features: ['Browse trending, popular, and top-rated titles', 'Search movies and series', 'Open title details and available trailers', 'Add or remove favorites saved in Local Storage', 'Responsive layouts'],
    desktopImage: '/assets/projects/cinemato-home-desktop.webp',
    mobileImage: '/assets/projects/cinemato-home-mobile.webp',
    screenshotLabel: 'Live capture · discovery home',
    screenshotNote: 'Desktop + responsive capture',
    repositories: [{ label: 'GitHub repository', url: 'https://github.com/MinaHany-s/Cinemato' }],
    live: 'https://cinemato-five.vercel.app/',
  },
  {
    id: 'quiz-app', number: '03', name: 'QUIZ APP', label: 'React · TypeScript · Open Trivia DB',
    summary: 'An interactive quiz app that lets you configure a round, fetches multiple-choice questions from Open Trivia DB, and responds as you answer.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'React Router', 'Axios', 'Open Trivia DB API'],
    features: ['Choose question count, category, and difficulty', 'Fetch multiple-choice trivia questions', 'Get instant feedback on answers', 'Review the final score and results'],
    desktopImage: '/assets/projects/quiz-setup-desktop.png',
    mobileImage: '/assets/projects/quiz-setup-mobile.png',
    screenshotLabel: 'Live capture · quiz setup screen',
    screenshotNote: 'Desktop + responsive capture',
    repositories: [{ label: 'GitHub repository', url: 'https://github.com/MinaHany-s/Quiz-app' }],
    live: 'https://quiz-app-phi-one.vercel.app/',
  },
];

export const competitivePhotos = [
  { src: '/assets/ECPCpics/main.jpg', width: 1320, height: 890 },
  { src: '/assets/ECPCpics/pic1.jpg', width: 1080, height: 720 },
  { src: '/assets/ECPCpics/pic2.jpg', width: 960, height: 1280 },
  { src: '/assets/ECPCpics/pic3.jpg', width: 1280, height: 960 },
  { src: '/assets/ECPCpics/pic4.jpg', width: 1080, height: 720 },
];

export const stackGroups = [
  { id: 'frontend', label: '01', title: 'Frontend', items: [
    { name: 'React', status: 'IN PROJECTS', description: 'Builds interactive interfaces across the featured applications.', projects: [{ id: 'notely', name: 'NOTELY' }, { id: 'cinemato', name: 'CINEMATO' }, { id: 'quiz-app', name: 'QUIZ APP' }] },
    { name: 'TypeScript', status: 'IN PROJECTS', description: 'Adds typed components and data handling in the discovery and trivia apps.', projects: [{ id: 'cinemato', name: 'CINEMATO' }, { id: 'quiz-app', name: 'QUIZ APP' }] },
    { name: 'JavaScript', status: 'IN PROJECTS', description: 'Implements application behavior across the full-stack notes app and React projects.', projects: [{ id: 'notely', name: 'NOTELY' }, { id: 'cinemato', name: 'CINEMATO' }, { id: 'quiz-app', name: 'QUIZ APP' }] },
    { name: 'Tailwind CSS', status: 'IN PROJECTS', description: 'Styles responsive interfaces in the three featured applications.', projects: [{ id: 'notely', name: 'NOTELY' }, { id: 'cinemato', name: 'CINEMATO' }, { id: 'quiz-app', name: 'QUIZ APP' }] },
    { name: 'React Router', status: 'IN PROJECTS', description: 'Handles client-side routes in the discovery and quiz applications.', projects: [{ id: 'cinemato', name: 'CINEMATO' }, { id: 'quiz-app', name: 'QUIZ APP' }] },
    { name: 'Axios', status: 'IN PROJECTS', description: 'Makes API requests for movie data, trivia questions, and NOTELY services.', projects: [{ id: 'notely', name: 'NOTELY' }, { id: 'cinemato', name: 'CINEMATO' }, { id: 'quiz-app', name: 'QUIZ APP' }] },
  ] },
  { id: 'backend', label: '02', title: 'Backend', items: [
    { name: 'Node.js', status: 'IN PROJECTS', description: 'Runs the server-side application and request handling for NOTELY.', projects: [{ id: 'notely', name: 'NOTELY' }] },
    { name: 'Express.js', status: 'IN PROJECTS', description: 'Structures the NOTELY API through routers and middleware.', projects: [{ id: 'notely', name: 'NOTELY' }] },
    { name: 'REST APIs', status: 'IN PROJECTS', description: 'Connects projects to backend services and external data sources.', projects: [{ id: 'notely', name: 'NOTELY' }, { id: 'cinemato', name: 'CINEMATO' }, { id: 'quiz-app', name: 'QUIZ APP' }] },
  ] },
  { id: 'database', label: '03', title: 'Database', items: [
    { name: 'MongoDB', status: 'IN PROJECTS', description: 'Persists notes, application records, and authentication sessions for NOTELY.', projects: [{ id: 'notely', name: 'NOTELY' }] },
    { name: 'Mongoose', status: 'IN PROJECTS', description: 'Defines and queries MongoDB data models in NOTELY.', projects: [{ id: 'notely', name: 'NOTELY' }] },
    { name: 'Local Storage', status: 'IN PROJECTS', description: 'Keeps favorite titles available between visits in CINEMATO.', projects: [{ id: 'cinemato', name: 'CINEMATO' }] },
  ] },
  { id: 'security', label: '04', title: 'Authentication & Security', items: [
    { name: 'JWT access tokens', status: 'IN PROJECTS', description: 'Short-lived access JWTs authorize protected API requests in NOTELY.', projects: [{ id: 'notely', name: 'NOTELY' }] },
    { name: 'Refresh token rotation', status: 'IN PROJECTS', description: 'NOTELY replaces refresh tokens on use and stores token hashes in MongoDB sessions.', projects: [{ id: 'notely', name: 'NOTELY' }] },
    { name: 'HTTP-only cookies', status: 'IN PROJECTS', description: 'NOTELY keeps refresh tokens out of JavaScript using secure, HttpOnly cookies.', projects: [{ id: 'notely', name: 'NOTELY' }] },
    { name: 'Express sessions', status: 'IN PROJECTS', description: 'NOTELY stores CAPTCHA challenge state in a Mongo-backed session store.', projects: [{ id: 'notely', name: 'NOTELY' }] },
    { name: 'bcrypt password hashing', status: 'IN PROJECTS', description: 'NOTELY uses the user model’s password comparison flow for credential verification.', projects: [{ id: 'notely', name: 'NOTELY' }] },
    { name: 'CSRF defenses', status: 'IN PROJECTS', description: 'NOTELY combines SameSite cookie settings and trusted-origin checks on cookie-authenticated auth endpoints; note APIs use bearer access tokens.', projects: [{ id: 'notely', name: 'NOTELY' }] },
    { name: 'CAPTCHA & rate limiting', status: 'IN PROJECTS', description: 'NOTELY applies CAPTCHA checks and endpoint-specific request limits to login and registration.', projects: [{ id: 'notely', name: 'NOTELY' }] },
  ] },
  { id: 'tools', label: '05', title: 'Development Tools', items: [
    { name: 'Git & GitHub', status: 'PROJECT WORKFLOW', description: 'The featured applications are maintained in the linked public repositories.', projects: [{ id: 'notely', name: 'NOTELY' }, { id: 'cinemato', name: 'CINEMATO' }, { id: 'quiz-app', name: 'QUIZ APP' }] },
    { name: 'Postman', status: 'PROJECT WORKFLOW', description: 'Used while developing and checking API requests during backend project work.', projects: [{ id: 'notely', name: 'NOTELY' }] },
    { name: 'Vite', status: 'IN PROJECTS', description: 'Development and build tooling for the portfolio and CINEMATO.', projects: [{ id: 'cinemato', name: 'CINEMATO' }] },
    { name: 'VS Code', status: 'PROJECT WORKFLOW', description: 'The code editor used to build and maintain these applications.', projects: [{ id: 'notely', name: 'NOTELY' }, { id: 'cinemato', name: 'CINEMATO' }, { id: 'quiz-app', name: 'QUIZ APP' }] },
  ] },
];

