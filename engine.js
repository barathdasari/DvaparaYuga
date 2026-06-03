// engine.js — D3 simulation, rendering, zoom, drag
// Depends on: characters.js, unions.js loaded first

// ── Module-level state ────────────────────────────────────────────────────────
let svg, mainG, simulation, zoomBehavior;
let gNodes, gLinks, gEra;
let graphNodes = [], graphLinks = [];
let selectedId = null;
let pinnedIds   = new Set();
let hiddenIds   = new Set();

const GEN_SPACING = 180;  // more vertical breathing room
const CLAN_X = { Divine:0.50, Kuru:0.28, Yadava:0.72, Panchala:0.18, Gandhara:0.62, Madra:0.82 };
let SEED_W = 1200;

const ERAS = [
  { gen:0,  label:"Primordial",      sub:"The First Creation" },
  { gen:1,  label:"Lunar Origin",    sub:"Chandra's Descent" },
  { gen:3,  label:"Pururavas Era",   sub:"First Mortal Kings" },
  { gen:6,  label:"Yayati Era",      sub:"Chandravamsha Splits" },
  { gen:8,  label:"Puru–Bharata",    sub:"The Great Empire" },
  { gen:10, label:"Kuru Founding",   sub:"Hastinapura Rises" },
  { gen:12, label:"Shantanu Era",    sub:"Bhishma's Vow" },
  { gen:14, label:"Kuru Court",      sub:"War Generation Born" },
  { gen:15, label:"Mahabharata War", sub:"Dvapara Yuga Ends" },
  { gen:16, label:"Post-War",        sub:"Kali Yuga Dawns" },
  { gen:17, label:"Kuru Twilight",   sub:"Parikshit's Reign" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const getW  = () => document.getElementById('cw').clientWidth  || 900;
const getH  = () => document.getElementById('cw').clientHeight || 700;
const nodeR = d => d.importance === 'high' ? 34 : d.importance === 'medium' ? 24 : 15;
const lSize = d => d.importance === 'high' ? 12 : d.importance === 'medium' ? 11 : 10;

function nodeColors(d) {
  if (d.avatar || d.clan === 'Divine')
    return { fill:'url(#grad-divine)', stroke:'#FBBF24' };
  if (d.gender === 'female')
    return { fill:'url(#grad-female)', stroke:'#FDA4CF' };
  if (d.gender === 'other')
    return { fill:'url(#grad-sage)',   stroke:'#6EE7B7' };
  return   { fill:'url(#grad-male)',   stroke:'#93B4FC' };
}

function linkClass(d) {
  if (d.role === 'child') return 'cl';
  const t = d.linkType;
  if (t === 'niyoga')  return 'nl';
  if (t === 'divine')  return 'dl';
  if (t === 'yajna')   return 'yl';
  return 'ml';
}

function unionDiamondColor(t) {
  if (t === 'niyoga')  return '#7C3AED';
  if (t === 'divine')  return '#0EA5E9';
  if (t === 'yajna')   return '#059669';
  if (t === 'svayambhu') return '#6B7280';
  return '#D97706';
}

function allegianceClass(a) {
  if (a === 'Pandava') return 'pa';
  if (a === 'Kaurava') return 'pk';
  return 'pn';
}

// ── Build graph data from characters + unions ─────────────────────────────────
function buildGraphData() {
  graphNodes = [];
  graphLinks = [];

  // Character nodes
  characters.forEach(c => {
    graphNodes.push({ ...c, type:'character' });
  });

  // Union nodes + links
  unions.forEach(u => {
    const pA = charMap[u.partnerA];
    const pB = u.partnerB ? charMap[u.partnerB] : null;
    const genA = pA ? pA.gen : 0;
    const genB = pB ? pB.gen : genA;
    const uGen = (genA + genB) / 2 + 0.38;
    const uClan = pA ? pA.clan : 'Kuru';

    graphNodes.push({
      id: u.id, type:'union', unionType: u.type,
      gen: uGen, clan: uClan,
      partnerA: u.partnerA, partnerB: u.partnerB,
      importance:'low'
    });

    if (pA) graphLinks.push({ source:u.partnerA, target:u.id, linkType:u.type, role:'partner' });
    if (pB) graphLinks.push({ source:u.partnerB, target:u.id, linkType:u.type, role:'partner' });

    u.children.forEach(cid => {
      if (charMap[cid]) graphLinks.push({ source:u.id, target:cid, linkType:'child', role:'child' });
    });
  });
}

// ── SVG defs: gradients + filters ────────────────────────────────────────────
function initDefs() {
  const defs = svg.append('defs');

  function radGrad(id, c1, c2) {
    const g = defs.append('radialGradient').attr('id', id).attr('cx','38%').attr('cy','32%');
    g.append('stop').attr('offset','0%').attr('stop-color', c1);
    g.append('stop').attr('offset','100%').attr('stop-color', c2);
  }
  radGrad('grad-male',   '#6690FF', '#3B5FF5');
  radGrad('grad-female', '#F06090', '#D42870');
  radGrad('grad-divine', '#FFBA45', '#C47800');
  radGrad('grad-sage',   '#2DD4A0', '#059669');

  // Node drop shadow
  const ns = defs.append('filter').attr('id','node-shadow')
    .attr('x','-30%').attr('y','-30%').attr('width','160%').attr('height','160%');
  ns.append('feDropShadow').attr('dx',0).attr('dy',3)
    .attr('stdDeviation',4).attr('flood-color','rgba(60,40,120,0.18)');

  // Divine glow filter
  const gf = defs.append('filter').attr('id','glow-divine')
    .attr('x','-60%').attr('y','-60%').attr('width','220%').attr('height','220%');
  gf.append('feGaussianBlur').attr('in','SourceGraphic').attr('stdDeviation','5').attr('result','blur');
  const fm = gf.append('feMerge');
  fm.append('feMergeNode').attr('in','blur');
  fm.append('feMergeNode').attr('in','SourceGraphic');

  // Pin glow filter
  const pf = defs.append('filter').attr('id','glow-pin')
    .attr('x','-40%').attr('y','-40%').attr('width','180%').attr('height','180%');
  pf.append('feGaussianBlur').attr('in','SourceGraphic').attr('stdDeviation','4').attr('result','blur');
  const pm = pf.append('feMerge');
  pm.append('feMergeNode').attr('in','blur');
  pm.append('feMergeNode').attr('in','SourceGraphic');
}

// Era bands — very subtle alternating fills drawn in SVG (behind nodes)
function drawEraBands() {
  gEra.selectAll('*').remove();
  ERAS.forEach((era, i) => {
    const y0 = era.gen * GEN_SPACING + 60;
    const y1 = i < ERAS.length - 1
      ? ERAS[i+1].gen * GEN_SPACING + 60
      : y0 + GEN_SPACING * 2;
    gEra.append('rect')
      .attr('x', -5000).attr('y', y0)
      .attr('width', 10000).attr('height', y1 - y0)
      .attr('fill', i % 2 === 0 ? 'rgba(108,79,191,0.03)' : 'transparent');
  });
}

// ── D3 simulation ─────────────────────────────────────────────────────────────
function initSimulation() {
  simulation = d3.forceSimulation(graphNodes)
    .force('link', d3.forceLink(graphLinks).id(d => d.id)
      .distance(d => d.role === 'partner' ? 55 : 70)
      .strength(d => d.role === 'partner' ? 0.6 : 0.45))
    .force('charge', d3.forceManyBody()
      .strength(d => d.type === 'union' ? -40 : -260))
    .force('genY', d3.forceY(d => d.gen * GEN_SPACING + 100)
      .strength(d => d.type === 'union' ? 0.65 : 0.92))
    .force('clanX', d3.forceX(d => {
      const clan = d.type === 'union'
        ? (charMap[d.partnerA] ? charMap[d.partnerA].clan : 'Kuru')
        : d.clan;
      return (CLAN_X[clan] || 0.5) * Math.max(getW(), 900);
    }).strength(0.42))
    .force('collide', d3.forceCollide(d =>
      d.type === 'union' ? 18 : nodeR(d) + 20))
    .alphaDecay(0.014)
    .velocityDecay(0.38);
    // tick registered in DOMContentLoaded after buildGraph() to avoid empty selections
}

// ── Drag behavior ─────────────────────────────────────────────────────────────
function makeDrag() {
  return d3.drag()
    .on('start', (e, d) => {
      if (!e.active) simulation.alphaTarget(0.2).restart();
      d.fx = d.x; d.fy = d.y;
    })
    .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
    .on('end', (e, d) => {
      if (!e.active) simulation.alphaTarget(0);
      d.fx = e.x; d.fy = e.y;
      d.pinned = true;
      pinnedIds.add(d.id);
      d3.select(`#node-${CSS.escape(d.id)} .pin-ring`).style('display', null);
      if (selectedId === d.id) document.getElementById('btnUpin').style.display = '';
    });
}

function unpinNode(d) {
  d.fx = null; d.fy = null; d.pinned = false;
  pinnedIds.delete(d.id);
  d3.select(`#node-${CSS.escape(d.id)} .pin-ring`).style('display', 'none');
  document.getElementById('btnUpin').style.display = 'none';
  simulation.alphaTarget(0.1).restart();
  setTimeout(() => simulation.alphaTarget(0), 1200);
}
window.unpinSelectedNode = () => { if (selectedId) unpinNode(charMap[selectedId]); };

// ── Build + render graph ──────────────────────────────────────────────────────
function buildGraph() {
  // Clear layers
  gEra.selectAll('*').remove();
  gLinks.selectAll('*').remove();
  gNodes.selectAll('*').remove();

  drawEraBands();

  // Links — bezier paths for clean, intentional curves
  gLinks.selectAll('path.link')
    .data(graphLinks)
    .join('path')
    .attr('class', d => `link ${linkClass(d)}`);

  // Node groups
  const nodeGs = gNodes.selectAll('g.node')
    .data(graphNodes, d => d.id)
    .join(enter => {
      const ng = enter.append('g')
        .attr('class', d => `node ${d.type}`)
        .attr('id', d => `node-${d.id}`);

      // ── Character nodes ──
      ng.filter(d => d.type === 'character').each(function(d) {
        const s  = d3.select(this);
        const r  = nodeR(d);
        const cl = nodeColors(d);

        if (d.chiranjeevi) {
          s.append('circle').attr('r', r + 7)
            .attr('fill','none').attr('stroke','#10B981')
            .attr('stroke-width', 1.5).attr('stroke-dasharray','4,3')
            .attr('class','cpulse');
        }
        if (d.avatar) {
          s.append('circle').attr('r', r + 5)
            .attr('fill','none').attr('stroke','#FDE68A')
            .attr('stroke-width', 1).attr('class','dglow');
        }
        // Pin ring (hidden)
        s.append('circle').attr('r', r + 4)
          .attr('fill','none').attr('stroke','#EF4444')
          .attr('stroke-width', 2).attr('class','pin-ring')
          .style('display','none');
        // Main circle with drop-shadow
        s.append('circle').attr('r', r)
          .attr('fill', cl.fill).attr('stroke', cl.stroke)
          .attr('stroke-width', d.importance === 'high' ? 2.5 : 2)
          .attr('filter','url(#node-shadow)');
        // Glass sheen — white highlight arc on top-left
        s.append('ellipse')
          .attr('cx', -r * 0.22).attr('cy', -r * 0.32)
          .attr('rx', r * 0.48).attr('ry', r * 0.28)
          .attr('fill','rgba(255,255,255,0.38)')
          .style('pointer-events','none');
        // Name label — all nodes; low uses first name only, smaller
        s.append('text').attr('dy', r + 15)
          .attr('text-anchor','middle').attr('class','node-label')
          .text(d.importance === 'low' ? d.name.split(' ')[0] : d.name)
          .style('font-family',"'Outfit', sans-serif")
          .style('font-size', lSize(d) + 'px')
          .style('font-weight', d.importance === 'high' ? '700' : '600')
          .style('fill','#1A1A2E')
          .style('pointer-events','none')
          .style('letter-spacing','0.02em')
          .style('text-shadow','0 1px 3px rgba(255,255,255,0.8)');
        // Sanskrit sub-label (high importance only)
        if (d.importance === 'high' && d.sanskrit) {
          s.append('text').attr('dy', r + 28)
            .attr('text-anchor','middle').attr('class','node-deva')
            .text(d.sanskrit)
            .style('font-family',"'Noto Serif Devanagari', serif")
            .style('font-size','9px')
            .style('fill','#8888AA')
            .style('opacity','0.8')
            .style('pointer-events','none');
        }
        // Divine filter
        if (d.avatar || d.clan === 'Divine') {
          s.select('circle:nth-child(' + (d.chiranjeevi ? (d.avatar ? 4 : 3) : (d.avatar ? 3 : 2)) + ')')
            .attr('filter','url(#glow-divine)');
        }
      });

      // ── Union nodes (diamond) ──
      ng.filter(d => d.type === 'union').each(function(d) {
        d3.select(this).append('rect')
          .attr('width', 9).attr('height', 9)
          .attr('x', -4.5).attr('y', -4.5)
          .attr('transform','rotate(45)')
          .attr('fill', unionDiamondColor(d.unionType))
          .attr('stroke','var(--bg-panel)').attr('stroke-width', 1.2);
      });

      return ng;
    });

  // Event bindings
  nodeGs.filter(d => d.type === 'character')
    .call(makeDrag())
    .on('click',       (e, d) => { e.stopPropagation(); onSelectChar(d); })
    .on('dblclick',    (e, d) => { e.stopPropagation(); onDblClick(d); })
    .on('contextmenu', (e, d) => { e.preventDefault(); unpinNode(d); })
    .on('mouseover',   (e, d) => showTip(e, d))
    .on('mouseout',    ()     => hideTip());

  nodeGs.filter(d => d.type === 'union')
    .on('mouseover', (e, d) => showUnionTip(e, d))
    .on('mouseout',  ()     => hideTip());

  // Click on background deselects
  svg.on('click', () => onSelectChar(null));
}

// ── Bezier path generator ─────────────────────────────────────────────────────
function bezierPath(d) {
  const sx = d.source.x || 0, sy = d.source.y || 0;
  const tx = d.target.x || 0, ty = d.target.y || 0;
  if (d.role === 'partner') {
    // Gentle horizontal arc between spouses — curves upward
    const mx = (sx + tx) / 2;
    const arc = Math.min(Math.abs(tx - sx) * 0.25, 40);
    return `M${sx},${sy} C${sx},${sy - arc} ${tx},${ty - arc} ${tx},${ty}`;
  }
  // S-curve for parent → child (vertical)
  const my = (sy + ty) / 2;
  return `M${sx},${sy} C${sx},${my} ${tx},${my} ${tx},${ty}`;
}

// ── Tick: update positions ────────────────────────────────────────────────────
function tick() {
  gLinks.selectAll('path.link').attr('d', bezierPath);
  gNodes.selectAll('g.node')
    .attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function showTip(e, d) {
  const tip = document.getElementById('tip');
  const ttN = document.getElementById('ttN');
  const ttE = document.getElementById('ttE');
  const b   = document.getElementById('ttB');
  if (!tip || !ttN || !ttE || !b) return;
  ttN.textContent = d.name;
  ttE.textContent = d.epithet || '';
  b.innerHTML = '';
  if (d.allegiance && d.allegiance !== 'Pre-war' && d.allegiance !== 'Divine') {
    const cls = d.allegiance === 'Pandava' ? 'tbdg-p' : d.allegiance === 'Kaurava' ? 'tbdg-k' : 'tbdg-n';
    b.innerHTML = `<span class="tbdg ${cls}">${d.allegiance}</span>`;
  }
  if (d.chiranjeevi) b.innerHTML += `<span class="tbdg" style="background:rgba(16,185,129,.12);color:#10B981;border:1px solid rgba(16,185,129,.25)">♾ Immortal</span>`;
  positionTip(e);
  tip.classList.add('on');
}
function showUnionTip(e, d) {
  const labels = { marriage:'Marriage', niyoga:'Niyoga', divine:'Divine Boon', yajna:'Yajna Birth', svayambhu:'Lineage (mother unnamed)' };
  document.getElementById('tip').innerHTML =
    `<span class="tut" style="color:${unionDiamondColor(d.unionType)};font-style:normal;font-weight:600">${labels[d.unionType]||d.unionType}</span>`;
  positionTip(e);
  document.getElementById('tip').classList.add('on');
}
function positionTip(e) {
  const tip = document.getElementById('tip');
  tip.style.left = (e.clientX + 14) + 'px';
  tip.style.top  = (e.clientY - 10) + 'px';
}
function hideTip() { document.getElementById('tip').classList.remove('on'); }

// ── Collapse / Expand ─────────────────────────────────────────────────────────
function getDescendants(id) {
  const visited = new Set(), queue = [id];
  while (queue.length) {
    const cur = queue.shift();
    (childrenOf[cur] || []).forEach(cid => {
      if (!visited.has(cid)) { visited.add(cid); queue.push(cid); }
    });
  }
  return visited;
}

function onDblClick(d) {
  const desc = getDescendants(d.id);
  const allHidden = [...desc].every(id => hiddenIds.has(id));
  desc.forEach(id => allHidden ? hiddenIds.delete(id) : hiddenIds.add(id));
  applyVisibility();
}

function applyVisibility() {
  gNodes.selectAll('g.node').style('display', d => {
    if (d.type === 'union') return null;
    return hiddenIds.has(d.id) ? 'none' : null;
  });
  gLinks.selectAll('line.link').style('display', d => {
    const srcId = d.source.id || d.source;
    const tgtId = d.target.id || d.target;
    return (hiddenIds.has(srcId) || hiddenIds.has(tgtId)) ? 'none' : null;
  });
}

// ── Filter: clan + allegiance ─────────────────────────────────────────────────
let activeClan = 'All', activeAllegiance = null;

function applyFilters() {
  gNodes.selectAll('g.node').style('opacity', d => {
    if (d.type === 'union') return null;
    const clanOk = activeClan === 'All' || d.clan === activeClan;
    const allegOk = !activeAllegiance || d.allegiance === activeAllegiance;
    return (clanOk && allegOk) ? 1 : 0.1;
  });
  gLinks.selectAll('line.link').style('opacity', d => {
    if (activeClan === 'All' && !activeAllegiance) return null;
    const srcId = d.source.id || d.source;
    const tgtId = d.target.id || d.target;
    const sn = charMap[srcId], tn = charMap[tgtId];
    const clanOk = activeClan === 'All' ||
      (sn && sn.clan === activeClan) || (tn && tn.clan === activeClan);
    return clanOk ? 0.55 : 0.06;
  });
}
window.applyFilters = applyFilters;
window.getActiveClan = () => activeClan;
window.setActiveClan = v => { activeClan = v; applyFilters(); };
window.getActiveAllegiance = () => activeAllegiance;
window.setActiveAllegiance = v => { activeAllegiance = v; applyFilters(); };

// ── Lineage trace ─────────────────────────────────────────────────────────────
let lineageActive = false;
function traceLineage(id) {
  if (!id) return clearLineage();
  lineageActive = true;
  // Gather all ancestors and descendants
  const related = new Set([id]);
  // Ancestors
  const aQueue = [id];
  while (aQueue.length) {
    const cur = aQueue.shift();
    (parentOf[cur] || []).forEach(uid => {
      const u = unionMap[uid];
      if (u) {
        [u.partnerA, u.partnerB].filter(Boolean).forEach(pid => {
          if (!related.has(pid)) { related.add(pid); aQueue.push(pid); }
        });
      }
    });
  }
  // Descendants
  const dQueue = [id];
  while (dQueue.length) {
    const cur = dQueue.shift();
    (childrenOf[cur] || []).forEach(cid => {
      if (!related.has(cid)) { related.add(cid); dQueue.push(cid); }
    });
  }

  gLinks.selectAll('path.link')
    .classed('lhl', d => {
      const s = d.source.id || d.source, t = d.target.id || d.target;
      return related.has(s) || related.has(t);
    });
  gNodes.selectAll('g.node')
    .style('opacity', d => related.has(d.id) || d.type === 'union' ? 1 : 0.08);
}
function clearLineage() {
  lineageActive = false;
  gLinks.selectAll('path.link').classed('lhl', false);
  gNodes.selectAll('g.node').style('opacity', null);
  applyFilters();
}
window.traceLineage  = traceLineage;
window.clearLineage  = clearLineage;

// ── Selection highlight ───────────────────────────────────────────────────────
function setHighlight(id) {
  gNodes.selectAll('g.node')
    .classed('node-hl', d => d.id === id);
}
window.onSelectChar = function(d) {
  if (!d) {
    selectedId = null;
    setHighlight(null);
    if (lineageActive) clearLineage();
    window.closeInsp && window.closeInsp();
    return;
  }
  selectedId = d.id;
  setHighlight(d.id);
  window.openInspector && window.openInspector(d);
};

// ── Era ruler — HTML overlay synced to zoom ───────────────────────────────────
function initEraRuler() {
  const ruler = document.getElementById('eraRuler');
  if (!ruler) return;
  ruler.innerHTML = '';
  ERAS.forEach(era => {
    const tick = document.createElement('div');
    tick.className = 'era-tick';
    tick.id = `era-${era.gen}`;
    tick.innerHTML = `<div class="era-pill">${era.label}</div><div class="era-line"></div>`;
    ruler.appendChild(tick);
  });
}

function updateEraRuler(transform) {
  const cwRect = document.getElementById('cw').getBoundingClientRect();
  ERAS.forEach(era => {
    const el = document.getElementById(`era-${era.gen}`);
    if (!el) return;
    const yScreen = era.gen * GEN_SPACING * transform.k + transform.y + 100 * transform.k;
    if (yScreen < -20 || yScreen > cwRect.height + 20) {
      el.style.display = 'none';
    } else {
      el.style.display = 'flex';
      el.style.top = yScreen + 'px';
    }
  });
}

// ── Zoom controls ─────────────────────────────────────────────────────────────
function initZoom() {
  zoomBehavior = d3.zoom().scaleExtent([0.08, 5])
    .on('zoom', e => {
      mainG.attr('transform', e.transform);
      updateEraRuler(e.transform);
    });
  svg.call(zoomBehavior).on('dblclick.zoom', null);
  doResetView(false);
}
function zoomIn()  { svg.transition().duration(280).call(zoomBehavior.scaleBy, 1.35); }
function zoomOut() { svg.transition().duration(280).call(zoomBehavior.scaleBy, 0.74); }
function doResetView(anim) {
  const W = Math.max(getW(), 900), H = Math.max(getH(), 600);
  // Show generations 6–15 (Yayati through Mahabharata War) centred
  const focusGen = 10;
  const scale = 0.72;
  const cx = (CLAN_X['Kuru'] * SEED_W + CLAN_X['Yadava'] * SEED_W) / 2;
  const cy = focusGen * GEN_SPACING + 100;
  const t = d3.zoomIdentity
    .translate(W / 2 - cx * scale, H / 2 - cy * scale)
    .scale(scale);
  (anim ? svg.transition().duration(700) : svg).call(zoomBehavior.transform, t);
}
window.zoomIn    = zoomIn;
window.zoomOut   = zoomOut;
window.resetView = function() { doResetView(true); };

// ── Focus on node (from search) ───────────────────────────────────────────────
window.focusNode = function(id) {
  const n = graphNodes.find(d => d.id === id);
  if (!n || n.x == null) return;
  const scale = 1.4;
  const tx = getW() / 2 - n.x * scale;
  const ty = getH() / 2 - n.y * scale;
  svg.transition().duration(650).call(
    zoomBehavior.transform,
    d3.zoomIdentity.translate(tx, ty).scale(scale)
  );
  setTimeout(() => window.onSelectChar && window.onSelectChar(n), 680);
};

// ── Stats counters ────────────────────────────────────────────────────────────
function updateStats() {
  const chars = characters || [];
  document.getElementById('totalCount').textContent       = chars.length;
  document.getElementById('generationCount').textContent  = new Set(chars.map(c=>c.gen)).size;
  document.getElementById('chiranjeeviCount').textContent = chars.filter(c=>c.chiranjeevi).length;
  document.getElementById('divineCount').textContent      = chars.filter(c=>c.clan==='Divine'||c.avatar).length;
}

// Theme sync no-op (light only)
window.syncSVGTheme = function() {};

// ── Main init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  try {
    buildGraphData();

    // ── CRITICAL: seed positions BEFORE simulation so D3 doesn't reset to (0,0)
    // Use window.innerWidth as reference — flex clientWidth may be 0 at DOMContentLoaded
    SEED_W = Math.max(window.innerWidth - 280, 900);
    const SEED_H = Math.max(window.innerHeight - 60, 700);
    graphNodes.forEach(d => {
      const clan = d.type === 'union'
        ? (charMap[d.partnerA] ? charMap[d.partnerA].clan : 'Kuru')
        : d.clan;
      d.x = (CLAN_X[clan] || 0.5) * SEED_W + (Math.random() - 0.5) * 160;
      d.y = d.gen * GEN_SPACING + 100 + (Math.random() - 0.5) * 40;
    });

    svg    = d3.select('#canvas').attr('width', SEED_W).attr('height', SEED_H);
    mainG  = svg.append('g').attr('class', 'main-g');
    gEra   = mainG.append('g').attr('class', 'era-layer');
    gLinks = mainG.append('g').attr('class', 'link-layer');
    gNodes = mainG.append('g').attr('class', 'node-layer');

    initDefs();
    initSimulation();
    buildGraph();
    initEraRuler();
    initZoom();
    updateStats();

    // Hide loader via flag — avoids flaky namespace removal
    let loaderGone = false;
    const origTick = tick;
    simulation.on('tick', function() {
      origTick();
      if (!loaderGone && simulation.alpha() < 0.18) {
        loaderGone = true;
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 480);
      }
    });
    // Safety fallback — always hide loader after 4s
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 480); }
    }, 4000);

  } catch(err) {
    console.error('[v3 init error]', err);
    // Still hide loader so user sees whatever rendered
    setTimeout(() => {
      const l = document.getElementById('loader');
      if (l) l.style.display = 'none';
    }, 1200);
  }

  // Handle resize
  window.addEventListener('resize', () => {
    svg.attr('width', getW()).attr('height', getH());
    simulation.force('clanX').x(d => {
      const clan = d.type === 'union'
        ? (charMap[d.partnerA] ? charMap[d.partnerA].clan : 'Kuru')
        : d.clan;
      return (CLAN_X[clan] || 0.5) * getW();
    });
    simulation.alpha(0.3).restart();
  });

}); // end DOMContentLoaded
