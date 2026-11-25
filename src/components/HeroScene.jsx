import React, { useEffect, useRef, useState } from 'react';

const fallbackPositions = [[276, 178], [356, 282], [407, 382]];

function StaticModel({ stageIndex, onTokenPointerDown, onTokenPointerMove, onTokenPointerUp }) {
  const [x, y] = fallbackPositions[stageIndex];
  return <svg className="hero-scene-fallback" viewBox="0 0 640 520" aria-hidden="true">
    <defs>
      <linearGradient id="hero-panel" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#1c2a3a" />
        <stop offset="1" stopColor="#101721" />
      </linearGradient>
      <radialGradient id="hero-core">
        <stop stopColor="#8be7ff" stopOpacity=".9" />
        <stop offset="1" stopColor="#2979ff" stopOpacity="0" />
      </radialGradient>
      <filter id="hero-glow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
    <ellipse cx="320" cy="425" rx="202" ry="33" fill="#2875ff" opacity=".12" filter="url(#hero-glow)" />
    <g fill="none" stroke="#5c8fff" strokeWidth="2" opacity=".65">
      <path d="M170 166 294 228 440 303" />
      <path d="M164 184 288 246 434 321" strokeDasharray="3 9" opacity=".55" />
    </g>
    <g>
      <path d="m75 157 167-67 171 62-169 73z" fill="#25364a" stroke="#82a8ff" strokeOpacity=".7" />
      <path d="m75 157 169 68v32L75 188z" fill="#111a24" stroke="#6385c7" strokeOpacity=".55" />
      <path d="m244 225 169-73v32l-169 73z" fill="url(#hero-panel)" stroke="#6385c7" strokeOpacity=".55" />
      <path d="m177 270 146-58 150 55-148 63z" fill="#1e3340" stroke="#82e6d3" strokeOpacity=".75" />
      <path d="m177 270 148 60v32l-148-61z" fill="#111a20" stroke="#6bd8c5" strokeOpacity=".5" />
      <path d="m325 330 148-63v32l-148 63z" fill="#14232a" stroke="#6bd8c5" strokeOpacity=".5" />
      <path d="m247 369 117-47 120 44-119 52z" fill="#342b2b" stroke="#ff9b72" strokeOpacity=".8" />
      <path d="m247 369 118 49v30l-118-48z" fill="#17191d" stroke="#e98a6d" strokeOpacity=".55" />
      <path d="m365 418 119-52v30l-119 52z" fill="#211d20" stroke="#e98a6d" strokeOpacity=".55" />
    </g>
    <g fill="url(#hero-core)">
      <circle cx="244" cy="169" r="44" />
      <circle cx="325" cy="283" r="48" />
      <circle cx="365" cy="390" r="44" />
    </g>
    <g fill="#a9d8ff">
      <circle cx="244" cy="169" r="7" />
      <circle cx="325" cy="283" r="8" fill="#8ef0dd" />
      <circle cx="365" cy="390" r="7" fill="#ffb28e" />
      <circle cx="190" cy="116" r="3" />
      <circle cx="214" cy="126" r="3" />
      <circle cx="238" cy="136" r="3" />
      <circle cx="373" cy="285" r="3" />
      <circle cx="395" cy="275" r="3" />
    </g>
    <g
      className="hero-scene-token"
      transform={`translate(${x} ${y})`}
      onPointerDown={onTokenPointerDown}
      onPointerMove={onTokenPointerMove}
      onPointerUp={onTokenPointerUp}
      onPointerCancel={onTokenPointerUp}
    >
      <circle r="20" fill="#438dff" opacity=".22" filter="url(#hero-glow)" />
      <circle r="10" fill="#94d5ff" fillOpacity=".28" stroke="#d7f2ff" strokeWidth="1.5" />
      <circle r="4" fill="#effbff" />
    </g>
  </svg>;
}

export default function HeroScene({ label, stages, stageLabel, stageStatus }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const sceneControlsRef = useRef(null);
  const requestedStageRef = useRef(0);
  const fallbackDragRef = useRef({ active: false, start: 0 });
  const [stageIndex, setStageIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    let context;
    try {
      context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return undefined;
    }
    if (!context) return undefined;

    let cancelled = false;
    let disposeScene = () => {};
    import('./HeroScene3D.js').then(({ createHeroScene }) => {
      if (cancelled) return;
      const controls = createHeroScene({
        host,
        canvas,
        context,
        pointer: pointerRef,
        initialStage: requestedStageRef.current,
        onStageChange: (index) => {
          requestedStageRef.current = index;
          setStageIndex(index);
        },
      });
      if (controls) {
        sceneControlsRef.current = controls;
        disposeScene = controls.dispose;
        setReady(true);
      }
    }).catch((error) => {
      if (!cancelled) console.warn('Hero 3D scene failed to load; showing the static scene instead.', error);
    });

    return () => {
      cancelled = true;
      disposeScene();
      sceneControlsRef.current = null;
    };
  }, []);

  const moveToStage = (index) => {
    requestedStageRef.current = index;
    setStageIndex(index);
    sceneControlsRef.current?.moveToStage(index);
  };

  const getFallbackStage = (event) => {
    const svg = event.currentTarget.ownerSVGElement;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const localPoint = point.matrixTransform(matrix.inverse());
    const nearest = fallbackPositions.reduce((closest, position, index) => {
      const distance = (localPoint.x - position[0]) ** 2 + (localPoint.y - position[1]) ** 2;
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: -1, distance: Infinity });
    return nearest.distance < 90 ** 2 ? nearest.index : null;
  };
  const handleFallbackPointerDown = (event) => {
    if (ready) return;
    event.preventDefault();
    fallbackDragRef.current = { active: true, start: requestedStageRef.current };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handleFallbackPointerMove = (event) => {
    if (!fallbackDragRef.current.active) return;
    const index = getFallbackStage(event);
    if (index === null || index === requestedStageRef.current) return;
    requestedStageRef.current = index;
    setStageIndex(index);
  };
  const handleFallbackPointerUp = (event) => {
    if (!fallbackDragRef.current.active) return;
    const index = getFallbackStage(event);
    const target = index === null ? fallbackDragRef.current.start : index;
    fallbackDragRef.current.active = false;
    moveToStage(target);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    };
  };

  const resetPointer = () => {
    pointerRef.current = { x: 0, y: 0 };
  };

  return <div className="hero-scene-assembly">
    <div
      ref={hostRef}
      className={`hero-scene${ready ? ' is-ready' : ''}`}
      role="img"
      aria-label={label}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <StaticModel
        stageIndex={stageIndex}
        onTokenPointerDown={handleFallbackPointerDown}
        onTokenPointerMove={handleFallbackPointerMove}
        onTokenPointerUp={handleFallbackPointerUp}
      />
      <canvas ref={canvasRef} className="hero-scene-canvas" aria-hidden="true" />
    </div>
    <div className="hero-stage-controls" role="group" aria-label={stageLabel} dir="ltr">
      {stages.map((stage, index) => <button
        type="button"
        key={stage}
        aria-pressed={stageIndex === index}
        className={stageIndex === index ? 'is-selected' : ''}
        onClick={() => moveToStage(index)}
      ><span className="hero-stage-number">{String(index + 1).padStart(2, '0')}</span>{stage}</button>)}
    </div>
    <span className="hero-stage-status" aria-live="polite">{stageStatus} {stages[stageIndex]}</span>
  </div>;
}
