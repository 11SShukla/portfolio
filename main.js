(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ============ DATA ============ */
  var GROUPS = {
    listener: { name: 'The Listener' },
    librarian: { name: 'The Librarian' },
    workshop: { name: 'The Workshop' }
  };
  var PROJECTS = [
    {
      id: 'mental', short: 'Story Analyzer', name: 'Mental Health Story Analyzer', slug: 'Mental_Health_Story_Analyzer', group: 'listener', commits: 16,
      url: 'https://github.com/11SShukla/Mental_Health_Story_Analyzer',
      blurb: 'Write a few lines about your day and the app reads the feeling underneath. An emotion model labels the story, a second step looks for thought patterns such as overgeneralization and catastrophizing, and a piece of supportive advice comes back.',
      flow: ['Your story', 'TF-IDF features', 'Emotion model (ANN)', 'Thought-pattern check', 'Advice model', 'Streamlit screen'],
      pts: ['Detects emotions such as joy, sadness and anger.', 'Flags cognitive distortions in the writing.', 'Wrapped in a Streamlit interface anyone can try.'],
      stack: ['Python', 'TensorFlow / Keras', 'TF-IDF', 'Streamlit'],
      tags: ['NLP', 'Deep learning', 'Streamlit']
    },
    {
      id: 'rag', short: 'Health RAG', name: 'Health RAG Assistant', slug: 'rag_health_assistant-', group: 'listener', commits: 1,
      url: 'https://github.com/11SShukla/rag_health_assistant-',
      blurb: 'A health-focused chatbot that answers from documents instead of guesswork. Source text is chunked and embedded into a vector store, then connected to an LLM so replies come from retrieved material.',
      flow: ['Documents', 'Chunks', 'Embeddings', 'Vector store', 'LLM answer'],
      pts: ['One script builds the memory, one connects it to the model, one runs the assistant.', 'A first foundation that the later projects built on.'],
      stack: ['Python', 'RAG', 'Embeddings', 'Vector database', 'LLMs'],
      tags: ['RAG', 'LLMs']
    },
    {
      id: 'policy', short: 'Policy RAG', name: 'Policy RAG System', slug: 'policy-rag-system', group: 'librarian', commits: 13,
      url: 'https://github.com/11SShukla/policy-rag-system',
      blurb: 'Questions about government and regulatory documents, such as RBI circulars, answered with citations. The key idea is that policies get replaced. When a newer circular overrides an older one, the answer carries a warning.',
      flow: ['Circulars (OCR for scans)', 'Query expansion', 'Hybrid search: vectors + BM25', 'Cross-encoder reranking', 'Supersession check', 'Cited answer'],
      pts: ['Supersession detection flags policies that a newer circular overrides.', 'OCR reads scanned PDFs, not just clean text.', 'Every answer points back to its source.'],
      stack: ['Hybrid search', 'BM25', 'Embeddings', 'Cross-encoder reranking', 'OCR'],
      tags: ['RAG', 'NLP']
    },
    {
      id: 'sql', short: 'NLP → SQL', name: 'NLP to SQL', slug: 'NLP_to_SQL', group: 'librarian', commits: 6,
      url: 'https://github.com/11SShukla/NLP_to_SQL',
      blurb: 'Ask a database a question in plain English. The app passes the table schema to a lightweight LLM through the Groq API, gets SQL back, runs it on a SQLite sample database and shows the result in Streamlit.',
      flow: ['Plain-English question', 'Schema as context', 'Groq LLM', 'SQL query', 'SQLite database', 'Streamlit result'],
      pts: ['The schema travels with every question, so the model writes SQL for the real tables.', 'Open source under the MIT license.'],
      stack: ['Python', 'Groq API', 'SQLite', 'Streamlit', 'Prompting'],
      tags: ['LLMs', 'SQL', 'Streamlit'],
      next: 'Query validation, multi-table joins, conversation memory, role-based authentication and an online deployment.'
    },
    {
      id: 'quant', short: 'Quantization', name: 'Model Quantization', slug: 'model_quantization', group: 'workshop', commits: 7,
      url: 'https://github.com/11SShukla/model_quantization',
      blurb: 'TinyLlama-1.1B-Chat squeezed from 16-bit to 8-bit with bitsandbytes. The README puts the saving at about half the memory, with the quantized model saved for reuse and checked through loss and perplexity.',
      flow: ['TinyLlama in FP16', '8-bit with bitsandbytes', 'Save the model', 'Measure loss and perplexity'],
      pts: ['Smaller models run on lower-end GPUs.', 'The result is measured, not assumed.'],
      stack: ['Python', 'Transformers', 'bitsandbytes', 'PyTorch', 'Accelerate'],
      tags: ['LLMs', 'Deep learning', 'Quantization']
    },
    {
      id: 'leadgen', short: 'LeadGen AI', name: 'LeadGen AI', slug: 'leadgen-ai', group: 'workshop', commits: 1,
      url: 'https://github.com/11SShukla/leadgen-ai',
      blurb: 'The newest star on the map: the backend for an AI lead generation tool. One commit in, the foundation is down and the features are still to be lit.',
      flow: ['Backend foundation', 'Features in progress'],
      pts: ['Started with the backend, because everything else depends on it.'],
      stack: ['Backend', 'AI'],
      tags: ['Backend']
    }
  ];
  var FILTERS = ['NLP', 'RAG', 'LLMs', 'Deep learning', 'SQL', 'Streamlit', 'Quantization', 'Backend'];
  var byId = {}; PROJECTS.forEach(function (p) { byId[p.id] = p; });

  var LAYOUTS = {
    wide: {
      vb: [1000, 590], fs: 1,
      stars: { mental: [210, 210, 'b'], rag: [330, 340, 'r'], policy: [690, 200, 'b'], sql: [800, 330, 'r'], quant: [520, 470, 'b'], leadgen: [690, 520, 'b'] },
      fillers: { f1: [90, 130], f2: [340, 120], f3: [170, 430], g1: [600, 110], g2: [830, 110], g3: [930, 220], g4: [680, 420], h1: [380, 500], h2: [560, 370], h3: [850, 500] },
      edges: [['f1','mental'],['mental','f2'],['mental','rag'],['rag','f3'],['g1','policy'],['policy','g2'],['g2','g3'],['g3','sql'],['policy','sql'],['sql','g4'],['h1','quant'],['quant','h2'],['quant','leadgen'],['leadgen','h3']],
      names: [['The Listener', 60, 48], ['The Librarian', 580, 48], ['The Workshop', 360, 572]]
    },
    narrow: {
      vb: [400, 810], fs: 1,
      stars: { mental: [130, 130, 'b'], rag: [230, 250, 'r'], policy: [160, 450, 'b'], sql: [290, 560, 'l'], quant: [160, 735, 'b'], leadgen: [310, 745, 'b'] },
      fillers: { f1: [40, 80], f2: [290, 90], f3: [90, 300], g1: [60, 400], g2: [320, 400], g3: [360, 490], g4: [130, 620], h1: [40, 710], h2: [300, 690], h3: [372, 775] },
      edges: [['f1','mental'],['mental','f2'],['mental','rag'],['rag','f3'],['g1','policy'],['policy','g2'],['g2','g3'],['g3','sql'],['policy','sql'],['sql','g4'],['h1','quant'],['quant','h2'],['quant','leadgen'],['leadgen','h3']],
      names: [['The Listener', 20, 38], ['The Librarian', 20, 352], ['The Workshop', 20, 672]]
    }
  };

  /* ============ NIGHT SKY CANVAS ============ */
  var cv = $('#sky'), ctx = cv.getContext('2d');
  var W = 0, H = 0, DPR = 1, stars = [];
  var ptr = { x: -999, y: -999, a: 0, on: false };
  function seedStars() {
    var n = Math.round(Math.min(280, Math.max(110, W * H / 6200)));
    stars = [];
    for (var i = 0; i < n; i++) {
      var z = Math.pow(Math.random(), 1.6) * 0.9 + 0.1, r = Math.random();
      stars.push({ x: Math.random() * W, y: Math.random() * H, z: z, r: 0.35 + z * 1.15, ph: Math.random() * 6.28, sp: 0.6 + Math.random() * 1.4,
        c: r < 0.14 ? '242,184,75' : (r < 0.4 ? '160,190,235' : '236,230,214') });
    }
  }
  function sizeCanvas() {
    var nw = window.innerWidth, nh = window.innerHeight;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(nw * DPR); cv.height = Math.round(nh * DPR);
    if (stars.length) { var kx = nw / (W || nw), ky = nh / (H || nh); stars.forEach(function (s) { s.x *= kx; s.y *= ky; }); }
    W = nw; H = nh;
    if (!stars.length) seedStars();
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (reduce) frame(0);
  }
  var NEAR = 150, LINK = 125;
  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    var sy = reduce ? 0 : window.scrollY, near = [], i, j, s;
    if (ptr.on) ptr.a = Math.min(1, ptr.a + 0.12); else ptr.a *= 0.93;
    if (ptr.a < 0.01) ptr.a = 0;
    for (i = 0; i < stars.length; i++) {
      s = stars[i];
      var y = (s.y - sy * s.z * 0.22) % H; if (y < 0) y += H;
      var tw = reduce ? 1 : 0.72 + 0.28 * Math.sin(t * 0.001 * s.sp + s.ph);
      ctx.globalAlpha = (0.28 + 0.6 * s.z) * tw;
      ctx.fillStyle = 'rgb(' + s.c + ')';
      ctx.beginPath(); ctx.arc(s.x, y, s.r, 0, 6.2832); ctx.fill();
      if (ptr.a > 0) { var dx = s.x - ptr.x, dy = y - ptr.y, d = Math.sqrt(dx * dx + dy * dy); if (d < NEAR) near.push({ x: s.x, y: y, d: d, r: s.r }); }
    }
    if (near.length) {
      ctx.lineWidth = 1;
      for (i = 0; i < near.length; i++) for (j = i + 1; j < near.length; j++) {
        var ax = near[i].x - near[j].x, ay = near[i].y - near[j].y, dd = Math.sqrt(ax * ax + ay * ay);
        if (dd < LINK) {
          ctx.globalAlpha = ptr.a * (1 - dd / LINK) * 0.6;
          ctx.strokeStyle = 'rgb(214,224,242)';
          ctx.beginPath(); ctx.moveTo(near[i].x, near[i].y); ctx.lineTo(near[j].x, near[j].y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgb(242,184,75)';
      for (i = 0; i < near.length; i++) {
        ctx.globalAlpha = ptr.a * (1 - near[i].d / NEAR) * 0.9;
        ctx.beginPath(); ctx.arc(near[i].x, near[i].y, near[i].r + 1.4, 0, 6.2832); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(frame);
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);
  if (!reduce) {
    window.addEventListener('pointermove', function (e) { ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = true; }, { passive: true });
    window.addEventListener('pointerup', function (e) { if (e.pointerType === 'touch') ptr.on = false; });
    window.addEventListener('pointercancel', function () { ptr.on = false; });
    document.documentElement.addEventListener('pointerleave', function () { ptr.on = false; });
    window.addEventListener('blur', function () { ptr.on = false; });
    requestAnimationFrame(frame);
  }

  /* ============ RAIL + PROGRESS ============ */
  var chapters = [{ id: 'prologue', t: 'Start' }].concat($$('section.chapter').map(function (s) { return { id: s.id, t: s.getAttribute('data-title') }; }));
  var rail = $('.rail');
  chapters.forEach(function (c, i) {
    var a = document.createElement('a');
    a.href = '#' + c.id; a.setAttribute('aria-label', c.t);
    a.style.top = (i / (chapters.length - 1) * 100) + '%';
    a.innerHTML = '<span>' + c.t + '</span>';
    a.dataset.id = c.id;
    rail.appendChild(a);
  });
  function progress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    document.documentElement.style.setProperty('--p', p.toFixed(4));
    $('.topbar').style.setProperty('--p', p.toFixed(4));
    $('.rail').style.setProperty('--p', p.toFixed(4));
  }
  window.addEventListener('scroll', progress, { passive: true }); progress();
  function setActive(id) { $$('.rail a').forEach(function (a) { a.classList.toggle('on', a.dataset.id === id); }); }
  setActive('prologue');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    chapters.forEach(function (c) { var el = document.getElementById(c.id); if (el) secObs.observe(el); });
  }

  /* ============ TIMELINE SCRUBBER ============ */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var BASE = 2023;
  var now = new Date();
  var NOW_IDX = (now.getFullYear() - BASE) * 12 + now.getMonth();
  var T = NOW_IDX + 1;
  function mi(y, m) { return (y - BASE) * 12 + m; }
  var ROLES = [
    { title: 'Graphics Lead', org: 'Awaaz ADGITM', s: mi(2023, 0), e: mi(2025, 7), dates: 'Jan 2023 – Aug 2025', meta: '2 yrs 8 mos · Analytical skills, work management' },
    { title: 'Machine Learning and AI Intern', org: 'Indian Navy', s: mi(2025, 6), e: mi(2026, 0), dates: 'Jul 2025 – Jan 2026', meta: '7 mos · Internship · Big data, machine learning' },
    { title: 'AI Intern', org: 'QV Strategic Consulting LLP', s: mi(2026, 1), e: mi(2026, 2), dates: 'Feb 2026 – Mar 2026', meta: '2 mos' },
    { title: 'AI and ML Intern', org: 'BharatX.ai', s: mi(2026, 2), e: mi(2026, 4), dates: 'Mar 2026 – May 2026', meta: '3 mos · Internship · On-site' },
    { title: 'AI Engineer', org: 'FutureVerse', s: mi(2026, 4), e: NOW_IDX, dates: 'May 2026 – Present', meta: 'Full-time · Delhi, on-site' }
  ];
  var gantt = $('#gantt'), range = $('#range'), whenEl = $('#when'), nowRoles = $('#nowRoles');
  range.max = String(NOW_IDX); range.value = String(NOW_IDX);
  var lanes = ROLES.map(function (r) {
    var lane = document.createElement('div'); lane.className = 'lane';
    lane.innerHTML = '<div class="lane-label"><span>' + r.org + ' · ' + r.title + '</span><span>' + r.dates + '</span></div><div class="track"><div class="bar" style="left:' + (r.s / T * 100) + '%;width:' + ((r.e - r.s + 1) / T * 100) + '%"></div></div>';
    gantt.appendChild(lane); return lane;
  });
  var axis = document.createElement('div'); axis.className = 'axis';
  for (var y = BASE; y <= now.getFullYear(); y++) {
    var sp = document.createElement('span'); sp.textContent = y; sp.style.left = (mi(y, 0) / T * 100) + '%'; axis.appendChild(sp);
  }
  gantt.appendChild(axis);
  var scrub = document.createElement('div'); scrub.className = 'scrub'; gantt.appendChild(scrub);
  var curM = NOW_IDX;
  function setMonth(m) {
    m = Math.max(0, Math.min(NOW_IDX, Math.round(m))); curM = m;
    range.value = String(m);
    scrub.style.left = ((m + 0.5) / T * 100) + '%';
    var yr = BASE + Math.floor(m / 12), mo = m % 12;
    whenEl.textContent = (m === NOW_IDX ? 'Now · ' : '') + MONTHS[mo] + ' ' + yr;
    var html = '';
    ROLES.forEach(function (r, i) {
      var on = m >= r.s && m <= r.e; lanes[i].classList.toggle('on', on);
      if (on) html += '<div class="role"><h4>' + r.title + '</h4><p class="org">' + r.org + '</p><p class="meta">' + r.dates + ' · ' + r.meta + '</p></div>';
    });
    nowRoles.innerHTML = html;
  }
  function monthFromX(clientX) {
    var rect = gantt.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * T - 0.5;
  }
  var dragging = false;
  gantt.addEventListener('pointerdown', function (e) { dragging = true; stopPlay(); setMonth(monthFromX(e.clientX)); try { gantt.setPointerCapture(e.pointerId); } catch (err) {} });
  gantt.addEventListener('pointermove', function (e) { if (dragging) setMonth(monthFromX(e.clientX)); });
  gantt.addEventListener('pointerup', function () { dragging = false; });
  gantt.addEventListener('pointercancel', function () { dragging = false; });
  range.addEventListener('input', function () { stopPlay(); setMonth(+range.value); });
  var playTimer = null;
  function stopPlay() { if (playTimer) { clearInterval(playTimer); playTimer = null; } }
  $('#play').addEventListener('click', function () {
    stopPlay();
    if (reduce) { setMonth(NOW_IDX); return; }
    var m = 0; setMonth(0);
    playTimer = setInterval(function () { m++; setMonth(m); if (m >= NOW_IDX) stopPlay(); }, 150);
  });
  setMonth(NOW_IDX);

  /* ============ STAR MAP ============ */
  var NS = 'http://www.w3.org/2000/svg';
  function sv(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e); return e;
  }
  var mapHost = $('#mapSvg'), selected = 'mental', filter = null, userPicked = false;
  var mq = window.matchMedia('(max-width: 720px)');
  function radius(p) { return 5 + Math.sqrt(p.commits) * 2.2; }
  function buildMap() {
    var L = mq.matches ? LAYOUTS.narrow : LAYOUTS.wide;
    mapHost.innerHTML = '';
    var svg = sv('svg', { viewBox: '0 0 ' + L.vb[0] + ' ' + L.vb[1], role: 'group', 'aria-label': 'Star map of six projects' }, mapHost);
    var defs = sv('defs', {}, svg);
    var g = sv('radialGradient', { id: 'halo' }, defs);
    sv('stop', { offset: '0%', style: 'stop-color:#f2b84b;stop-opacity:.55' }, g);
    sv('stop', { offset: '45%', style: 'stop-color:#f2b84b;stop-opacity:.14' }, g);
    sv('stop', { offset: '100%', style: 'stop-color:#f2b84b;stop-opacity:0' }, g);
    function pos(id) { return L.stars[id] || L.fillers[id]; }
    var edgeEls = [];
    L.edges.forEach(function (ed, i) {
      var a = pos(ed[0]), b = pos(ed[1]);
      var len = Math.hypot(a[0] - b[0], a[1] - b[1]).toFixed(1);
      var base = sv('line', { class: 'edge-base', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, svg);
      var glow = sv('line', { class: 'edge-glow', x1: a[0], y1: a[1], x2: b[0], y2: b[1], style: '--len:' + len + ';--i:' + i }, svg);
      edgeEls.push({ ids: ed, els: [base, glow] });
    });
    for (var f in L.fillers) { var fp = L.fillers[f]; sv('circle', { class: 'filler', cx: fp[0], cy: fp[1], r: 1.8 }, svg); }
    L.names.forEach(function (n) { var t = sv('text', { class: 'cname', x: n[1], y: n[2] }, svg); t.textContent = n[0]; });
    var starEls = {};
    PROJECTS.forEach(function (p, i) {
      var s = L.stars[p.id], r = radius(p), R = r * 2.7;
      var grp = sv('g', { class: 'star', transform: 'translate(' + s[0] + ',' + s[1] + ')', tabindex: '0', role: 'button', 'aria-label': p.name + ', ' + p.commits + (p.commits === 1 ? ' commit' : ' commits'), style: '--d:' + (i * 0.45) + 's' }, svg);
      sv('circle', { class: 'halo', r: (r * 3.6).toFixed(1) }, grp);
      sv('circle', { class: 'ring', r: (r * 2.1).toFixed(1) }, grp);
      sv('path', { class: 'spike', d: 'M0,' + (-R) + ' L0,' + R + ' M' + (-R) + ',0 L' + R + ',0' }, grp);
      sv('circle', { class: 'core', r: r.toFixed(1) }, grp);
      sv('circle', { class: 'focus', r: (r * 2.3).toFixed(1) }, grp);
      sv('circle', { r: (r + 16).toFixed(1), fill: 'transparent' }, grp);
      var off = r * 2.5 + 8, side = s[2], tx = 0, ty = 0, anchor = 'middle';
      if (side === 'b') { ty = r * 2.5 + 8 + 10; } else if (side === 'r') { tx = off; ty = 4; anchor = 'start'; } else if (side === 'l') { tx = -off; ty = 4; anchor = 'end'; }
      var tt = sv('text', { x: tx.toFixed(1), y: ty.toFixed(1), 'text-anchor': anchor }, grp); tt.textContent = p.short;
      grp.addEventListener('click', function () { pick(p.id, true); });
      grp.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p.id, true); } });
      starEls[p.id] = grp;
    });
    mapHost._svg = svg; mapHost._stars = starEls; mapHost._edges = edgeEls;
    paintMap();
    if (!reduce && mapHost._traced) svg.classList.add('trace');
  }
  function lit(p) { return !filter || p.tags.indexOf(filter) > -1; }
  function paintMap() {
    var els = mapHost._stars; if (!els) return;
    PROJECTS.forEach(function (p) {
      els[p.id].classList.toggle('sel', p.id === selected);
      els[p.id].classList.toggle('dim', !lit(p));
    });
    mapHost._edges.forEach(function (ed) {
      var dim = ed.ids.some(function (id) { return byId[id] && !lit(byId[id]); });
      ed.els.forEach(function (e) { e.classList.toggle('dim', dim); });
    });
  }
  function trace() {
    var svg = mapHost._svg; if (!svg) return;
    mapHost._traced = true;
    svg.classList.remove('trace'); void svg.getBoundingClientRect(); svg.classList.add('trace');
  }
  $('#trace').addEventListener('click', trace);
  if ('IntersectionObserver' in window) {
    var mo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { trace(); mo.disconnect(); } }, { threshold: 0.35 });
    mo.observe($('#map'));
  } else { trace(); }
  mq.addEventListener ? mq.addEventListener('change', buildMap) : mq.addListener(buildMap);

  /* filters + tabs */
  var filterBox = $('#filters');
  FILTERS.forEach(function (f) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = f; b.setAttribute('aria-pressed', 'false'); b.id = 'f-' + f.toLowerCase().replace(/\s+/g, '-');
    b.addEventListener('click', function () {
      filter = filter === f ? null : f;
      $$('.chip', filterBox).forEach(function (c) { c.setAttribute('aria-pressed', String(c.textContent === filter)); });
      paintMap();
    });
    filterBox.appendChild(b);
  });
  var tabBox = $('#tabs');
  PROJECTS.forEach(function (p) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = p.short; b.id = 't-' + p.id; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { pick(p.id, true); });
    tabBox.appendChild(b);
  });

  /* panel */
  var panel = $('#panel'), flowTimers = [];
  function playFlow() {
    flowTimers.forEach(clearTimeout); flowTimers = [];
    var steps = $$('.flow li', panel);
    steps.forEach(function (s) { s.classList.remove('on'); });
    steps.forEach(function (s, i) {
      if (reduce) { s.classList.add('on'); return; }
      flowTimers.push(setTimeout(function () { s.classList.add('on'); }, 200 + i * 360));
    });
  }
  function renderPanel() {
    var p = byId[selected];
    var html = '<div class="p-main">' +
      '<p class="p-eyebrow">' + GROUPS[p.group].name + ' · ' + p.commits + (p.commits === 1 ? ' commit' : ' commits') + ' so far</p>' +
      '<h3 class="p-title">' + p.name + '</h3>' +
      '<p class="p-slug">github.com/11SShukla/' + p.slug + '</p>' +
      '<p class="p-blurb">' + p.blurb + '</p>' +
      '<ul class="pts">' + p.pts.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      (p.next ? '<p class="next"><b>Next on the map</b>' + p.next + '</p>' : '') +
      '</div><div class="p-side">' +
      '<div class="flow-head"><p class="label">How it flows</p><button class="replay" type="button" id="replayFlow">&#8635; Replay</button></div>' +
      '<ol class="flow">' + p.flow.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' +
      '<p class="label">Built with</p><div class="stack">' + p.stack.map(function (x) { return '<span class="tag">' + x + '</span>'; }).join('') + '</div>' +
      '<a class="btn" href="' + p.url + '" target="_blank" rel="noopener">Open on GitHub &nearr;</a></div>';
    panel.innerHTML = html;
    $('#replayFlow').addEventListener('click', playFlow);
    playFlow();
  }
  function pick(id, fromUser) {
    selected = id;
    $$('.chip', tabBox).forEach(function (c) { c.setAttribute('aria-pressed', String(c.id === 't-' + id)); });
    paintMap(); renderPanel();
    if (fromUser) {
      var r = panel.getBoundingClientRect();
      if (r.top > window.innerHeight - 180 || r.top < 0) window.scrollBy({ top: r.top - 130, behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  buildMap(); pick('mental', false);

  /* ============ ORBIT ============ */
  var AREAS = [
    { t: 'Pipeline engineering', d: 'Moving knowledge from capture to something people can use.' },
    { t: 'System architecture', d: 'Deciding how the pieces fit before they are built.' },
    { t: 'R&D', d: 'Trying new approaches and keeping the ones that hold up.' },
    { t: 'Technical documentation', d: 'Writing it down so the next person can pick it up.' }
  ];
  var orbit = $('#orbit'), orbitTabs = $('#orbitTabs'), orbitText = $('#orbitText');
  var nodes = [], otabs = [];
  AREAS.forEach(function (a, i) {
    var ang = (-90 + i * 90) * Math.PI / 180, rad = 36;
    var n = document.createElement('button'); n.type = 'button'; n.className = 'node'; n.setAttribute('aria-label', a.t); n.setAttribute('aria-pressed', 'false');
    n.style.left = (50 + rad * Math.cos(ang)) + '%'; n.style.top = (50 + rad * Math.sin(ang)) + '%';
    n.addEventListener('click', function () { setArea(i); });
    orbit.appendChild(n); nodes.push(n);
    var c = document.createElement('button'); c.type = 'button'; c.className = 'chip'; c.textContent = a.t; c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', function () { setArea(i); });
    orbitTabs.appendChild(c); otabs.push(c);
  });
  function setArea(i) {
    nodes.forEach(function (n, j) { n.setAttribute('aria-pressed', String(i === j)); });
    otabs.forEach(function (n, j) { n.setAttribute('aria-pressed', String(i === j)); });
    orbitText.innerHTML = '<h4>' + AREAS[i].t + '</h4><p>' + AREAS[i].d + '</p>';
  }
  setArea(0);
})();
