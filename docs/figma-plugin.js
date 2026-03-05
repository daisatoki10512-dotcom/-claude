// ============================================================
// humu アプリ Figma デザイン自動生成スクリプト
// 使い方: Figma で Plugins > Development > Open Console に貼り付けて実行
// ============================================================

const C = {
  bg:            { r: 0.898, g: 0.961, b: 0.937, a: 1 },
  card:          { r: 1,     g: 1,     b: 1,     a: 1 },
  textPrimary:   { r: 0.102, g: 0.102, b: 0.102, a: 1 },
  textSecondary: { r: 0.420, g: 0.447, b: 0.502, a: 1 },
  teal:          { r: 0.165, g: 0.627, b: 0.565, a: 1 },
  tealLight:     { r: 0.878, g: 0.969, b: 0.941, a: 1 },
  disabled:      { r: 0.898, g: 0.910, b: 0.922, a: 1 },
  disabledText:  { r: 0.612, g: 0.639, b: 0.675, a: 1 },
  border:        { r: 0.898, g: 0.910, b: 0.922, a: 1 },
  tagBg:         { r: 0.953, g: 0.957, b: 0.965, a: 1 },
  tagText:       { r: 0.216, g: 0.255, b: 0.318, a: 1 },
  white:         { r: 1,     g: 1,     b: 1,     a: 1 },
};

// ── ムード定義（添付画像に合わせた色・表情） ──────────────────
// 順序: crying(紫) → sad(青) → neutral(シアン) → happy(緑) → happy-big(黄)
const MOODS = [
  {
    key: 'crying',
    center: { r: 0.80, g: 0.68, b: 1.00, a: 1 },  // ライトラベンダー
    edge:   { r: 0.56, g: 0.36, b: 0.94, a: 1 },  // ミディアムパープル
    face:   { r: 0.33, g: 0.07, b: 0.55, a: 1 },  // ダークパープル
  },
  {
    key: 'sad',
    center: { r: 0.62, g: 0.80, b: 1.00, a: 1 },  // ライトブルー
    edge:   { r: 0.28, g: 0.55, b: 0.94, a: 1 },  // ミディアムブルー
    face:   { r: 0.08, g: 0.20, b: 0.62, a: 1 },  // ダークネイビー
  },
  {
    key: 'neutral',
    center: { r: 0.62, g: 0.98, b: 0.91, a: 1 },  // ライトシアン
    edge:   { r: 0.18, g: 0.84, b: 0.72, a: 1 },  // ミディアムティール
    face:   { r: 0.02, g: 0.40, b: 0.36, a: 1 },  // ダークティール
  },
  {
    key: 'happy',
    center: { r: 0.80, g: 1.00, b: 0.52, a: 1 },  // ライムグリーン
    edge:   { r: 0.48, g: 0.86, b: 0.24, a: 1 },  // ミディアムグリーン
    face:   { r: 0.04, g: 0.36, b: 0.04, a: 1 },  // ダークグリーン
  },
  {
    key: 'happy-big',
    center: { r: 1.00, g: 0.97, b: 0.68, a: 1 },  // ライトイエロー
    edge:   { r: 0.98, g: 0.78, b: 0.16, a: 1 },  // アンバーイエロー
    face:   { r: 0.72, g: 0.13, b: 0.08, a: 1 },  // ダークレッド
  },
];

const FRAME_W = 390, FRAME_H = 844, TAB_H = 83, PAD = 20, RADIUS = 16;

// ── フォントキャッシュ ────────────────────────────────────────
const _fonts = {};
async function loadFont(weight) {
  const style = weight === 'Bold' ? 'Bold' : weight === 'SemiBold' ? 'Semi Bold' : 'Regular';
  if (!_fonts[style]) {
    await figma.loadFontAsync({ family: 'Inter', style });
    _fonts[style] = true;
  }
  return style;
}

// ── ユーティリティ ────────────────────────────────────────────
function mkFrame(name, x, y, w, h, fill) {
  const f = figma.createFrame();
  f.name = name; f.x = x; f.y = y;
  f.resize(w, h);
  f.fills = fill ? [{ type: 'SOLID', color: fill }] : [];
  f.clipsContent = true;
  return f;
}

function mkRect(name, x, y, w, h, fill, r = 0) {
  const n = figma.createRectangle();
  n.name = name; n.x = x; n.y = y;
  n.resize(w, h);
  n.fills = [{ type: 'SOLID', color: fill }];
  n.cornerRadius = r;
  return n;
}

async function mkText(str, x, y, size, color, weight = 'Regular', maxW = null) {
  const style = await loadFont(weight);
  const t = figma.createText();
  t.fontName = { family: 'Inter', style };
  t.fontSize = size;
  t.fills = [{ type: 'SOLID', color }];
  t.characters = str;
  t.x = x; t.y = y;
  if (maxW) { t.textAutoResize = 'HEIGHT'; t.resize(maxW, t.height); }
  return t;
}

function dropShadow(node) {
  node.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.06 },
    offset: { x: 0, y: 2 }, radius: 8, spread: 0,
    visible: true, blendMode: 'NORMAL',
  }];
}

// ── グラデーション ─────────────────────────────────────────────
function radialGradFill(center, edge) {
  // GRADIENT_RADIAL: transform で中心(0.5,0.5)・半径0.5 のラジアル
  return [{
    type: 'GRADIENT_RADIAL',
    gradientTransform: [[0.5, 0, 0.5], [0, 0.5, 0.5]],
    gradientStops: [
      { position: 0, color: center },
      { position: 1, color: edge },
    ],
  }];
}

function linearGradFill(left, right) {
  return [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: left },
      { position: 1, color: right },
    ],
  }];
}

// ── 顔パーツ描画ヘルパー ──────────────────────────────────────
function addEllipse(parent, cx, cy, w, h, fill) {
  const e = figma.createEllipse();
  e.resize(w, h);
  e.x = cx - w / 2;
  e.y = cy - h / 2;
  e.fills = [{ type: 'SOLID', color: fill }];
  parent.appendChild(e);
  return e;
}

function addVec(parent, pathData, strokeColor, strokeW, fillColor = null) {
  const v = figma.createVector();
  v.vectorPaths = [{
    windingRule: fillColor ? 'EVENODD' : 'NONE',
    data: pathData,
  }];
  v.fills   = fillColor   ? [{ type: 'SOLID', color: fillColor }]   : [];
  v.strokes = strokeColor ? [{ type: 'SOLID', color: strokeColor }] : [];
  v.strokeWeight = strokeW;
  v.strokeCap    = 'ROUND';
  v.strokeJoin   = 'ROUND';
  parent.appendChild(v);
  return v;
}

// ── 顔を描画（ベクター）────────────────────────────────────────
// key: 'crying' | 'sad' | 'neutral' | 'happy' | 'happy-big'
// sz : 円の直径（ピクセル）
function drawFace(parent, key, sz, faceColor) {
  const sw   = Math.max(1.5, sz * 0.065);  // ストローク太さ
  const eyeD = Math.max(3,   sz * 0.095);  // 目ドット径

  // 目の座標
  const eyeY  = sz * 0.40;
  const eyeLx = sz * 0.33;
  const eyeRx = sz * 0.67;

  // 口の座標
  const mCx  = sz * 0.50;
  const mY   = sz * 0.63;
  const mHW  = sz * 0.21;  // 半幅

  if (key === 'happy-big') {
    // ── 閉じた目（上向き弧）──────────────────────────
    const eyeHW  = sz * 0.085;
    const eyeArc = sz * 0.065;
    for (const ex of [eyeLx, eyeRx]) {
      addVec(parent,
        `M ${ex - eyeHW} ${eyeY} Q ${ex} ${eyeY - eyeArc} ${ex + eyeHW} ${eyeY}`,
        faceColor, sw);
    }
    // ── 大きな笑顔 ───────────────────────────────────
    addVec(parent,
      `M ${mCx - mHW} ${mY} Q ${mCx} ${mY + sz * 0.14} ${mCx + mHW} ${mY}`,
      faceColor, sw * 1.2);

  } else {
    // ── 丸い目（ドット）──────────────────────────────
    addEllipse(parent, eyeLx, eyeY, eyeD, eyeD, faceColor);
    addEllipse(parent, eyeRx, eyeY, eyeD, eyeD, faceColor);

    // ── 口 ───────────────────────────────────────────
    const arcH = {
      crying:  -sz * 0.10,   // 下向き弧（悲しみ）
      sad:     -sz * 0.07,   // 軽い下向き弧
      neutral:  0,            // 水平線
      happy:    sz * 0.09,   // 上向き弧（微笑み）
    }[key] || 0;

    if (arcH === 0) {
      addVec(parent,
        `M ${mCx - mHW} ${mY} L ${mCx + mHW} ${mY}`,
        faceColor, sw);
    } else {
      addVec(parent,
        `M ${mCx - mHW} ${mY} Q ${mCx} ${mY + arcH} ${mCx + mHW} ${mY}`,
        faceColor, sw);
    }

    // ── 涙（crying のみ）────────────────────────────
    if (key === 'crying') {
      const tw = eyeD * 0.55;
      const th = eyeD * 0.85;
      // 左目の下
      addEllipse(parent, eyeLx + eyeD * 0.2, eyeY + eyeD * 1.35, tw, th, faceColor);
      // 右目の下
      addEllipse(parent, eyeRx + eyeD * 0.2, eyeY + eyeD * 1.35, tw, th, faceColor);
    }
  }
}

// ── ムード円（ラジアルグラデ + ベクター顔）────────────────────
function mkMoodCircle(moodKey, center, edge, faceColor, x, y, sz) {
  const c = mkFrame(`mood-${moodKey}`, x, y, sz, sz, center);
  c.cornerRadius = sz / 2;
  c.fills = radialGradFill(center, edge);
  drawFace(c, moodKey, sz, faceColor);
  return c;
}

// ── タグ列 ────────────────────────────────────────────────────
async function addTags(parent, tags, x, y) {
  let cx = x;
  for (const tag of tags) {
    const bg = mkFrame(`tag-${tag}`, cx, y, 10, 26, C.tagBg);
    bg.cornerRadius = 13;
    parent.appendChild(bg);
    const t = await mkText(tag, 10, 5, 11, C.tagText);
    bg.appendChild(t);
    bg.resize(t.width + 20, 26);
    cx += bg.width + 6;
  }
}

// ── タブバー ──────────────────────────────────────────────────
async function addTabBar(parent, active) {
  const bar = mkFrame('TabBar', 0, FRAME_H - TAB_H, FRAME_W, TAB_H, C.white);
  bar.appendChild(mkRect('border-top', 0, 0, FRAME_W, 1, C.border));

  const tabs = [
    { icon: '⌂',  label: 'ホーム',      idx: 0 },
    { icon: '💡', label: '気づき',      idx: 1 },
    { icon: '🔖', label: 'ブックマーク', idx: 2 },
    { icon: '📄', label: '記録',        idx: 3 },
    { icon: '👤', label: 'マイページ',  idx: 4 },
  ];
  const tw = FRAME_W / tabs.length;

  for (const tab of tabs) {
    const color = tab.idx === active ? C.teal : C.disabledText;
    const tx = tab.idx * tw;

    const icon = await mkText(tab.icon, tx + tw / 2 - 12, 12, 20, color);
    bar.appendChild(icon);

    const lbl = await mkText(tab.label, tx, 38, 10, color);
    lbl.resize(tw, lbl.height);
    lbl.textAlignHorizontal = 'CENTER';
    bar.appendChild(lbl);
  }

  parent.appendChild(bar);
}

// ══════════════════════════════════════════════════════════════
// ホーム画面
// ══════════════════════════════════════════════════════════════
async function buildHome(ox) {
  const s = mkFrame('ホーム', ox, 0, FRAME_W, FRAME_H, C.bg);
  figma.currentPage.appendChild(s);
  let y = 60;

  s.appendChild(await mkText('こんにちは、だいさん', PAD, y, 24, C.textPrimary, 'Bold', FRAME_W - PAD * 2));
  y += 36;
  s.appendChild(await mkText('今日を穏やかに過ごすために\n残りの時間はゆっくり過ごしましょうね。', PAD, y, 13, C.textSecondary, 'Regular', FRAME_W - PAD * 2));
  y += 52;

  s.appendChild(await mkText('今どんな気持ちですか？', PAD, y, 18, C.textPrimary, 'Bold'));
  y += 32;

  // ムードカード
  const mc = mkFrame('MoodCard', PAD, y, FRAME_W - PAD * 2, 148, C.white);
  mc.cornerRadius = RADIUS; dropShadow(mc); s.appendChild(mc);

  const sz = 52;
  const innerW = FRAME_W - PAD * 2 - 40;
  const gap    = (innerW - sz * MOODS.length) / (MOODS.length - 1);

  MOODS.forEach((m, i) => {
    const c = mkMoodCircle(m.key, m.center, m.edge, m.face, 20 + i * (sz + gap), 20, sz);
    mc.appendChild(c);
  });

  const btnBg = mkRect('記録するボタン', 20, 84, innerW, 44, C.disabled, 22);
  mc.appendChild(btnBg);
  const btnLbl = await mkText('記録する', 0, 84 + 12, 15, C.disabledText, 'SemiBold');
  btnLbl.x = (FRAME_W - PAD * 2 - btnLbl.width) / 2;
  mc.appendChild(btnLbl);
  y += 164;

  // ふりかえり
  s.appendChild(await mkText('ふりかえり', PAD, y, 18, C.textPrimary, 'Bold'));
  y += 32;

  const rc = mkFrame('ReviewCard', PAD, y, FRAME_W - PAD * 2, 260, C.white);
  rc.cornerRadius = RADIUS; dropShadow(rc); s.appendChild(rc);

  rc.appendChild(mkFrame('Illustration', 0, 0, FRAME_W - PAD * 2, 160, { r: 0.973, g: 0.980, b: 0.976, a: 1 }));
  rc.appendChild(await mkText('🌱  💧', (FRAME_W - PAD * 2) / 2 - 44, 52, 52, C.textPrimary));
  rc.appendChild(await mkText('自己理解を深めましょう！', 20, 172, 18, C.textPrimary, 'Bold', FRAME_W - PAD * 2 - 40));
  rc.appendChild(await mkText('記録を続けていくと同時に、あなたの自己理解につながるコンテンツ...', 20, 200, 13, C.textSecondary, 'Regular', FRAME_W - PAD * 2 - 40));

  await addTabBar(s, 0);
  return s;
}

// ══════════════════════════════════════════════════════════════
// 記録画面
// ══════════════════════════════════════════════════════════════
async function buildRecords(ox) {
  const s = mkFrame('記録', ox, 0, FRAME_W, FRAME_H, C.bg);
  figma.currentPage.appendChild(s);

  const hdr = mkFrame('Header', 0, 44, FRAME_W, 52, C.bg);
  s.appendChild(hdr);
  const htitle = await mkText('記録', 0, 14, 16, C.textPrimary, 'SemiBold');
  htitle.x = FRAME_W / 2 - htitle.width / 2;
  hdr.appendChild(htitle);
  hdr.appendChild(await mkText('🔍', 16, 14, 18, C.textPrimary));

  let y = 104;

  const sw2 = mkFrame('TabSwitch', PAD, y, FRAME_W - PAD * 2, 44, C.disabled);
  sw2.cornerRadius = 22; s.appendChild(sw2);
  const activeTab = mkRect('ActiveTab', 4, 4, (FRAME_W - PAD * 2) / 2 - 8, 36, C.white, 18);
  dropShadow(activeTab); sw2.appendChild(activeTab);
  const tl1 = await mkText('リスト', 0, 10, 13, C.textPrimary, 'SemiBold');
  tl1.x = ((FRAME_W - PAD * 2) / 2 - tl1.width) / 2;
  sw2.appendChild(tl1);
  const tl2 = await mkText('カレンダー', 0, 10, 13, C.textSecondary);
  tl2.x = (FRAME_W - PAD * 2) / 2 + ((FRAME_W - PAD * 2) / 2 - tl2.width) / 2;
  sw2.appendChild(tl2);
  y += 60;

  // 記録カード1 (sad = 青)
  s.appendChild(await mkText('11/9（土）', PAD, y, 15, C.textPrimary, 'Bold'));
  y += 26;

  const c1 = mkFrame('RecordCard1', PAD, y, FRAME_W - PAD * 2, 200, C.white);
  c1.cornerRadius = RADIUS; dropShadow(c1); s.appendChild(c1);

  const sadMood = MOODS.find(m => m.key === 'sad');
  const mc1 = mkMoodCircle('sad', sadMood.center, sadMood.edge, sadMood.face, 16, 16, 44);
  c1.appendChild(mc1);

  c1.appendChild(await mkText('相談したいのに、予定を合わせてもらえなかった', 70, 16, 14, C.textPrimary, 'Bold', FRAME_W - PAD * 2 - 110));
  c1.appendChild(await mkText('🔖', FRAME_W - PAD * 2 - 32, 16, 18, C.disabledText));
  c1.appendChild(await mkText('上司の方に相談を申し込んだのに、なかなか時間が決まらないと「嫌われているのかな」と不安になってしまいますよね...', 16, 78, 12, C.textSecondary, 'Regular', FRAME_W - PAD * 2 - 32));

  const aiBadge = mkFrame('AIBadge', 16, 128, 56, 26, C.tealLight);
  aiBadge.cornerRadius = 13; c1.appendChild(aiBadge);
  aiBadge.appendChild(await mkText('💬 AI 1', 8, 5, 11, C.teal, 'SemiBold'));

  await addTags(c1, ['不安', 'がっかり', '後悔', '職場関係'], 16, 162);
  y += 216;

  // 記録カード2 (neutral = シアン)
  s.appendChild(await mkText('11/8（金）', PAD, y, 15, C.textPrimary, 'Bold'));
  y += 26;

  const c2 = mkFrame('RecordCard2', PAD, y, FRAME_W - PAD * 2, 150, C.white);
  c2.cornerRadius = RADIUS; dropShadow(c2); s.appendChild(c2);

  const neutralMood = MOODS.find(m => m.key === 'neutral');
  const mc2 = mkMoodCircle('neutral', neutralMood.center, neutralMood.edge, neutralMood.face, 16, 16, 44);
  c2.appendChild(mc2);

  c2.appendChild(await mkText('職場での頼まれごとに戸惑いを覚えた', 70, 16, 14, C.textPrimary, 'Bold', FRAME_W - PAD * 2 - 90));
  c2.appendChild(await mkText('相手の意図が読み取れず、戸惑いが残ったようですね。本当はもっと明確な役割や期待を知りたかったから...', 16, 68, 12, C.textSecondary, 'Regular', FRAME_W - PAD * 2 - 32));
  await addTags(c2, ['不満', '職場関係'], 16, 112);

  await addTabBar(s, 3);
  return s;
}

// ══════════════════════════════════════════════════════════════
// 気づき画面
// ══════════════════════════════════════════════════════════════
async function buildInsights(ox) {
  const s = mkFrame('気づき', ox, 0, FRAME_W, FRAME_H, C.bg);
  figma.currentPage.appendChild(s);
  let y = 60;

  s.appendChild(await mkText('気づき', PAD, y, 24, C.textPrimary, 'Bold'));
  y += 44;
  s.appendChild(await mkText('新しい気づき', PAD, y, 16, C.textPrimary, 'Bold'));
  y += 28;

  const newCards = [
    { title: '他人と比較するのは禁物', desc: '他人と比較していると気分が落ち込んでいます。', emoji: '⚠️', bg: { r: 0.831, g: 0.537, b: 0.478, a: 1 }, textC: { r: 1, g: 0.9, b: 0.9, a: 1 } },
    { title: '小さな一歩を大切に',     desc: '毎日の積み重ねが大きな変化につながります。',     emoji: '🌿', bg: { r: 0.490, g: 0.722, b: 0.604, a: 1 }, textC: { r: 0.9, g: 1, b: 0.95, a: 1 } },
  ];
  for (const nc of newCards) {
    const ic = mkFrame(`InsightCard-${nc.title}`, PAD, y, FRAME_W - PAD * 2, 120, nc.bg);
    ic.cornerRadius = RADIUS; s.appendChild(ic);
    ic.appendChild(await mkText(nc.title, 20, 24, 16, C.white, 'Bold', 200));
    ic.appendChild(await mkText(nc.desc,  20, 52, 12, nc.textC, 'Regular', 200));
    ic.appendChild(await mkText(nc.emoji, FRAME_W - PAD * 2 - 64, 28, 44, C.white));
    y += 136;
  }

  s.appendChild(await mkText('過去の気づき', PAD, y, 16, C.textPrimary, 'Bold'));
  y += 28;

  const past = [
    { icon: '✨', bg: { r: 0.698, g: 0.910, b: 0.878, a: 1 }, title: '事前準備は心の余裕に',  desc: '予定を見通せると、不安が和らぐ傾向があります。', date: '2025/9/21' },
    { icon: '💡', bg: { r: 0.992, g: 0.910, b: 0.753, a: 1 }, title: '感情を言葉にする力',    desc: '感情を言語化することで自己理解が深まります。',   date: '2025/9/14' },
    { icon: '🌙', bg: { r: 0.878, g: 0.878, b: 0.969, a: 1 }, title: '睡眠と気分の深い関係',  desc: '休息が十分だと、感情の波が穏やかになります。',   date: '2025/9/7'  },
  ];
  for (const pi of past) {
    const pc = mkFrame(`Past-${pi.title}`, PAD, y, FRAME_W - PAD * 2, 88, C.white);
    pc.cornerRadius = RADIUS; dropShadow(pc); s.appendChild(pc);

    const ic2 = mkFrame('icon', 16, 20, 44, 44, pi.bg);
    ic2.cornerRadius = 22; pc.appendChild(ic2);
    ic2.appendChild(await mkText(pi.icon, 8, 9, 22, C.textPrimary));

    pc.appendChild(await mkText(pi.title, 72, 14, 14, C.textPrimary, 'Bold', FRAME_W - PAD * 2 - 90));
    pc.appendChild(await mkText(pi.desc,  72, 36, 12, C.textSecondary, 'Regular', FRAME_W - PAD * 2 - 90));
    pc.appendChild(await mkText(pi.date,  72, 62, 11, C.disabledText));
    y += 104;
  }

  await addTabBar(s, 1);
  return s;
}

// ══════════════════════════════════════════════════════════════
// マイページ画面
// ══════════════════════════════════════════════════════════════
async function buildMyPage(ox) {
  const s = mkFrame('マイページ', ox, 0, FRAME_W, FRAME_H, C.bg);
  figma.currentPage.appendChild(s);
  let y = 60;

  s.appendChild(await mkText('マイページ', PAD, y, 22, C.textPrimary, 'Bold'));
  y += 48;

  // プロフィールカード
  const pCard = mkFrame('ProfileCard', PAD, y, FRAME_W - PAD * 2, 112, C.white);
  pCard.cornerRadius = RADIUS; dropShadow(pCard); s.appendChild(pCard);

  const av = mkFrame('Avatar', 20, 20, 72, 72, C.teal);
  av.cornerRadius = 36; pCard.appendChild(av);
  av.appendChild(await mkText('だい', 14, 22, 20, C.white, 'Bold'));

  pCard.appendChild(await mkText('だいさん', 108, 20, 18, C.textPrimary, 'Bold'));
  pCard.appendChild(await mkText('記録 12日目', 108, 48, 13, C.textSecondary));

  const editBtn = mkFrame('EditBtn', FRAME_W - PAD * 2 - 76, 38, 68, 32, C.tealLight);
  editBtn.cornerRadius = 16; pCard.appendChild(editBtn);
  const editLbl = await mkText('編集', 0, 7, 13, C.teal, 'SemiBold');
  editLbl.x = (68 - editLbl.width) / 2;
  editBtn.appendChild(editLbl);
  y += 128;

  // 自己理解グリッド
  s.appendChild(await mkText('自己理解', PAD, y, 16, C.textPrimary, 'Bold'));
  y += 28;

  const gridItems = [
    { label: '強み',       emoji: '🏋️', l: { r: 0.761, g: 0.439, b: 0.188, a: 1 }, r: { r: 0.627, g: 0.314, b: 0.125, a: 1 } },
    { label: '価値観',     emoji: '🔺', l: { r: 0.227, g: 0.494, b: 0.761, a: 1 }, r: { r: 0.125, g: 0.376, b: 0.627, a: 1 } },
    { label: 'ストレス要因', emoji: '🤹', l: { r: 0.831, g: 0.157, b: 0.471, a: 1 }, r: { r: 0.690, g: 0.063, b: 0.376, a: 1 } },
    { label: '思考',       emoji: '🧘', l: { r: 0.439, g: 0.251, b: 0.753, a: 1 }, r: { r: 0.314, g: 0.125, b: 0.627, a: 1 } },
  ];
  const gw = (FRAME_W - PAD * 2 - 12) / 2;

  for (const [i, gi] of gridItems.entries()) {
    const col = i % 2, row = Math.floor(i / 2);
    const gf = mkFrame(`Grid-${gi.label}`, PAD + col * (gw + 12), y + row * (gw + 12), gw, gw, gi.l);
    gf.cornerRadius = RADIUS;
    gf.fills = linearGradFill(gi.l, gi.r);
    s.appendChild(gf);

    const em = await mkText(gi.emoji, 0, 0, 36, C.white);
    em.x = gw / 2 - em.width / 2;
    em.y = gw / 2 - 32;
    gf.appendChild(em);

    const lb = await mkText(gi.label, 0, 0, 14, C.white, 'Bold');
    lb.x = gw / 2 - lb.width / 2;
    lb.y = gw - 34;
    gf.appendChild(lb);
  }

  // 今週の気持ちチャート
  y += gw * 2 + 12 + 24;
  s.appendChild(await mkText('今週の気持ち', PAD, y, 16, C.textPrimary, 'Bold'));
  y += 28;

  const chartCard = mkFrame('MoodChart', PAD, y, FRAME_W - PAD * 2, 120, C.white);
  chartCard.cornerRadius = RADIUS; dropShadow(chartCard); s.appendChild(chartCard);

  // 曜日ごとのムードキーを指定
  const chartMoodKeys = ['happy-big', 'happy', 'neutral', 'sad', 'happy-big', 'happy', 'crying'];
  const days = ['月', '火', '水', '木', '金', '土', '日'];
  const csz = 32;
  const cInnerW = FRAME_W - PAD * 2 - 32;
  const cgap = (cInnerW - csz * 7) / 6;

  for (const [i, moodKey] of chartMoodKeys.entries()) {
    const m = MOODS.find(x => x.key === moodKey);
    const cx = 16 + i * (csz + cgap);
    const cc = mkMoodCircle(moodKey, m.center, m.edge, m.face, cx, 16, csz);
    chartCard.appendChild(cc);

    const dl = await mkText(days[i], cx, 58, 10, C.textSecondary);
    dl.resize(csz, dl.height);
    dl.textAlignHorizontal = 'CENTER';
    chartCard.appendChild(dl);
  }

  await addTabBar(s, 4);
  return s;
}

// ══════════════════════════════════════════════════════════════
// メイン
// ══════════════════════════════════════════════════════════════
(async () => {
  figma.currentPage.name = 'humu - App Screens';
  const GAP = 60;
  try {
    const home     = await buildHome(0);
    const records  = await buildRecords((FRAME_W + GAP) * 1);
    const insights = await buildInsights((FRAME_W + GAP) * 2);
    const mypage   = await buildMyPage((FRAME_W + GAP) * 3);

    figma.currentPage.selection = [home, records, insights, mypage];
    figma.viewport.scrollAndZoomIntoView([home, records, insights, mypage]);
    figma.notify('✅ humu 4画面を生成しました！');
  } catch(e) {
    figma.notify('❌ ' + e.message, { error: true });
    console.error(e);
  }
  figma.closePlugin();
})();
