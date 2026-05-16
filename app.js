// ── INIT ──
document.addEventListener('DOMContentLoaded', loadVideos);

// ── PAGE NAVIGATION ──
function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.top-nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  btn.classList.add('active');
  if (name === 'log') loadVideos();
}

// ── TABS ──
function showTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}

// ── HASHTAG COPY ──
function copyTag(el) {
  navigator.clipboard.writeText(el.textContent).then(() => {
    el.classList.add('copied');
    showToast('Copied ' + el.textContent);
    setTimeout(() => el.classList.remove('copied'), 1500);
  });
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// ── PLATFORM CHECK TOGGLE ──
function toggleCheck(id) {
  document.getElementById(id).classList.toggle('checked');
}

// ── LOG MODAL ──
function openLogModal() {
  document.getElementById('log-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('log-modal').classList.add('open');
}

function closeLogModal() {
  document.getElementById('log-modal').classList.remove('open');
  resetLogForm();
}

function resetLogForm() {
  ['log-date', 'log-title', 'log-hook', 'log-caption', 'log-hashtags', 'log-sound', 'log-notes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('log-category').value = '';
  document.getElementById('log-hooktype').value = '';
  ['check-tiktok', 'check-reels', 'check-youtube'].forEach(id => {
    document.getElementById(id).classList.remove('checked');
    document.getElementById(id).querySelector('input').checked = false;
  });
}

function saveLog() {
  const title = document.getElementById('log-title').value.trim();
  if (!title) { showToast('Add a title first'); return; }

  const platforms = [];
  document.querySelectorAll('.platform-check.checked input').forEach(i => platforms.push(i.value));

  const entry = {
    id: Date.now(),
    date: document.getElementById('log-date').value,
    title,
    platforms,
    hook: document.getElementById('log-hook').value,
    caption: document.getElementById('log-caption').value,
    hashtags: document.getElementById('log-hashtags').value,
    sound: document.getElementById('log-sound').value,
    category: document.getElementById('log-category').value,
    hookType: document.getElementById('log-hooktype').value,
    notes: document.getElementById('log-notes').value,
  };

  const videos = JSON.parse(localStorage.getItem('yaad-videos') || '[]');
  videos.unshift(entry);
  localStorage.setItem('yaad-videos', JSON.stringify(videos));
  closeLogModal();
  loadVideos();
  showToast('Video logged ✓');
}

// ── VIDEO LOG ──
let currentFilter = 'all';

function filterLog(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadVideos();
}

const pillarLabels = {
  joy: '☀️ Joy',
  heal: '🌿 Heal',
  culture: '🇯🇲 Culture',
  relatable: '😭 Relatable',
  yt: '🎬 YT Crossover',
  other: 'Other'
};

function loadVideos() {
  const videos = JSON.parse(localStorage.getItem('yaad-videos') || '[]');
  const list = document.getElementById('video-list');
  if (!list) return;

  const filtered = videos.filter(v => {
    if (currentFilter === 'all') return true;
    if (['TikTok', 'Reels', 'YouTube'].includes(currentFilter)) return v.platforms.includes(currentFilter);
    return v.category === currentFilter;
  });

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎬</div>
        <div class="empty-title">No videos logged yet</div>
        <div class="empty-desc">Hit <strong>+ Log a Video</strong> after every post to start building your record.</div>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(v => `
    <div class="video-card">
      <div class="video-card-top">
        <div class="video-title-text">${v.title}</div>
        <div class="video-date">${v.date || ''}</div>
      </div>
      <div class="video-meta">
        ${v.platforms.map(p => `<span class="platform-tag pt-${p.toLowerCase()}">${p}</span>`).join('')}
        ${v.category ? `<span class="badge badge-gold" style="font-size:11px;">${pillarLabels[v.category] || v.category}</span>` : ''}
        ${v.hookType ? `<span class="badge badge-purple" style="font-size:11px;">${v.hookType} hook</span>` : ''}
      </div>
      ${v.hook ? `<div class="video-hook">"${v.hook}"</div>` : ''}
      ${v.notes ? `<div class="video-notes">📝 ${v.notes}</div>` : ''}
    </div>
  `).join('');
}

// ── IDEA MODAL ──
function openIdeaModal(pillar) {
  document.getElementById('idea-pillar').value = pillar;
  document.getElementById('idea-text-input').value = '';
  document.getElementById('idea-tag-select').value = '';
  document.getElementById('idea-modal').classList.add('open');
}

function closeIdeaModal() {
  document.getElementById('idea-modal').classList.remove('open');
}

function saveIdea() {
  const text = document.getElementById('idea-text-input').value.trim();
  if (!text) return;
  const pillar = document.getElementById('idea-pillar').value;
  const tag = document.getElementById('idea-tag-select').value;

  const tagClass = tag ? `tag-${tag}` : '';
  const tagLabel = tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : '';
  const pillarColors = {
    joy: 'var(--gold)',
    heal: 'var(--green)',
    culture: 'var(--coral)',
    relatable: 'var(--purple)',
    yt: 'var(--blue)'
  };
  const color = pillarColors[pillar] || 'var(--gold)';

  const li = document.createElement('li');
  li.className = 'idea-item';
  li.innerHTML = `
    <div class="idea-dot" style="background:${color}"></div>
    <div class="idea-text">${text}</div>
    ${tagLabel ? `<span class="idea-tag ${tagClass}">${tagLabel}</span>` : ''}
  `;

  const list = document.getElementById('ideas-' + pillar);
  if (list) list.appendChild(li);

  closeIdeaModal();
  showToast('Idea added ✓');
}

// ── CLOSE MODALS ON OVERLAY CLICK ──
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      if (overlay.id === 'log-modal') resetLogForm();
    }
  });
});
