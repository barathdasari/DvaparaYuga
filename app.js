// app.js — Inspector, search, filters, theme, modals
// Depends on: characters.js, unions.js, engine.js

// ── Mobile menu ───────────────────────────────────────────────────────────────
function toggleMobileMenu() {
  const lp = document.getElementById('lp');
  const bd = document.getElementById('mobileBackdrop');
  const open = lp.classList.toggle('mobile-open');
  bd.classList.toggle('visible', open);
}
function closeMobileMenu() {
  document.getElementById('lp').classList.remove('mobile-open');
  document.getElementById('mobileBackdrop').classList.remove('visible');
}
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu  = closeMobileMenu;

// Close left panel when user taps a search result or clan button on mobile
function isMobile() { return window.innerWidth <= 768; }

// ── Inspector ─────────────────────────────────────────────────────────────────
const BANNER_COLORS = {
  Pandava:  'linear-gradient(135deg, #2251CC 0%, #3B7BF5 100%)',
  Kaurava:  'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
  Neutral:  'linear-gradient(135deg, #6C4FBF 0%, #9B72F0 100%)',
  Divine:   'linear-gradient(135deg, #C47800 0%, #F5A623 100%)',
  'Pre-war':'linear-gradient(135deg, #0D7A5F 0%, #26C6A0 100%)',
};

const CLAN_COLORS = {
  Kuru:    { bg:'rgba(59,130,246,.15)',  color:'#3B82F6',  border:'rgba(59,130,246,.3)'  },
  Yadava:  { bg:'rgba(245,158,11,.15)', color:'#D97706',  border:'rgba(245,158,11,.3)'  },
  Panchala:{ bg:'rgba(239,68,68,.15)',  color:'#EF4444',  border:'rgba(239,68,68,.3)'   },
  Gandhara:{ bg:'rgba(139,92,246,.15)', color:'#8B5CF6',  border:'rgba(139,92,246,.3)'  },
  Madra:   { bg:'rgba(20,184,166,.15)', color:'#14B8A6',  border:'rgba(20,184,166,.3)'  },
  Divine:  { bg:'rgba(217,119,6,.15)',  color:'#D97706',  border:'rgba(217,119,6,.3)'   },
};

const AVATAR_ICONS = {
  male:    'fa-solid fa-person',
  female:  'fa-solid fa-person-dress',
  other:   'fa-solid fa-yin-yang',
};
const AVATAR_DIVINE_ICON = 'fa-solid fa-star';

function openInspector(d) {
  document.getElementById('nosel').style.display  = 'none';
  document.getElementById('pv').style.display     = 'flex';
  document.getElementById('insp').classList.add('open');

  // Banner
  const banner = document.getElementById('pb');
  banner.style.background = BANNER_COLORS[d.allegiance] || BANNER_COLORS.Neutral;

  // Avatar
  const av   = document.getElementById('pav');
  const icon = document.getElementById('pavico');
  const cl   = CLAN_COLORS[d.clan] || CLAN_COLORS.Divine;
  av.style.background = cl.bg;
  av.style.border     = `3px solid var(--bg-panel)`;
  av.style.boxShadow  = `0 4px 20px rgba(0,0,0,.28), 0 0 0 2px ${cl.border}`;
  icon.className = d.avatar ? AVATAR_DIVINE_ICON : (AVATAR_ICONS[d.gender] || AVATAR_ICONS.other);
  icon.style.color = cl.color;

  // Clan badge
  const cb = document.getElementById('pclanb');
  cb.textContent        = d.clan;
  cb.style.background   = cl.bg;
  cb.style.color        = cl.color;
  cb.style.borderColor  = cl.border;

  // Names
  document.getElementById('pname').textContent = d.name;
  const skEl = document.getElementById('psk');
  skEl.textContent    = d.sanskrit || '';
  skEl.style.display  = d.sanskrit ? '' : 'none';
  const epEl = document.getElementById('pep');
  epEl.textContent    = d.epithet ? `"${d.epithet}"` : '';
  epEl.style.display  = d.epithet ? '' : 'none';

  // Badges
  const bdDiv = document.getElementById('bdDiv');
  if (d.avatar) {
    bdDiv.style.display = '';
    document.getElementById('pInc').textContent = d.avatar;
  } else {
    bdDiv.style.display = 'none';
  }
  document.getElementById('bdChi').style.display = d.chiranjeevi ? '' : 'none';

  // Stats bar
  document.getElementById('pGen').textContent  = `Gen ${d.gen}`;
  const alEl = document.getElementById('pAl');
  alEl.textContent  = d.allegiance || '—';
  alEl.className    = 'psv ' + allegianceClass(d.allegiance);
  document.getElementById('pClan').textContent = d.clan;

  // Description
  document.getElementById('pDesc').textContent = d.desc || 'No description available.';

  // Weapon
  const wSec = document.getElementById('wSec');
  if (d.weapon) {
    wSec.style.display = '';
    document.getElementById('pWep').textContent = d.weapon;
  } else {
    wSec.style.display = 'none';
  }

  // Parents
  buildChips('pPar', getParentIds(d.id));

  // Spouses
  buildChips('pSpo', (spouseOf[d.id] || []));

  // Children
  buildChips('pChi', (childrenOf[d.id] || []));

  // Unpin button
  document.getElementById('btnUpin').style.display = d.pinned ? '' : 'none';
}

function closeInsp() {
  document.getElementById('insp').classList.remove('open');
  document.getElementById('nosel').style.display = '';
  document.getElementById('pv').style.display    = 'none';
  window.onSelectChar(null);
}
window.closeInsp = closeInsp;

function getParentIds(id) {
  const ids = [];
  (parentOf[id] || []).forEach(uid => {
    const u = unionMap[uid];
    if (!u) return;
    [u.partnerA, u.partnerB].filter(Boolean).forEach(pid => {
      if (!ids.includes(pid)) ids.push(pid);
    });
  });
  return ids;
}

function buildChips(containerId, ids) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  const valid = ids.filter(id => charMap[id]);
  if (!valid.length) {
    el.innerHTML = '<span class="chip-none">None recorded</span>';
    return;
  }
  valid.forEach(id => {
    const c = charMap[id];
    const btn = document.createElement('button');
    btn.className   = 'chip';
    btn.textContent = c.name;
    btn.onclick     = () => window.focusNode(id);
    el.appendChild(btn);
  });
}

// Allegiance CSS class helper (used by both engine + app)
window.allegianceClass = function(a) {
  if (a === 'Pandava') return 'pa';
  if (a === 'Kaurava') return 'pk';
  return 'pn';
};

// Lineage button
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnLin').addEventListener('click', () => {
    const id = window.getSelectedId && window.getSelectedId();
    if (id) window.traceLineage(id);
  });
  document.getElementById('btnUpin').addEventListener('click', () => {
    window.unpinSelectedNode && window.unpinSelectedNode();
  });
});

// expose selectedId for lineage button
window.getSelectedId = () => {
  const pname = document.getElementById('pname');
  if (!pname.textContent) return null;
  const c = characters.find(x => x.name === pname.textContent);
  return c ? c.id : null;
};

// ── Search ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('charSearch');
  const sugg  = document.getElementById('sugg');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { sugg.classList.add('hidden'); return; }

    const matches = characters.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.epithet && c.epithet.toLowerCase().includes(q)) ||
      (c.sanskrit && c.sanskrit.includes(q))
    ).slice(0, 10);

    if (!matches.length) { sugg.classList.add('hidden'); return; }

    sugg.innerHTML = '';
    matches.forEach(c => {
      const item = document.createElement('div');
      item.className = 'sitem';
      item.innerHTML = `
        <span>${c.name}${c.sanskrit ? ` <span style="font-family:'Noto Serif Devanagari',serif;font-size:10px;color:var(--text-m)">${c.sanskrit}</span>` : ''}</span>
        <span class="sclan">${c.clan}</span>`;
      item.addEventListener('click', () => {
        input.value = c.name;
        sugg.classList.add('hidden');
        window.focusNode(c.id);
        if (isMobile()) closeMobileMenu();
      });
      sugg.appendChild(item);
    });
    sugg.classList.remove('hidden');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#charSearch') && !e.target.closest('#sugg')) {
      sugg.classList.add('hidden');
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { sugg.classList.add('hidden'); input.blur(); }
    if (e.key === 'Enter') {
      const first = sugg.querySelector('.sitem');
      if (first) first.click();
    }
  });
});

// ── Clan filter buttons ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.cbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cbtn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const clan = btn.dataset.clan;
      window.setActiveClan(clan);
      // Also clear allegiance filter
      document.querySelectorAll('.abtn').forEach(b => b.classList.remove('active'));
      window.setActiveAllegiance(null);
    });
  });

  document.querySelectorAll('.abtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const already = btn.classList.contains('active');
      document.querySelectorAll('.abtn').forEach(b => b.classList.remove('active'));
      if (!already) {
        btn.classList.add('active');
        window.setActiveAllegiance(btn.dataset.allegiance);
      } else {
        window.setActiveAllegiance(null);
      }
      // Clear clan filter when using allegiance
      document.querySelectorAll('.cbtn').forEach(b => b.classList.remove('active'));
      document.querySelector('.cbtn[data-clan="All"]').classList.add('active');
      window.setActiveClan('All');
    });
  });
});

// Light-only theme — no toggle needed

// ── Help modal ────────────────────────────────────────────────────────────────
window.toggleHelp = function(show) {
  document.getElementById('hlp').classList.toggle('hidden', !show);
};
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnHelp').addEventListener('click', () => toggleHelp(true));
  document.getElementById('hlp').addEventListener('click', e => {
    if (e.target === document.getElementById('hlp')) toggleHelp(false);
  });
});

// ── Reset layout ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnReset').addEventListener('click', () => {
    // Unpin all nodes
    if (typeof graphNodes !== 'undefined') {
      graphNodes.forEach(d => { d.fx = null; d.fy = null; d.pinned = false; });
    }
    if (typeof pinnedIds !== 'undefined') pinnedIds.clear();
    // Clear lineage + filters
    window.clearLineage && window.clearLineage();
    document.querySelectorAll('.cbtn').forEach(b => b.classList.remove('active'));
    document.querySelector('.cbtn[data-clan="All"]').classList.add('active');
    document.querySelectorAll('.abtn').forEach(b => b.classList.remove('active'));
    window.setActiveClan && window.setActiveClan('All');
    window.setActiveAllegiance && window.setActiveAllegiance(null);
    // Reheat simulation
    if (typeof simulation !== 'undefined') simulation.alpha(0.7).restart();
    window.resetView && window.resetView();
    // Hide pin rings
    document.querySelectorAll('.pin-ring').forEach(el => el.style.display = 'none');
  });
});
