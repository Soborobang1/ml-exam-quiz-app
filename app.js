/* ============================================================
   ML Final Exam Practice App — app.js
   Grading engine, routing, localStorage, category filter
   ============================================================ */

'use strict';

// ── Constants ────────────────────────────────────────────────
const STORAGE_KEY = 'ml_exam_notes';
const STATS_KEY   = 'ml_exam_stats';

const TYPE_LABELS = {
  'short':        '서술형',
  'blank':        '빈칸채우기',
  'ox':           'O/X',
  'code-blank':   '코드빈칸',
  'code-explain': '코드설명',
};

// ── State ────────────────────────────────────────────────────
let state = {
  selectedCategories: [],  // [] = all
  selectedTypes:      [],  // [] = all
  sessionQuestions:   [],
  answers:            {},  // qId -> user's answer
  graded:             {},  // qId -> true/false
  notesDraft:         {},  // qId -> draft text
  questionCount:      10,
};

// ── DOM refs ──────────────────────────────────────────────────
const screens = {};
['home','quiz','summary','notes'].forEach(id => {
  screens[id] = document.getElementById(id + '-screen');
});

// ── localStorage helpers ─────────────────────────────────────
function loadNotes()   { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } }
function saveNotes(n)  { localStorage.setItem(STORAGE_KEY, JSON.stringify(n)); }
function loadStats()   { try { return JSON.parse(localStorage.getItem(STATS_KEY)) || {}; } catch { return {}; } }
function saveStats(s)  { localStorage.setItem(STATS_KEY, JSON.stringify(s)); }

// ── Text normalisation for grading ───────────────────────────
function normalise(text) {
  return String(text)
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=`~()]/g, ' ')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsKeyword(haystack, kw, syns) {
  const normH = normalise(haystack);
  const normKw = normalise(kw);
  if (normH.includes(normKw)) return true;
  if (syns && syns[kw]) {
    return syns[kw].some(s => normH.includes(normalise(s)));
  }
  return false;
}

// ── Grading functions ─────────────────────────────────────────
function gradeShort(userAnswer, keywords) {
  const { required = [], optional = [], synonyms = {}, minOptional = 0 } = keywords;
  const hitRequired = required.filter(kw => containsKeyword(userAnswer, kw, synonyms));
  const hitOptional = optional.filter(kw => containsKeyword(userAnswer, kw, synonyms));
  const requiredOk  = hitRequired.length === required.length;
  const optionalOk  = hitOptional.length >= minOptional;
  return {
    correct: requiredOk && optionalOk,
    hitRequired, missRequired: required.filter(k => !hitRequired.includes(k)),
    hitOptional, missOptional: optional.filter(k => !hitOptional.includes(k)),
  };
}

function gradeBlank(userBlanks, blanks) {
  return userBlanks.map((ans, i) => {
    const accepted = blanks[i] || [];
    const normAns = normalise(ans);
    return accepted.some(a => normalise(a) === normAns || normalise(a).includes(normAns) || normAns.includes(normalise(a)));
  });
}

function gradeOX(userSubs, subs) {
  return subs.map((sub, i) => userSubs[i] === sub.answer);
}

// ── Routing ───────────────────────────────────────────────────
function showScreen(name) {
  Object.values(screens).forEach(el => { el.classList.remove('active'); });
  screens[name].classList.add('active');
  document.querySelectorAll('.header-nav button').forEach(b => {
    b.classList.toggle('active-nav', b.dataset.screen === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Home Screen ───────────────────────────────────────────────
function buildHome() {
  buildCategoryChips();
  buildTypeChips();
  renderStats();
  updateAvailableCount();
}

function getCategories() {
  const cats = [...new Set(QUESTIONS.map(q => q.category))].sort();
  return cats;
}

function buildCategoryChips() {
  const grid = document.getElementById('category-grid');
  grid.innerHTML = '';
  const all = document.createElement('button');
  all.className = 'chip all-chip selected';
  all.dataset.cat = '__all__';
  all.innerHTML = '전체 <span class="chip-count">' + QUESTIONS.length + '</span>';
  all.addEventListener('click', () => { state.selectedCategories = []; renderCategorySelection(); updateAvailableCount(); });
  grid.appendChild(all);

  getCategories().forEach(cat => {
    const count = QUESTIONS.filter(q => q.category === cat).length;
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.dataset.cat = cat;
    btn.innerHTML = cat + ' <span class="chip-count">' + count + '</span>';
    btn.addEventListener('click', () => {
      const idx = state.selectedCategories.indexOf(cat);
      if (idx === -1) state.selectedCategories.push(cat);
      else state.selectedCategories.splice(idx, 1);
      renderCategorySelection();
      updateAvailableCount();
    });
    grid.appendChild(btn);
  });
}

function renderCategorySelection() {
  document.querySelectorAll('#category-grid .chip').forEach(btn => {
    const cat = btn.dataset.cat;
    if (cat === '__all__') {
      btn.classList.toggle('selected', state.selectedCategories.length === 0);
    } else {
      btn.classList.toggle('selected', state.selectedCategories.includes(cat));
    }
  });
}

function buildTypeChips() {
  const wrap = document.getElementById('type-filter');
  wrap.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.className = 'type-chip selected';
  allBtn.dataset.type = '__all__';
  allBtn.textContent = '모든 유형';
  allBtn.addEventListener('click', () => { state.selectedTypes = []; renderTypeSelection(); updateAvailableCount(); });
  wrap.appendChild(allBtn);
  Object.entries(TYPE_LABELS).forEach(([type, label]) => {
    const btn = document.createElement('button');
    btn.className = 'type-chip';
    btn.dataset.type = type;
    btn.textContent = label;
    btn.addEventListener('click', () => {
      const idx = state.selectedTypes.indexOf(type);
      if (idx === -1) state.selectedTypes.push(type);
      else state.selectedTypes.splice(idx, 1);
      renderTypeSelection();
      updateAvailableCount();
    });
    wrap.appendChild(btn);
  });
}

function renderTypeSelection() {
  document.querySelectorAll('#type-filter .type-chip').forEach(btn => {
    if (btn.dataset.type === '__all__') {
      btn.classList.toggle('selected', state.selectedTypes.length === 0);
    } else {
      btn.classList.toggle('selected', state.selectedTypes.includes(btn.dataset.type));
    }
  });
}

function getFilteredPool() {
  return QUESTIONS.filter(q => {
    const catOk  = state.selectedCategories.length === 0 || state.selectedCategories.includes(q.category);
    const typeOk = state.selectedTypes.length === 0 || state.selectedTypes.includes(q.type);
    return catOk && typeOk;
  });
}

function updateAvailableCount() {
  const pool = getFilteredPool();
  const count = document.getElementById('available-count');
  if (count) count.textContent = '선택 가능: ' + pool.length + '문제';
  const maxSel = parseInt(document.getElementById('q-count-select').value, 10);
  const realMax = Math.min(pool.length, 50);
  const btn = document.getElementById('btn-start-quiz');
  if (btn) btn.disabled = pool.length === 0;
  // Clamp select options
  const sel = document.getElementById('q-count-select');
  if (sel) {
    [...sel.options].forEach(opt => {
      opt.disabled = parseInt(opt.value, 10) > pool.length;
    });
    if (parseInt(sel.value, 10) > pool.length && pool.length > 0) {
      sel.value = [...sel.options].filter(o => !o.disabled).slice(-1)[0]?.value || sel.options[0].value;
    }
  }
}

function renderStats() {
  const stats = loadStats();
  const total = Object.values(stats).reduce((s, c) => s + (c.total || 0), 0);
  const correct = Object.values(stats).reduce((s, c) => s + (c.correct || 0), 0);
  const notes = loadNotes();
  const noteCount = Object.keys(notes).length;

  const sTotal   = document.getElementById('stat-total');
  const sCorrect = document.getElementById('stat-correct');
  const sPct     = document.getElementById('stat-pct');
  const sNotes   = document.getElementById('stat-notes');
  if (sTotal)   sTotal.textContent   = total;
  if (sCorrect) sCorrect.textContent = correct;
  if (sPct)     sPct.textContent     = total ? Math.round(correct / total * 100) + '%' : '—';
  if (sNotes)   sNotes.textContent   = noteCount;

  // Category accuracy bars
  const catDiv = document.getElementById('cat-accuracy');
  if (!catDiv) return;
  catDiv.innerHTML = '';
  getCategories().forEach(cat => {
    const s = stats[cat] || { total: 0, correct: 0 };
    if (s.total === 0) return;
    const pct = Math.round(s.correct / s.total * 100);
    catDiv.innerHTML += `
      <div class="cat-row">
        <span class="cat-name">${cat}</span>
        <div class="cat-bar-bg"><div class="cat-bar" style="width:${pct}%"></div></div>
        <span class="cat-pct">${pct}%</span>
      </div>`;
  });
  if (!catDiv.innerHTML) catDiv.innerHTML = '<p style="font-size:.85rem;color:var(--text3)">아직 풀이 기록이 없습니다.</p>';
}

// ── Start Quiz ────────────────────────────────────────────────
function startQuiz() {
  const pool = getFilteredPool();
  if (pool.length === 0) { alert('선택한 조건에 맞는 문제가 없습니다.'); return; }
  const n = Math.min(parseInt(document.getElementById('q-count-select').value, 10), pool.length);
  state.sessionQuestions = shuffleArray([...pool]).slice(0, n);
  state.answers = {};
  state.graded  = {};
  state.notesDraft = {};
  renderQuiz();
  showScreen('quiz');
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Quiz Rendering ────────────────────────────────────────────
function renderQuiz() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';
  const total = state.sessionQuestions.length;
  updateProgress(0, total);
  state.sessionQuestions.forEach((q, idx) => {
    container.appendChild(buildQuestionCard(q, idx + 1));
  });
}

function buildQuestionCard(q, num) {
  const card = document.createElement('div');
  card.className = 'q-card';
  card.id = 'qcard-' + q.id;

  const sourceLabel = q.source?.lecture || '';

  card.innerHTML = `
    <div class="q-card-header">
      <span class="q-num">문제 ${num}</span>
      <span class="q-category-badge">${q.category}</span>
      <span class="q-type-badge">${TYPE_LABELS[q.type] || q.type}</span>
    </div>
    <div class="q-body">
      <p class="q-prompt">${escapeHtml(q.prompt)}</p>
      <div class="q-answer-area" id="qa-${q.id}"></div>
      <div>
        <button class="btn-submit" id="submit-${q.id}">제출</button>
      </div>
      <div class="feedback" id="fb-${q.id}"></div>
      <div class="note-section" id="note-section-${q.id}">
        <h4>📝 오답노트 작성</h4>
        <textarea class="note-textarea" id="note-ta-${q.id}" placeholder="이 문제에서 내가 놓친 개념을 정리해보세요...">${escapeHtml(loadNotes()[q.id] || '')}</textarea>
        <br><button class="btn-save-note" id="save-note-${q.id}">노트 저장</button>
      </div>
    </div>`;

  // Build answer area
  const qaDiv = card.querySelector('#qa-' + q.id);
  switch (q.type) {
    case 'short':
    case 'code-explain':
      qaDiv.innerHTML = q.type === 'code-explain'
        ? '<div class="code-block"><pre>' + escapeHtml(q.code) + '</pre></div>'
        : '';
      const ta = document.createElement('textarea');
      ta.className = 'short-textarea';
      ta.id = 'ans-' + q.id;
      ta.placeholder = q.type === 'code-explain'
        ? '위 코드의 문제점과 수정 방법을 설명하세요...'
        : '답을 영어로 작성하세요...';
      qaDiv.appendChild(ta);
      break;

    case 'blank':
      qaDiv.innerHTML = buildBlankText(q);
      break;

    case 'ox':
      qaDiv.innerHTML = buildOXSubs(q);
      break;

    case 'code-blank':
      qaDiv.innerHTML = buildCodeBlank(q);
      break;
  }

  // Submit handler
  const submitBtn = card.querySelector('#submit-' + q.id);
  submitBtn.addEventListener('click', () => handleSubmit(q, card));

  // Note save handler
  const saveNoteBtn = card.querySelector('#save-note-' + q.id);
  saveNoteBtn.addEventListener('click', () => {
    const text = card.querySelector('#note-ta-' + q.id).value;
    const notes = loadNotes();
    if (text.trim()) notes[q.id] = text.trim();
    else delete notes[q.id];
    saveNotes(notes);
    saveNoteBtn.textContent = '✓ 저장됨';
    setTimeout(() => { saveNoteBtn.textContent = '노트 저장'; }, 1500);
    // Refresh notes screen if open
    renderNotesScreen();
  });

  return card;
}

function buildBlankText(q) {
  let html = '<div class="blank-text-wrap">';
  let text = escapeHtml(q.text);
  let blankIdx = 0;
  text = text.replace(/___BLANK(\d+)___/g, (_, n) => {
    const i = parseInt(n, 10) - 1;
    return `<input class="inline-blank" data-blank="${i}" id="blank-${q.id}-${i}" type="text" placeholder="답 ${n}" autocomplete="off">`;
  });
  html += text + '</div>';
  return html;
}

function buildOXSubs(q) {
  let html = '<div class="ox-sub-list">';
  q.subs.forEach((sub, i) => {
    html += `
      <div class="ox-sub" id="ox-sub-${q.id}-${i}">
        <span class="ox-statement">${i + 1}. ${escapeHtml(sub.statement)}</span>
        <div class="ox-buttons">
          <button class="ox-btn" data-qid="${q.id}" data-sub="${i}" data-val="true">O (참)</button>
          <button class="ox-btn" data-qid="${q.id}" data-sub="${i}" data-val="false">X (거짓)</button>
        </div>
      </div>
      <div class="sub-explanation" id="sub-exp-${q.id}-${i}">${escapeHtml(sub.explanation)}</div>`;
  });
  html += '</div>';
  return html;
}

function buildCodeBlank(q) {
  let code = escapeHtml(q.code);
  let blankIdx = 0;
  code = code.replace(/___BLANK(\d+)___/g, (_, n) => {
    const i = parseInt(n, 10) - 1;
    return `<input class="blank-input" data-blank="${i}" id="cblank-${q.id}-${i}" type="text" placeholder="_${n}_" size="12" autocomplete="off">`;
  });
  return '<div class="code-block"><pre>' + code + '</pre></div>';
}

// ── OX button toggle (event delegation) ──────────────────────
document.getElementById('quiz-container').addEventListener('click', (e) => {
  if (!e.target.classList.contains('ox-btn')) return;
  const { qid, sub, val } = e.target.dataset;
  const subDiv = document.getElementById('ox-sub-' + qid + '-' + sub);
  subDiv.querySelectorAll('.ox-btn').forEach(b => {
    b.classList.remove('selected-true', 'selected-false');
  });
  e.target.classList.add(val === 'true' ? 'selected-true' : 'selected-false');
  if (!state.answers[qid]) state.answers[qid] = {};
  state.answers[qid][sub] = val === 'true';
});

// ── Submit Handler ────────────────────────────────────────────
function handleSubmit(q, card) {
  if (state.graded[q.id]) return;

  let correct = false;
  let fbHtml  = '';

  switch (q.type) {
    case 'short':
    case 'code-explain': {
      const ta = document.getElementById('ans-' + q.id);
      const userAns = ta ? ta.value.trim() : '';
      if (!userAns) { ta.style.borderColor = 'var(--error)'; return; }
      const result = gradeShort(userAns, q.keywords);
      correct = result.correct;
      fbHtml = buildShortFeedback(result, q, correct);
      if (ta) ta.readOnly = true;
      break;
    }

    case 'blank': {
      const inputs = card.querySelectorAll('.inline-blank');
      const userBlanks = [...inputs].map(inp => inp.value.trim());
      if (userBlanks.some(v => v === '')) {
        inputs.forEach(inp => { if (!inp.value.trim()) inp.style.borderColor = 'var(--error)'; });
        return;
      }
      const results = gradeBlank(userBlanks, q.blanks);
      correct = results.every(Boolean);
      results.forEach((ok, i) => {
        inputs[i].classList.add(ok ? 'correct-blank' : 'wrong-blank');
        inputs[i].readOnly = true;
      });
      fbHtml = buildBlankFeedback(results, q, correct);
      break;
    }

    case 'ox': {
      const subCount = q.subs.length;
      const userSubs = q.subs.map((_, i) => {
        const btn = card.querySelector(`.ox-btn[data-qid="${q.id}"][data-sub="${i}"].selected-true, .ox-btn[data-qid="${q.id}"][data-sub="${i}"].selected-false`);
        if (!btn) return null;
        return btn.dataset.val === 'true';
      });
      if (userSubs.includes(null)) { alert('모든 소문제를 선택해주세요.'); return; }
      const results = gradeOX(userSubs, q.subs);
      correct = results.every(Boolean);
      results.forEach((ok, i) => {
        const subDiv = document.getElementById('ox-sub-' + q.id + '-' + i);
        subDiv.classList.add(ok ? 'correct' : 'wrong');
        const expDiv = document.getElementById('sub-exp-' + q.id + '-' + i);
        if (expDiv) expDiv.classList.add('show');
        subDiv.querySelectorAll('.ox-btn').forEach(b => b.disabled = true);
      });
      fbHtml = buildOXFeedback(results, q, correct);
      break;
    }

    case 'code-blank': {
      const inputs = card.querySelectorAll('.blank-input');
      const userBlanks = [...inputs].map(inp => inp.value.trim());
      if (userBlanks.some(v => v === '')) {
        inputs.forEach(inp => { if (!inp.value.trim()) inp.style.borderColor = 'var(--error)'; });
        return;
      }
      const results = gradeBlank(userBlanks, q.blanks);
      correct = results.every(Boolean);
      results.forEach((ok, i) => {
        inputs[i].classList.add(ok ? 'correct-blank' : 'wrong-blank');
        inputs[i].readOnly = true;
      });
      fbHtml = buildBlankFeedback(results, q, correct);
      break;
    }
  }

  // Show feedback
  const fbDiv = document.getElementById('fb-' + q.id);
  fbDiv.className = 'feedback show ' + (correct ? 'correct' : 'wrong');
  fbDiv.innerHTML = fbHtml;
  card.classList.add(correct ? 'graded-correct' : 'graded-wrong');

  // Show note area if wrong
  const noteSection = document.getElementById('note-section-' + q.id);
  if (!correct) noteSection.classList.add('show');

  // Disable submit
  const submitBtn = document.getElementById('submit-' + q.id);
  submitBtn.disabled = true;
  submitBtn.textContent = correct ? '✓ 정답' : '✗ 오답';

  // Update state & stats
  state.graded[q.id] = correct;
  updateStats(q.category, correct);
  updateProgress(Object.keys(state.graded).length, state.sessionQuestions.length);
}

// ── Feedback builders ─────────────────────────────────────────
function buildShortFeedback(result, q, correct) {
  const source = q.source?.lecture ? `<div class="feedback-source">📖 출처: ${escapeHtml(q.source.lecture)}</div>` : '';
  if (correct) {
    return `<div class="feedback-title">✅ 정답입니다!</div>
            <div class="keyword-row">${result.hitRequired.map(k=>`<span class="kw-tag hit">${k}</span>`).join('')}${result.hitOptional.map(k=>`<span class="kw-tag hit">${k}</span>`).join('')}</div>
            ${source}`;
  }
  const missR = result.missRequired.length
    ? `<div style="margin-top:4px">❗ 필수 키워드 미포함: <b>${result.missRequired.join(', ')}</b></div>` : '';
  return `<div class="feedback-title">❌ 오답</div>
          <div class="keyword-row">${result.hitRequired.map(k=>`<span class="kw-tag hit">${k}</span>`).join('')}${result.hitOptional.map(k=>`<span class="kw-tag hit">${k}</span>`).join('')}${result.missRequired.map(k=>`<span class="kw-tag miss">${k}</span>`).join('')}</div>
          ${missR}
          <div class="feedback-answer"><strong>모범 답안:</strong>${escapeHtml(q.modelAnswer)}</div>
          ${source}`;
}

function buildBlankFeedback(results, q, correct) {
  const source = q.source?.lecture ? `<div class="feedback-source">📖 출처: ${escapeHtml(q.source.lecture)}</div>` : '';
  const perBlank = results.map((ok, i) =>
    ok ? `<span class="kw-tag hit">빈칸${i+1} 정답</span>` : `<span class="kw-tag miss">빈칸${i+1} 오답 (정답: ${escapeHtml(q.blanks[i]?.[0] || '?')})</span>`
  ).join('');
  return `<div class="feedback-title">${correct ? '✅ 모든 빈칸 정답!' : '❌ 일부 빈칸 오답'}</div>
          <div class="keyword-row">${perBlank}</div>
          ${!correct ? `<div class="feedback-answer"><strong>모범 답안:</strong>${escapeHtml(q.modelAnswer)}</div>` : ''}
          ${source}`;
}

function buildOXFeedback(results, q, correct) {
  const source = q.source?.lecture ? `<div class="feedback-source">📖 출처: ${escapeHtml(q.source.lecture)}</div>` : '';
  const score = results.filter(Boolean).length;
  return `<div class="feedback-title">${correct ? '✅ 완벽 정답!' : `❌ ${score}/${results.length} 정답`}</div>
          ${!correct ? `<div class="feedback-answer"><strong>정답 확인:</strong> 위 각 소문제의 해설을 확인하세요.</div>` : ''}
          ${source}`;
}

// ── Progress & Stats ──────────────────────────────────────────
function updateProgress(done, total) {
  const pi = document.getElementById('progress-info');
  const pb = document.getElementById('progress-bar');
  const sd = document.getElementById('score-display');
  const correct = Object.values(state.graded).filter(Boolean).length;
  if (pi) pi.textContent = `${done} / ${total} 제출`;
  if (pb) pb.style.width = (total ? done / total * 100 : 0) + '%';
  if (sd) sd.textContent = `${correct} / ${done} 정답`;

  // Auto show summary when all done
  if (done === total && total > 0) {
    setTimeout(showSummary, 800);
  }
}

function updateStats(category, correct) {
  const stats = loadStats();
  if (!stats[category]) stats[category] = { total: 0, correct: 0 };
  stats[category].total++;
  if (correct) stats[category].correct++;
  saveStats(stats);
  renderStats();
}

// ── Summary Screen ────────────────────────────────────────────
function showSummary() {
  const total = state.sessionQuestions.length;
  const correct = Object.values(state.graded).filter(Boolean).length;
  const pct = total ? Math.round(correct / total * 100) : 0;

  document.getElementById('summary-score').textContent = `${correct} / ${total}`;
  document.getElementById('summary-pct').textContent   = `정답률 ${pct}%`;

  const msg = pct >= 90 ? '🎉 훌륭합니다! 완벽에 가까운 점수입니다.'
            : pct >= 70 ? '👍 좋습니다! 조금만 더 복습하면 완벽합니다.'
            : pct >= 50 ? '📚 절반 이상 맞췄습니다. 오답노트로 복습해보세요.'
            : '💪 더 열심히 공부해봅시다! 오답노트를 활용하세요.';
  document.getElementById('summary-msg').textContent = msg;

  // Wrong questions list
  const wrongList = document.getElementById('summary-wrong-list');
  wrongList.innerHTML = '';
  const wrongQs = state.sessionQuestions.filter(q => state.graded[q.id] === false);
  if (wrongQs.length === 0) {
    wrongList.innerHTML = '<p style="text-align:center;color:var(--success);font-weight:700;padding:16px">전부 정답! 🎊</p>';
  } else {
    wrongQs.forEach(q => {
      const item = document.createElement('div');
      item.className = 'wrong-item';
      item.innerHTML = `<div class="wi-cat">${q.category}</div><div class="wi-q">${escapeHtml(q.prompt.slice(0, 80))}${q.prompt.length > 80 ? '…' : ''}</div>`;
      wrongList.appendChild(item);
    });
  }

  showScreen('summary');
}

// ── Notes Screen ──────────────────────────────────────────────
function renderNotesScreen() {
  const notes = loadNotes();
  const container = document.getElementById('notes-container');
  container.innerHTML = '';

  const catFilter = document.getElementById('notes-cat-filter')?.value || '__all__';
  const search    = (document.getElementById('notes-search')?.value || '').toLowerCase();

  const noteQs = QUESTIONS.filter(q => {
    if (!notes[q.id]) return false;
    if (catFilter !== '__all__' && q.category !== catFilter) return false;
    if (search && !q.prompt.toLowerCase().includes(search) && !notes[q.id].toLowerCase().includes(search)) return false;
    return true;
  });

  if (noteQs.length === 0) {
    container.innerHTML = '<div class="notes-empty">저장된 오답노트가 없습니다.<br>문제를 풀고 틀린 문제에 노트를 작성해보세요.</div>';
    return;
  }

  noteQs.forEach(q => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
      <div class="note-card-header">
        <div class="nc-meta">
          <div class="nc-cat">${escapeHtml(q.category)} · ${TYPE_LABELS[q.type]}</div>
          <div class="nc-q">${escapeHtml(q.prompt.slice(0, 100))}${q.prompt.length > 100 ? '…' : ''}</div>
        </div>
        <button class="btn-delete-note" data-qid="${q.id}">삭제</button>
      </div>
      <textarea class="note-edit-area" id="note-edit-${q.id}">${escapeHtml(notes[q.id])}</textarea>
      <div class="note-actions">
        <button class="btn-save-edit" data-qid="${q.id}">저장</button>
        <span class="note-saved-tag" id="note-saved-${q.id}">✓ 저장됨</span>
      </div>`;
    container.appendChild(card);
  });

  container.querySelectorAll('.btn-save-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = parseInt(btn.dataset.qid, 10);
      const text = document.getElementById('note-edit-' + qid).value.trim();
      const notes2 = loadNotes();
      if (text) notes2[qid] = text; else delete notes2[qid];
      saveNotes(notes2);
      const tag = document.getElementById('note-saved-' + qid);
      if (tag) { tag.classList.add('show'); setTimeout(() => tag.classList.remove('show'), 1500); }
    });
  });

  container.querySelectorAll('.btn-delete-note').forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = parseInt(btn.dataset.qid, 10);
      const notes2 = loadNotes();
      delete notes2[qid];
      saveNotes(notes2);
      renderNotesScreen();
      renderStats();
    });
  });
}

function buildNotesFilters() {
  const sel = document.getElementById('notes-cat-filter');
  if (!sel) return;
  sel.innerHTML = '<option value="__all__">전체 카테고리</option>';
  getCategories().forEach(cat => {
    sel.innerHTML += `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`;
  });
  sel.addEventListener('change', renderNotesScreen);
  const searchInput = document.getElementById('notes-search');
  if (searchInput) searchInput.addEventListener('input', renderNotesScreen);
}

// ── Utility ───────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Nav buttons
  document.querySelectorAll('.header-nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.screen;
      if (target === 'notes') {
        renderNotesScreen();
      } else if (target === 'home') {
        renderStats();
        buildCategoryChips();
      }
      showScreen(target);
    });
  });

  // Home actions
  document.getElementById('btn-start-quiz').addEventListener('click', startQuiz);
  document.getElementById('q-count-select').addEventListener('change', updateAvailableCount);

  // Summary actions
  document.getElementById('btn-retry').addEventListener('click', () => {
    showScreen('quiz');
    state.graded = {};
    renderQuiz();
  });
  document.getElementById('btn-new-quiz').addEventListener('click', () => {
    renderStats();
    buildCategoryChips();
    showScreen('home');
  });
  document.getElementById('btn-view-notes').addEventListener('click', () => {
    renderNotesScreen();
    showScreen('notes');
  });

  // End session button in quiz
  document.getElementById('btn-end-session').addEventListener('click', () => {
    if (!Object.keys(state.graded).length && !confirm('아직 제출한 문제가 없습니다. 홈으로 돌아가시겠습니까?')) return;
    showSummary();
  });

  // Build home
  buildHome();
  buildNotesFilters();
  showScreen('home');
});
