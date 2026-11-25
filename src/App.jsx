import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { competitivePhotos, profile, projects, stackGroups } from './data/content.js';
import { translations } from './data/translations.js';

const HeroScene = lazy(() => import('./components/HeroScene.jsx'));

function useMotion(rtl) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let context;
    let cancelled = false;
    import('gsap').then(({ gsap }) => import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.utils.toArray('[data-reveal]').forEach((el) => gsap.fromTo(el,
          { y: 24, autoAlpha: 0.55 },
          { y: 0, autoAlpha: 1, duration: 0.75, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
        ));
        gsap.to('[data-parallax]', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
        gsap.utils.toArray('[data-rule]').forEach((el) => gsap.fromTo(el,
          { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, transformOrigin: rtl ? 'right' : 'left', duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } },
        ));
      });
    }));
    return () => { cancelled = true; context?.revert(); };
  }, [rtl]);
}

function Progress({ rtl }) {
  const progressRef = useRef(null);
  useEffect(() => {
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        progressRef.current?.style.setProperty('transform', `scaleX(${progress})`);
      });
    };
    let frame = 0;
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={progressRef} className="reading-progress" style={{ transformOrigin: rtl ? 'right' : 'left' }} />;
}

function LanguageSwitcher({ language, setLanguage, copy }) {
  return <div className="language-switch" role="group" aria-label={copy.language} dir="ltr">
    {['en', 'ar'].map((value) => <button
      type="button"
      key={value}
      lang={value}
      aria-pressed={language === value}
      className={language === value ? 'is-selected' : ''}
      onClick={() => setLanguage(value)}
    >{value.toUpperCase()}</button>)}
  </div>;
}

function Navigation({ language, setLanguage, copy, profile }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const update = () => {
      const sections = [...document.querySelectorAll('main section[id]')];
      const line = document.querySelector('.site-nav')?.getBoundingClientRect().bottom + 48 || 120;
      const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2;
      const current = (atBottom ? sections.at(-1) : sections.filter((section) => section.getBoundingClientRect().top <= line).at(-1)) || sections[0];
      if (current) setActive((previous) => previous === current.id ? previous : current.id);
    };
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [language]);
  return <header className="site-nav">
    <a href="#home" className="wordmark" aria-label={`${profile.name}, ${copy.nav[0][1]}`} onClick={() => setOpen(false)}><img src="/assets/mina-hany-mark.svg" alt="" /><span className="wordmark-label">MINA HANY</span></a>
    <nav id="primary-navigation" aria-label={copy.controls.navigation} className={open ? 'nav-list nav-list-open' : 'nav-list'}>
      {copy.nav.map(([id, label], index) => <a
        className={active === id ? 'is-active' : ''}
        aria-current={active === id ? 'location' : undefined}
        href={`#${id}`}
        key={id}
        onClick={() => { setOpen(false); setActive(id); }}
      ><span dir="ltr">{String(index + 1).padStart(2, '0')}</span>{label}</a>)}
    </nav>
    <LanguageSwitcher language={language} setLanguage={(value) => { setLanguage(value); setOpen(false); }} copy={copy} />
    <a href={profile.github} className="nav-github" target="_blank" rel="noreferrer" dir="ltr">GITHUB <ArrowUpRight size={14} /></a>
    <button className="nav-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? copy.controls.closeMenu : copy.controls.openMenu} aria-expanded={open} aria-controls="primary-navigation">{open ? <X /> : <Menu />}</button>
  </header>;
}

function Hero({ copy }) {
  return <section id="home" className="hero">
    <div className="hero-index mono"><span>{copy.hero.index}</span><span dir="ltr">{copy.hero.location}</span></div>
    <div className="hero-grid">
      <div className="hero-copy">
        <div className="identity-line"><span className="identity-dot" aria-hidden="true" /><span className="hero-name">{copy.hero.name}</span><span className="hero-role mono">{copy.hero.role}</span></div>
        <h1>{copy.hero.title.map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{index === 1 ? <span>{line}</span> : line}{index === copy.hero.title.length - 1 && <span className="blue-period">.</span>}</React.Fragment>)}</h1>
        <p className="hero-lede">{copy.hero.intro}</p>
        <div className="hero-links"><a href="#projects" className="link-primary">{copy.hero.work}<ArrowDown size={16} /></a><a href="#contact" className="link-secondary">{copy.hero.conversation}<ArrowUpRight size={15} /></a></div>
        <div className="hero-footer mono"><span>{copy.hero.footerLeft}</span><span>{copy.hero.footerRight}</span></div>
      </div>
      <div className="hero-art" data-parallax>
        <span className="hero-art-label mono">{copy.hero.artLabel}</span>
        <span className="hero-art-instruction mono">{copy.hero.dragHint}</span>
        <Suspense fallback={<div className="hero-scene-placeholder" aria-hidden="true" />}><HeroScene
          label={copy.hero.sceneLabel}
          stages={copy.hero.stages}
          stageLabel={copy.hero.stageLabel}
          stageStatus={copy.hero.stageStatus}
        /></Suspense>
        <span className="hero-art-caption mono" dir="ltr">{copy.hero.artCaption}</span>
      </div>
    </div>
    <div className="hero-lower mono"><span>{copy.hero.lowerLeft}</span><span>{copy.hero.lowerRight}</span></div>
  </section>;
}

function Chapter({ number, label, title, description }) {
  return <div className="chapter" data-reveal>
    <div className="chapter-meta mono"><span dir="ltr">{number}</span><span className="chapter-rule" data-rule /><span>{label}</span></div>
    <div className="chapter-copy"><h2>{title.map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{index === 1 ? <em>{line}</em> : line}</React.Fragment>)}</h2><p>{description}</p></div>
  </div>;
}

function About({ copy }) {
  return <section id="about" className="about-section wrap">
    <Chapter number="02" {...copy.chapters.about} />
    <div className="about-spread">
      <p className="about-statement" data-reveal>{copy.about.statement.map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{index === 1 ? <em>{line}</em> : line}</React.Fragment>)}</p>
      <div className="about-notes" data-reveal><p>{copy.about.paragraphs[0]}</p><p>{copy.about.paragraphs[1]}</p><span className="mono">{copy.about.note}</span></div>
    </div>
    <div className="about-ribbon mono">{copy.about.ribbon.map((item) => <span key={item}>{item}</span>)}</div>
  </section>;
}

function SystemMap({ copy }) {
  const [selected, setSelected] = useState(copy.architecture.components[0].id);
  const current = copy.architecture.components.find((step) => step.id === selected) || copy.architecture.components[0];
  useEffect(() => setSelected(copy.architecture.components[0].id), [copy]);
  return <section id="system" className="system-section">
    <div className="wrap system-inner">
      <Chapter number="03" {...copy.chapters.system} />
      <div className="architecture" data-reveal>
        <div className="architecture-heading"><span className="mono">{copy.architecture.eyebrow}</span><span className="architecture-caption">{copy.architecture.caption}</span></div>
        <div className="architecture-flow" role="group" aria-label={copy.controls.selectArchitecture}>
          {copy.architecture.components.map((step, index) => <React.Fragment key={step.id}>
            <button type="button" className={`architecture-node ${selected === step.id ? 'is-selected' : ''}`} aria-pressed={selected === step.id} onClick={() => setSelected(step.id)}>
              <span className="architecture-node-number mono" dir="ltr">{String(index + 1).padStart(2, '0')}</span>
              <span className="architecture-node-name">{step.name}</span>
              <span className="architecture-node-short">{step.short}</span>
            </button>
            {index < copy.architecture.components.length - 1 && <span className="architecture-connector" aria-hidden="true">{copy.architecture.flow[index]}<ArrowRight size={15} /></span>}
          </React.Fragment>)}
        </div>
        <article className="architecture-detail" aria-live="polite">
          <div className="architecture-detail-title"><span className="mono">{copy.architecture.connection}</span><h3>{current.name}<span>.</span></h3></div>
          <p>{current.detail}</p>
          <div className="architecture-handoff"><span><small>{copy.architecture.selected}</small>{current.input}</span><ArrowLeft size={17} aria-hidden="true" /><span><small>{copy.architecture.connection}</small>{current.output}</span></div>
        </article>
      </div>
      <div className="focus-strip">{copy.focusAreas.map(([number, title, description]) => <article className="focus-line" key={number} data-reveal><span className="mono" dir="ltr">{number}</span><h3>{title}</h3><p>{description}</p><span className="focus-mark" aria-hidden="true">↗</span></article>)}</div>
    </div>
  </section>;
}

function Stack({ language, copy }) {
  const [category, setCategory] = useState('frontend');
  const [selected, setSelected] = useState('React');
  const currentGroup = stackGroups.find((group) => group.id === category);
  const currentTech = currentGroup?.items.find((item) => item.name === selected) || currentGroup?.items[0];
  const categories = ['frontend', 'backend', 'database', 'security', 'tools'];
  useEffect(() => {
    const first = stackGroups.find((group) => group.id === category)?.items[0];
    if (first) setSelected(first.name);
  }, [category]);
  return <section id="stack" className="stack-section wrap">
    <Chapter number="04" {...copy.chapters.stack} />
    <div className="stack-explorer" data-reveal>
      <div className="stack-browser">
        <div className="stack-categories" role="tablist" aria-label={copy.controls.selectTechnology}>
          {categories.map((id, index) => <button type="button" key={id} role="tab" tabIndex={category === id ? 0 : -1} aria-selected={category === id} className={category === id ? 'is-selected' : ''} onKeyDown={(event) => {
            const step = language === 'ar' ? -1 : 1;
            let nextIndex;
            if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = categories.length - 1;
            else if (event.key === (step === 1 ? 'ArrowRight' : 'ArrowLeft')) nextIndex = (index + 1) % categories.length;
            else if (event.key === (step === 1 ? 'ArrowLeft' : 'ArrowRight')) nextIndex = (index - 1 + categories.length) % categories.length;
            if (nextIndex !== undefined) {
              event.preventDefault();
              setCategory(categories[nextIndex]);
              event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
            }
          }} onClick={() => setCategory(id)}>
            {copy.stack.categories[id]}<span dir="ltr">{String(index + 1).padStart(2, '0')}</span>
          </button>)}
        </div>
        <div className="stack-tech-list" role="tabpanel" aria-label={copy.stack.categories[category]}>
          {currentGroup?.items.map((item) => <button type="button" key={item.name} aria-pressed={selected === item.name} className={selected === item.name ? 'is-selected' : ''} onClick={() => setSelected(item.name)}>
            <span dir="ltr">{item.name}</span><span className="stack-status">{copy.stack.status[language][item.status === 'IN PROJECTS' ? 'project' : 'workflow']}</span><ArrowUpRight size={15} aria-hidden="true" />
          </button>)}
        </div>
      </div>
      <aside className="stack-detail" aria-live="polite">
        <span className="mono">{copy.stack.categories[category]} / {copy.stack.status[language][currentTech?.status === 'IN PROJECTS' ? 'project' : 'workflow']}</span>
        <h3 dir="ltr">{currentTech?.name}<span>.</span></h3>
        <p>{copy.stack.descriptions[currentTech?.name] || currentTech?.description}</p>
        <div className="stack-projects"><span className="mono">{copy.stack.projects}</span><div>{currentTech?.projects.map((project) => {
          const label = copy.githubSection.repositories.find((entry) => entry.name.toLowerCase().includes(project.id === 'quiz-app' ? 'quiz' : project.id))?.name || project.name;
          return <a href={`#${project.id}`} key={project.id}>{label}<ArrowUpRight size={13} aria-hidden="true" /></a>;
        })}</div></div>
      </aside>
    </div>
    <p className="stack-foot mono">{copy.stack.foot}</p>
    <p className="stack-scope-note">{copy.stack.scopeNote}</p>
  </section>;
}

function ScreenCapture({ project, projectCopy, linkCopy }) {
  return <figure className={`capture capture-${project.id}`} data-reveal>
    <div className="capture-chrome"><span className="chrome-dots" aria-hidden="true"><i /><i /><i /></span><span className="capture-url mono" dir="ltr">{project.live.replace('https://', '').replace(/\/$/, '')}</span><span className="capture-live mono">{linkCopy.capture}</span></div>
    <div className="capture-stage">
      <img className="capture-desktop" src={project.desktopImage} alt={`${project.name} ${linkCopy.desktopAlt}`} loading="lazy" decoding="async" />
      <div className="capture-phone"><img src={project.mobileImage} alt={`${project.name} ${linkCopy.mobileAlt}`} loading="lazy" decoding="async" /></div>
    </div>
    <figcaption className="capture-caption mono"><span>{projectCopy.screenshotLabel}</span><span>{projectCopy.screenshotNote}</span></figcaption>
  </figure>;
}

function ProjectLinks({ project, copy }) {
  return <div className="case-links">
    <a className="case-live" href={project.live} target="_blank" rel="noreferrer">{copy.live}<ArrowUpRight size={17} aria-hidden="true" /></a>
    {project.api && <a href={project.api} target="_blank" rel="noreferrer" dir="ltr">{copy.api}<ArrowUpRight size={15} aria-hidden="true" /></a>}
    {project.repositories.map((repo) => <a href={repo.url} target="_blank" rel="noreferrer" key={repo.label}>{repo.label.includes('Frontend') ? copy.frontend : repo.label.includes('Backend') ? copy.backend : copy.repo}<ArrowUpRight size={15} aria-hidden="true" /></a>)}
  </div>;
}

function NotelyDeepDive({ copy }) {
  return <div className="notely-deep-dive" data-reveal>
    <header className="deep-dive-heading"><span className="mono">{copy.caseStudy.title}</span><p>{copy.caseStudy.intro}</p></header>
    <ol className="auth-flow">{copy.caseStudy.flow.map((step, index) => <li key={step.title}>
      <span className="auth-flow-number mono" dir="ltr">{String(index + 1).padStart(2, '0')}</span>
      <div><h4>{step.title}</h4><p>{step.body}</p></div>
    </li>)}</ol>
    <h4 className="engineering-notes-title">{copy.caseStudy.detailsTitle}</h4>
    <div className="engineering-notes">{copy.caseStudy.details.map((item, index) => <article key={item.title}>
      <span className="mono" dir="ltr">{String(index + 1).padStart(2, '0')}</span><h5>{item.title}</h5><p>{item.body}</p>
    </article>)}</div>
    <p className="case-tradeoff">{copy.caseStudy.tradeoff}</p>
    <div className="source-links">
      <a href="https://documenter.getpostman.com/view/40072844/2sBYPv3XuH" target="_blank" rel="noreferrer">{copy.caseStudy.apiDocs}<ArrowUpRight size={14} /></a>
      <a href="https://github.com/MinaHany-s/NOTELY" target="_blank" rel="noreferrer">{copy.caseStudy.sourceBackend}<ArrowUpRight size={14} /></a>
      <a href="https://github.com/MinaHany-s/NOTELY-WEBSITE" target="_blank" rel="noreferrer">{copy.caseStudy.sourceFrontend}<ArrowUpRight size={14} /></a>
    </div>
  </div>;
}

function ProjectCase({ project, copy }) {
  const projectCopy = copy.projects[project.id];
  const linkCopy = copy.notelyLinks;
  return <article className={`case-study case-${project.id}`} id={project.id}>
    <header className="case-heading" data-reveal>
      <span className="case-number mono" dir="ltr">{project.number} / {linkCopy.selected}</span>
      <div className="case-title-wrap"><span className="case-label mono">{projectCopy.label}</span><h3 dir="ltr">{project.name}<span>.</span></h3></div>
      <p className="case-summary">{projectCopy.summary}</p>
    </header>
    <div className="case-spread">
      <ScreenCapture project={project} projectCopy={projectCopy} linkCopy={linkCopy} />
      <div className="case-notes" data-reveal><span className="mono case-kicker">{linkCopy.what}</span><ul>{projectCopy.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><div className="case-stack"><span className="mono">{linkCopy.built}</span><div>{project.stack.map((tool) => <span key={tool} dir="ltr">{tool}</span>)}</div></div><ProjectLinks project={project} copy={linkCopy} /></div>
    </div>
    {project.id === 'notely' && <NotelyDeepDive copy={copy} />}
  </article>;
}

function Projects({ copy }) {
  return <section id="projects" className="projects-section wrap">
    <Chapter number="05" {...copy.chapters.projects} />
    <div className="case-list">{projects.map((project) => <ProjectCase project={project} copy={copy} key={project.id} />)}</div>
  </section>;
}

function Decisions({ copy }) {
  return <section id="decisions" className="decisions-section">
    <div className="wrap decisions-inner">
      <header className="decisions-heading" data-reveal><span className="mono">{copy.decisions.eyebrow}</span><h2>{copy.decisions.title[0]}<br /><em>{copy.decisions.title[1]}</em></h2><p>{copy.decisions.intro}</p></header>
      <div className="decision-list">{copy.decisions.items.map((item, index) => <article className="decision" key={item.question} data-reveal>
        <span className="mono decision-number" dir="ltr">{String(index + 1).padStart(2, '0')}</span>
        <div className="decision-main"><h3>{item.question}</h3><div className="decision-grid"><p><b>{copy.decisions.labels.problem}</b>{item.problem}</p><p><b>{copy.decisions.labels.decision}</b>{item.decision}</p><p><b>{copy.decisions.labels.reason}</b>{item.reason}</p><p><b>{copy.decisions.labels.tradeoff}</b>{item.tradeoff}</p></div></div>
        <ArrowUpRight className="decision-mark" size={18} aria-hidden="true" />
      </article>)}</div>
    </div>
  </section>;
}

function Journey({ copy }) {
  return <section id="field-notes" className="journey-section wrap">
    <div className="journey-title" data-reveal><span className="mono">{copy.journey.eyebrow}</span><h2>{copy.journey.title[0]}<br /><em>{copy.journey.title[1]}</em></h2><p>{copy.journey.intro}</p></div>
    <div className="journey-list">{copy.journey.items.map((item, index) => <article key={item.title} data-reveal>
      <span className="mono" dir="ltr">{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3><p>{item.body}</p></div><a href={`#${item.project.toLowerCase().replace(' ', '-')}`} className="journey-project" dir="ltr">{item.project}<ArrowUpRight size={13} /></a>
    </article>)}</div>
  </section>;
}

function CompetitiveJourney({ copy, rtl }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedPhoto !== null && !dialog.open) dialog.showModal();
    else if (selectedPhoto === null && dialog.open) dialog.close();
  }, [selectedPhoto]);

  useEffect(() => {
    if (selectedPhoto === null) return undefined;
    const handleKeyDown = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? (rtl ? -1 : 1) : (rtl ? 1 : -1);
      setSelectedPhoto((current) => (current + step + competitivePhotos.length) % competitivePhotos.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, rtl]);

  const closeViewer = () => dialogRef.current?.close();
  const movePhoto = (step) => setSelectedPhoto((current) => (current + step + competitivePhotos.length) % competitivePhotos.length);
  const photoNumber = (index) => `${String(index + 1).padStart(2, '0')} / ${String(competitivePhotos.length).padStart(2, '0')}`;

  return <section id="competitive-programming" className="competitive-section">
    <div className="wrap competitive-inner">
      <div className="competitive-topline">
        <span className="mono">{copy.competitive.eyebrow}</span>
        <span className="mono" dir="ltr">ECPC / 05</span>
      </div>
      <div className="competitive-intro">
        <header className="competitive-heading" data-reveal>
          <h2 id="competitive-programming-title">{copy.competitive.title}</h2>
          <p>{copy.competitive.subtitle}</p>
        </header>
        <div className="competitive-story" data-reveal>
          {copy.competitive.story.map((paragraph) => <p key={paragraph} dir="auto">{paragraph}</p>)}
        </div>
      </div>
      <div className="competitive-experience" data-reveal>
        <div className="competitive-qualification">
          <span className="competitive-stamp mono" dir="ltr">ECPC</span>
          <div>
            <span className="mono competitive-kicker">{copy.competitive.experience}</span>
            <h3 dir="auto">{copy.competitive.highlights[0]}</h3>
            <p>{copy.competitive.highlights[1]}</p>
          </div>
        </div>
        <ul className="competitive-highlights" aria-label={copy.competitive.experience}>
          {copy.competitive.highlights.slice(2).map((highlight, index) => <li key={highlight}>
            <span className="mono" dir="ltr">{String(index + 1).padStart(2, '0')}</span>
            <span dir="auto">{highlight}</span>
          </li>)}
        </ul>
      </div>
      <div className="competitive-gallery-heading" data-reveal>
        <div>
          <span className="mono">{copy.competitive.galleryEyebrow}</span>
          <h3>{copy.competitive.galleryTitle}</h3>
        </div>
        <span className="competitive-gallery-total mono" dir="ltr">05 / 05</span>
      </div>
      <div className="competitive-gallery" role="group" aria-label={copy.competitive.galleryLabel}>
        {competitivePhotos.map((photo, index) => <figure className={`competitive-photo competitive-photo-${index + 1}`} key={photo.src} data-reveal>
          <button
            type="button"
            className="competitive-photo-open"
            aria-label={`${copy.competitive.openPhoto}: ${copy.competitive.photoLabels[index]}`}
            onClick={(event) => {
              returnFocusRef.current = event.currentTarget;
              setSelectedPhoto(index);
            }}
          >
            <img src={photo.src} width={photo.width} height={photo.height} loading="lazy" decoding="async" alt={copy.competitive.photoAlts[index]} />
            <span className="competitive-photo-zoom" aria-hidden="true"><ArrowUpRight size={17} /></span>
          </button>
          <figcaption>
            <span dir="auto">{copy.competitive.photoLabels[index]}</span>
            <span className="mono competitive-photo-count" dir="ltr">{photoNumber(index)}</span>
          </figcaption>
        </figure>)}
      </div>
    </div>
    <dialog
      className="competitive-lightbox"
      ref={dialogRef}
      aria-labelledby="competitive-lightbox-title"
      onClose={() => {
        setSelectedPhoto(null);
        returnFocusRef.current?.focus();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeViewer();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeViewer();
        }
      }}
    >
      {selectedPhoto !== null && <div className="competitive-lightbox-content">
        <div className="competitive-lightbox-top">
          <span id="competitive-lightbox-title" className="mono">{copy.competitive.dialogTitle}</span>
          <button type="button" className="competitive-lightbox-close" onClick={closeViewer} aria-label={copy.competitive.closeViewer}><X size={20} /></button>
        </div>
        <figure>
          <img
            src={competitivePhotos[selectedPhoto].src}
            width={competitivePhotos[selectedPhoto].width}
            height={competitivePhotos[selectedPhoto].height}
            decoding="async"
            alt={copy.competitive.photoAlts[selectedPhoto]}
          />
          <figcaption dir="auto">{copy.competitive.photoLabels[selectedPhoto]}</figcaption>
        </figure>
        <nav className="competitive-lightbox-controls" aria-label={copy.competitive.galleryControls}>
          <button type="button" onClick={() => movePhoto(-1)} aria-label={copy.competitive.previousPhoto}><ArrowLeft size={17} />{copy.competitive.previousPhoto}</button>
          <span><span className="mono">{copy.competitive.photoLabel}</span><b dir="ltr">{photoNumber(selectedPhoto)}</b></span>
          <button type="button" onClick={() => movePhoto(1)} aria-label={copy.competitive.nextPhoto}>{copy.competitive.nextPhoto}<ArrowRight size={17} /></button>
        </nav>
      </div>}
    </dialog>
  </section>;
}

function GitHubSection({ copy, profile }) {
  return <section id="github" className="github-section wrap">
    <header className="github-heading" data-reveal><span className="mono">{copy.githubSection.eyebrow}</span><h2>{copy.githubSection.title}</h2><p>{copy.githubSection.description}</p><a href={profile.github} target="_blank" rel="noreferrer" className="github-profile"><Github size={17} />{copy.githubSection.profile}<ArrowUpRight size={15} /></a></header>
    <div className="repository-list">{copy.githubSection.repositories.map((repo, index) => <a className="repository" href={repo.url} target="_blank" rel="noreferrer" key={repo.name} data-reveal>
      <span className="mono" dir="ltr">{String(index + 1).padStart(2, '0')}</span><div><h3 dir="auto">{repo.name}</h3><p>{repo.description}</p></div><ArrowUpRight size={17} aria-hidden="true" />
    </a>)}</div>
  </section>;
}

function ContactForm({ copy }) {
  const [state, handleSubmit] = useForm('xnpdwowv');
  return <form className="contact-form" onSubmit={handleSubmit} aria-busy={state.submitting}>
    <label>{copy.contact.name}<input type="text" name="name" autoComplete="name" required /><ValidationError className="contact-field-error" field="name" errors={state.errors} /></label>
    <label>{copy.contact.email}<input type="email" name="email" autoComplete="email" required /><ValidationError className="contact-field-error" field="email" errors={state.errors} /></label>
    <label className="contact-field-wide">{copy.contact.subject}<input type="text" name="subject" /><ValidationError className="contact-field-error" field="subject" errors={state.errors} /></label>
    <label className="contact-field-wide">{copy.contact.message}<textarea name="message" rows="5" required /><ValidationError className="contact-field-error" field="message" errors={state.errors} /></label>
    <button className="contact-submit contact-field-wide" type="submit" disabled={state.submitting}>
      {state.submitting ? copy.contact.sending : copy.contact.submit}<ArrowUpRight size={16} aria-hidden="true" />
    </button>
    {state.succeeded && <p className="contact-status contact-field-wide" role="status">{copy.contact.success}</p>}
    {state.errors && !state.succeeded && <p className="contact-status contact-field-wide" role="alert">{copy.contact.error}</p>}
  </form>;
}

function Contact({ copy, profile }) {
  return <section id="contact" className="contact-section">
    <div className="wrap contact-inner">
      <div className="contact-top mono"><span>{copy.contact.eyebrow}</span><span>{copy.contact.identity}</span></div>
      <div className="contact-main">
        <h2 data-reveal>{copy.contact.title.map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{index === copy.contact.title.length - 1 ? <span>{line}</span> : line}</React.Fragment>)}</h2>
        <div className="contact-side" data-reveal>
          <p>{copy.contact.intro}</p>
          <a href={`mailto:${profile.email}`} className="email-link" dir="ltr">{profile.email}<ArrowUpRight size={20} /></a>
          <div className="social-links"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a></div>
        </div>
      </div>
      <div className="contact-form-wrap" data-reveal>
        <ContactForm copy={copy} />
        <a className="cv-note" href={`mailto:${profile.email}?subject=${encodeURIComponent('CV request')}`}><Mail size={15} />{copy.contact.cv}<ArrowUpRight size={14} /></a>
      </div>
      <div className="contact-bottom mono"><span>{copy.contact.footerMotto}</span><a href="#home">{copy.contact.backTop}</a><span>© 2026</span></div>
    </div>
  </section>;
}

function Footer({ copy, profile }) {
  return <footer className="footer wrap"><a href="#home" className="footer-mark"><img src="/assets/mina-hany-mark.svg" alt="" />MINA HANY<span>—</span></a><span className="mono">{copy.footer.role}</span><a href={profile.github} target="_blank" rel="noreferrer" className="mono" dir="ltr">GITHUB ↗</a></footer>;
}

export default function App() {
  const [language, setLanguage] = useState(() => {
    try { return window.localStorage.getItem('portfolio-language') === 'ar' ? 'ar' : 'en'; }
    catch { return 'en'; }
  });
  const copy = translations[language];
  const rtl = language === 'ar';
  useMotion(rtl);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.title = copy.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta.description);
    document.querySelector('meta[property="og:site_name"]')?.setAttribute('content', copy.meta.title);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy.meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy.meta.description);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', rtl ? 'ar_EG' : 'en_US');
    document.querySelector('meta[property="og:image:alt"]')?.setAttribute('content', copy.meta.imageAlt);
    try { window.localStorage.setItem('portfolio-language', language); }
    catch { /* The language still works for this visit when storage is unavailable. */ }
  }, [language, rtl, copy]);
  return <>
    <Progress rtl={rtl} />
    <Navigation language={language} setLanguage={setLanguage} copy={copy} profile={profile} />
    <main>
      <Hero copy={copy} />
      <About copy={copy} />
      <SystemMap copy={copy} />
      <Stack language={language} copy={copy} />
      <Projects copy={copy} />
      <Decisions copy={copy} />
      <Journey copy={copy} />
      <CompetitiveJourney copy={copy} rtl={rtl} />
      <GitHubSection copy={copy} profile={profile} />
      <Contact copy={copy} profile={profile} />
    </main>
    <Footer copy={copy} profile={profile} />
  </>;
}
