import React from 'react';

const nodes = [[82,112],[170,67],[248,119],[350,84],[430,144],[115,226],[220,205],[322,239],[406,208],[82,340],[184,365],[284,325],[389,359],[458,300]];
const edges = [[0,1],[1,2],[2,3],[3,4],[0,5],[1,6],[2,6],[2,7],[3,8],[4,8],[5,6],[6,7],[7,8],[5,9],[5,10],[6,10],[6,11],[7,11],[8,12],[8,13],[9,10],[10,11],[11,12],[12,13],[1,5],[3,7],[4,7],[0,6],[2,8],[6,12]];

export default function HeroScene() {
  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--tilt-x', `${-y * 5}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${x * 6}deg`);
  };
  const resetPointer = (event) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return <div
    className="hero-scene"
    aria-label="An interactive network diagram representing a web request"
    role="img"
    onPointerMove={handlePointerMove}
    onPointerLeave={resetPointer}
  >
    <svg className="scene-fallback-art" viewBox="0 0 520 430" aria-hidden="true">
      <circle cx="260" cy="215" r="172" fill="none" stroke="#2153E7" strokeOpacity=".11" />
      <circle cx="260" cy="215" r="128" fill="none" stroke="#e05a38" strokeOpacity=".08" strokeDasharray="2 8" />
      <g stroke="#2153E7" strokeOpacity=".36" strokeWidth=".8">{edges.map(([a,b],i)=><line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />)}</g>
      <g>{nodes.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%5===2?4:2.2} fill={i%5===2?'#e05a38':'#2153E7'} fillOpacity={i%5===2?'.95':'.72'} />)}</g>
      <circle cx="220" cy="205" r="7" fill="#e05a38" />
      <circle cx="350" cy="84" r="6" fill="#151a19" />
    </svg>
  </div>;
}
