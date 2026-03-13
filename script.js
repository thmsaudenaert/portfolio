// ── CONFIG ──
const CONFIG = {
  SLIDE_DURATION_MS: 3000,
  BATCH_SIZE: 10,
  BAR_COLOR_DEFAULT: 'white'
};

const BAR_COLORS = {
  white: { fill: 'rgba(255,255,255,0.95)', track: 'rgba(255,255,255,0.25)' },
  black: { fill: 'rgba(0,0,0,0.85)',       track: 'rgba(0,0,0,0.25)'       }
};

// ── PLACEHOLDER ──
const PALETTE = [
  ['#1a1a2e','#16213e'],['#0f2027','#203a43'],['#1c1c1c','#2d2d2d'],
  ['#12191f','#1e2d38'],['#1a0a2e','#2d1b4e'],['#0a1628','#142238'],
  ['#1f1209','#2e1d0e'],['#091f1a','#0e2e27'],['#0d1b2a','#1b263b'],
  ['#160d1f','#261535'],['#111820','#1a2535'],['#1a1206','#2a1f0a']
];
let _pi = 0;
function makePlaceholder(type) {
  const idx = _pi++;
  const [c1, c2] = PALETTE[idx % PALETTE.length];
  const gid = 'g' + idx;
  const dots = Array.from({length:80},(_,j) => {
    const x=(j%10)*90+20, y=Math.floor(j/10)*80+20, r=j%4===0?1.5:0.5;
    return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="rgba(255,255,255,0.07)"/>';
  }).join('');
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700">'
    + '<defs><linearGradient id="'+gid+'" x1="0%" y1="0%" x2="100%" y2="100%">'
    + '<stop offset="0%" stop-color="'+c1+'"/><stop offset="100%" stop-color="'+c2+'"/>'
    + '</linearGradient></defs>'
    + '<rect width="900" height="700" fill="url(#'+gid+')" />'
    + dots
    + '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" '
    + 'font-family="monospace" font-size="11" fill="rgba(255,255,255,0.13)" letter-spacing="4">'
    + (type || 'project') + '</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ── PROJECTS ──
// Voeg nieuwe projecten toe aan het EINDE van deze lijst.
// Ze worden omgekeerd getoond (nieuwste bovenaan).
const PROJECTS = [
  {
    title: 'motion reel 2025', type: 'motion design',
    desc: 'A selection of motion graphics and title sequences produced throughout 2024.',
    ratio: '16:9',
    media: [{src:'images/thomas-reel2025.mp4',isVideo:true}]
  },
  {
    title: 'webinar video identity', type: 'motion design',
    desc: 'Webinar transitions for a series to help clients utilise software',
    ratio: '16:9', barColor: 'white',
    media: [{src:'images/LevelUp.mp4',isVideo:true}]
  },
  {
    title: 'campaign identity', type: 'branding',
    desc: 'Campaign identity to raise awareness on social media for the comic book "Atopika" about a girl with a rare skin condition',
    ratio: '4:5',
    media: [{src:'images/atopika-web.mp4',isVideo:true}]
  },
  {
    title: 'moonpie ad', type: 'motion design',
    desc: '3D animated ad for the limited "Solar Eclipse" edition of Moonpie cookies',
    ratio: '16:9',
    media: [{src:'images/moonpie-web.mp4',isVideo:true}]
  },
  {
    title: 'b/w photography', type: 'photography',
    desc: 'Analog black & white street photography',
    ratio: '4:5',
    media: [{src:null,isVideo:false}]
  },
  {
    title: 'social media ads', type: 'motion design',
    desc: 'Concept & creation for a fictional art-event',
    ratio: '1:1',
    media: [{src:'images/versus-web.mp4',isVideo:true}]
  },
  {
    title: 'travel photography', type: 'photography',
    desc: 'Selection of travel pictures, various destinations',
    ratio: '4:5',
    media: [{src:null,isVideo:false}]
  },
  {
    title: 'where the trail breaks', type: 'motion design',
    desc: 'Short character animation',
    ratio: '16:9', barColor: 'white',
    media: [{src:'images/pol-01.png',isVideo:false},{src:'images/pol-02.png',isVideo:false},{src:'images/pol-03.png',isVideo:false}]
  },
  {
    title: 'event branding', type: 'branding',
    desc: 'Poster en branding voor de 80-jarige jubileum-editie van het eetfestijn van Scouts Sint-Paulus',
    ratio: '4:5',
    media: [{src:'images/eetfestijn.png',isVideo:false}]
  }
];

// ── GRID HELPERS ──
function getColCount() {
  return window.innerWidth <= 480 ? 2 : window.innerWidth <= 1100 ? 2 : 3;
}

function initGrid() {
  var grid = document.getElementById('grid');
  grid.innerHTML = '';
  var cols = getColCount();
  for (var i = 0; i < cols; i++) {
    var col = document.createElement('div');
    col.className = 'grid-col';
    grid.appendChild(col);
  }
}

function getShortestCol() {
  var cols = document.querySelectorAll('.grid-col');
  var shortest = cols[0];
  cols.forEach(function(col) {
    if (col.offsetHeight < shortest.offsetHeight) shortest = col;
  });
  return shortest;
}

// ── BUILD CARD ──
function buildCard(project) {
  var item = document.createElement('div');
  item.className = 'grid-item';
  item.setAttribute('data-ratio', project.ratio);

  var hasMultiple = project.media.length > 1;
  var colorKey = project.barColor || CONFIG.BAR_COLOR_DEFAULT;
  var colors = BAR_COLORS[colorKey] || BAR_COLORS.white;

  // media
  if (hasMultiple) {
    project.media.forEach(function(m, si) {
      var slide = document.createElement('div');
      slide.className = 'slide' + (si === 0 ? ' active' : '');
      var img = document.createElement('img');
      img.src = m.src || makePlaceholder(project.type);
      img.alt = project.title;
      slide.appendChild(img);
      item.appendChild(slide);
    });
  } else {
    var m = project.media[0];
    if (m.isVideo && m.src) {
      var v = document.createElement('video');
      v.src = m.src; v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
      v.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.25,.46,.45,.94)';
      item.appendChild(v);
    } else {
      var img = document.createElement('img');
      img.src = m.src || makePlaceholder(project.type);
      img.alt = project.title;
      item.appendChild(img);
    }
  }

  // overlay
  var overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = '<div class="overlay-type">' + project.type + '</div>'
    + '<div class="overlay-title">' + project.title + '</div>'
    + '<div class="overlay-desc">' + project.desc + '</div>';
  item.appendChild(overlay);

  // story bars
  if (hasMultiple) {
    var barsEl = document.createElement('div');
    barsEl.className = 'story-bars';

    var barEls = project.media.map(function() {
      var bar = document.createElement('div');
      bar.className = 'story-bar';
      bar.style.setProperty('--bar-fill', colors.fill);
      bar.style.setProperty('--bar-track', colors.track);
      var fill = document.createElement('div');
      fill.className = 'story-bar-fill';
      bar.appendChild(fill);
      barsEl.appendChild(bar);
      return { bar: bar, fill: fill };
    });

    item.appendChild(barsEl);

    var slides = item.querySelectorAll('.slide');
    var current = 0;
    var fillAnim = null;

    function goTo(n) {
      if (fillAnim) { fillAnim.cancel(); fillAnim = null; }
      slides[current].classList.remove('active');
      current = ((n % slides.length) + slides.length) % slides.length;
      slides[current].classList.add('active');
      barEls.forEach(function(b) { b.fill.style.width = '0%'; });
      fillAnim = barEls[current].fill.animate(
        [{ width: '0%' }, { width: '100%' }],
        { duration: CONFIG.SLIDE_DURATION_MS, easing: 'linear', fill: 'forwards' }
      );
      fillAnim.onfinish = function() {
        barEls[current].fill.style.width = '100%';
        fillAnim = null;
        goTo(current + 1);
      };
    }

    barEls.forEach(function(b, i) {
      b.bar.addEventListener('click', function(e) { e.stopPropagation(); goTo(i); });
    });

    goTo(0);
  }

  // touch — onderscheid tap van scroll
  var touchStartY = 0;
  item.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  item.addEventListener('touchend', function(e) {
    var dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    if (dy > 8) return;
    if (!item.classList.contains('touch-active')) {
      document.querySelectorAll('.grid-item.touch-active').forEach(function(el) {
        el.classList.remove('touch-active');
      });
      item.classList.add('touch-active');
    } else {
      item.classList.remove('touch-active');
    }
  }, { passive: true });

  // blokkeer rechtermuisklik op afbeeldingen en video's
  item.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      e.preventDefault();
    }
  });

  return item;
}

// ── LOAD BATCH ──
var loadedCount = 0;
var loading = false;
var reversedProjects = PROJECTS.slice().reverse();

function loadBatch() {
  if (loading || loadedCount >= reversedProjects.length) return;
  loading = true;
  document.getElementById('loader').classList.add('visible');
  setTimeout(function() {
    var end = Math.min(loadedCount + CONFIG.BATCH_SIZE, reversedProjects.length);
    for (var i = loadedCount; i < end; i++) {
      getShortestCol().appendChild(buildCard(reversedProjects[i]));
    }
    loadedCount = end;
    document.getElementById('loader').classList.remove('visible');
    loading = false;
  }, 200);
}

// tap outside to close overlay
document.addEventListener('touchend', function(e) {
  if (!e.target.closest('.grid-item')) {
    document.querySelectorAll('.grid-item.touch-active').forEach(function(el) {
      el.classList.remove('touch-active');
    });
  }
}, { passive: true });

// infinite scroll
new IntersectionObserver(function(entries) {
  if (entries[0].isIntersecting) loadBatch();
}, { rootMargin: '600px' }).observe(document.getElementById('sentinel'));

// email obfuscatie
document.querySelectorAll('[data-email]').forEach(function(el) {
  var email = atob(el.getAttribute('data-email'));
  el.href = 'mailto:' + email;
  el.textContent = email;
});

// init
initGrid();
loadBatch();

// herlaad grid bij schermgrootte-verandering
window.addEventListener('resize', function() {
  var newCols = getColCount();
  var currentCols = document.querySelectorAll('.grid-col').length;
  if (newCols !== currentCols) {
    loadedCount = 0;
    initGrid();
    loadBatch();
  }
});
