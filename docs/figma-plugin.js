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
  moodPurple:    { r: 0.608, g: 0.498, b: 0.910, a: 1 },
  moodBlue:      { r: 0.494, g: 0.722, b: 0.941, a: 1 },
  moodGreen:     { r: 0.365, g: 0.847, b: 0.753, a: 1 },
  moodLightGreen:{ r: 0.553, g: 0.878, b: 0.541, a: 1 },
  moodYellow:    { r: 0.961, g: 0.816, b: 0.290, a: 1 },
  white:         { r: 1,     g: 1,     b: 1,     a: 1 },
};

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

function linearGrad(stops, angle = 'lr') {
  // angle 'lr' = left to right, 'tb' = top to bottom
  const tf = angle === 'tb' ? [[1, 0, 0], [0, 1, 0]] : [[0, 1, 0], [-1, 0, 1]];
  return { type: 'GRADIENT_LINEAR', gradientTransform: tf, gradientStops: stops };
}

function gradFill(left, right) {
  return [linearGrad([{ position: 0, color: left }, { position: 1, color: right }])];
}

function dropShadow(node) {
  node.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.06 },
    offset: { x: 0, y: 2 }, radius: 8, spread: 0,
    visible: true, blendMode: 'NORMAL',
  }];
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

// ── ムード円 ──────────────────────────────────────────────────
function mkMoodCircle(emoji, left, right, x, y, size) {
  const c = mkFrame(`mood-${emoji}`, x, y, size, size, left);
  c.cornerRadius = size / 2;
  c.fills = gradFill(left, right);
  return c;
}

// ── タブバー ──────────────────────────────────────────────────
async function addTabBar(parent, active) {
  const bar = mkFrame('TabBar', 0, FRAME_H - TAB_H, FRAME_W, TAB_H, C.white);
  bar.appendChild(mkRect('border-top', 0, 0, FRAME_W, 1, C.border));

  const tabs = [
    { icon: '⌂',  label: 'ホーム',    idx: 0 },
    { icon: '💡', label: '気づき',    idx: 1 },
    { icon: '🔖', label: 'ブックマーク', idx: 2 },
    { icon: '📄', label: '記録',      idx: 3 },
    { icon: '👤', label: 'マイページ', idx: 4 },
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

  const moods = [
    { e: '😢', l: C.moodPurple,     r: { r: 0.486, g: 0.227, b: 0.929, a: 1 } },
    { e: '😔', l: C.moodBlue,       r: { r: 0.290, g: 0.565, b: 0.851, a: 1 } },
    { e: '😐', l: C.moodGreen,      r: { r: 0.106, g: 0.682, b: 0.580, a: 1 } },
    { e: '🙂', l: C.moodLightGreen, r: { r: 0.247, g: 0.722, b: 0.235, a: 1 } },
    { e: '😄', l: C.moodYellow,     r: { r: 0.941, g: 0.627, b: 0.125, a: 1 } },
  ];
  const sz = 52, innerW = FRAME_W - PAD * 2 - 40;
  const gap = (innerW - sz * moods.length) / (moods.length - 1);
  moods.forEach((m, i) => {
    const c = mkMoodCircle(m.e, m.l, m.r, 20 + i * (sz + gap), 20, sz);
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

  const illArea = mkFrame('Illustration', 0, 0, FRAME_W - PAD * 2, 160, { r: 0.973, g: 0.980, b: 0.976, a: 1 });
  rc.appendChild(illArea);
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

  // ヘッダー
  const hdr = mkFrame('Header', 0, 44, FRAME_W, 52, C.bg);
  s.appendChild(hdr);
  const htitle = await mkText('記録', 0, 14, 16, C.textPrimary, 'SemiBold');
  htitle.x = FRAME_W / 2 - htitle.width / 2;
  hdr.appendChild(htitle);
  hdr.appendChild(await mkText('🔍', 16, 14, 18, C.textPrimary));

  let y = 104;

  // タブ切り替え
  const sw = mkFrame('TabSwitch', PAD, y, FRAME_W - PAD * 2, 44, C.disabled);
  sw.cornerRadius = 22; s.appendChild(sw);
  const activeTab = mkRect('ActiveTab', 4, 4, (FRAME_W - PAD * 2) / 2 - 8, 36, C.white, 18);
  dropShadow(activeTab); sw.appendChild(activeTab);
  const tl1 = await mkText('リスト', 0, 10, 13, C.textPrimary, 'SemiBold');
  tl1.x = ((FRAME_W - PAD * 2) / 2 - tl1.width) / 2;
  sw.appendChild(tl1);
  const tl2 = await mkText('カレンダー', 0, 10, 13, C.textSecondary);
  tl2.x = (FRAME_W - PAD * 2) / 2 + ((FRAME_W - PAD * 2) / 2 - tl2.width) / 2;
  sw.appendChild(tl2);
  y += 60;

  // 記録カード1
  s.appendChild(await mkText('11/9（土）', PAD, y, 15, C.textPrimary, 'Bold'));
  y += 26;

  const c1 = mkFrame('RecordCard1', PAD, y, FRAME_W - PAD * 2, 200, C.white);
  c1.cornerRadius = RADIUS; dropShadow(c1); s.appendChild(c1);

  const mc1 = mkFrame('mood', 16, 16, 44, 44, C.moodBlue);
  mc1.cornerRadius = 22;
  mc1.fills = gradFill(C.moodBlue, { r: 0.290, g: 0.565, b: 0.851, a: 1 });
  c1.appendChild(mc1);
  mc1.appendChild(await mkText('😔', 8, 9, 22, C.white));

  c1.appendChild(await mkText('相談したいのに、予定を合わせてもらえなかった', 70, 16, 14, C.textPrimary, 'Bold', FRAME_W - PAD * 2 - 110));
  c1.appendChild(await mkText('🔖', FRAME_W - PAD * 2 - 32, 16, 18, C.disabledText));
  c1.appendChild(await mkText('上司の方に相談を申し込んだのに、なかなか時間が決まらないと「嫌われているのかな」と不安になってしまいますよね...', 16, 78, 12, C.textSecondary, 'Regular', FRAME_W - PAD * 2 - 32));

  const aiBadge = mkFrame('AIBadge', 16, 128, 56, 26, C.tealLight);
  aiBadge.cornerRadius = 13; c1.appendChild(aiBadge);
  aiBadge.appendChild(await mkText('💬 AI 1', 8, 5, 11, C.teal, 'SemiBold'));

  await addTags(c1, ['不安', 'がっかり', '後悔', '職場関係'], 16, 162);
  y += 216;

  // 記録カード2
  s.appendChild(await mkText('11/8（金）', PAD, y, 15, C.textPrimary, 'Bold'));
  y += 26;

  const c2 = mkFrame('RecordCard2', PAD, y, FRAME_W - PAD * 2, 150, C.white);
  c2.cornerRadius = RADIUS; dropShadow(c2); s.appendChild(c2);

  const mc2 = mkFrame('mood', 16, 16, 44, 44, C.moodGreen);
  mc2.cornerRadius = 22;
  mc2.fills = gradFill(C.moodGreen, { r: 0.106, g: 0.682, b: 0.580, a: 1 });
  c2.appendChild(mc2);
  mc2.appendChild(await mkText('😐', 8, 9, 22, C.white));

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

  // 新しい気づきカード x2
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
    { icon: '✨', bg: { r: 0.698, g: 0.910, b: 0.878, a: 1 }, title: '事前準備は心の余裕に',  desc: '予定を見通せると、不安が和らぐ傾向があります。',   date: '2025/9/21' },
    { icon: '💡', bg: { r: 0.992, g: 0.910, b: 0.753, a: 1 }, title: '感情を言葉にする力',    desc: '感情を言語化することで自己理解が深まります。',     date: '2025/9/14' },
    { icon: '🌙', bg: { r: 0.878, g: 0.878, b: 0.969, a: 1 }, title: '睡眠と気分の深い関係',  desc: '休息が十分だと、感情の波が穏やかになります。',     date: '2025/9/7'  },
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
    gf.fills = gradFill(gi.l, gi.r);
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

  const chartMoods = [
    { e: '😄', l: C.moodYellow,     r: { r: 0.941, g: 0.627, b: 0.125, a: 1 } },
    { e: '🙂', l: C.moodLightGreen, r: { r: 0.247, g: 0.722, b: 0.235, a: 1 } },
    { e: '😐', l: C.moodGreen,      r: { r: 0.106, g: 0.682, b: 0.580, a: 1 } },
    { e: '😔', l: C.moodBlue,       r: { r: 0.290, g: 0.565, b: 0.851, a: 1 } },
    { e: '😄', l: C.moodYellow,     r: { r: 0.941, g: 0.627, b: 0.125, a: 1 } },
    { e: '🙂', l: C.moodLightGreen, r: { r: 0.247, g: 0.722, b: 0.235, a: 1 } },
    { e: '😢', l: C.moodPurple,     r: { r: 0.486, g: 0.227, b: 0.929, a: 1 } },
  ];
  const days = ['月', '火', '水', '木', '金', '土', '日'];
  const csz = 32, cInnerW = FRAME_W - PAD * 2 - 32;
  const cgap = (cInnerW - csz * 7) / 6;
  for (const [i, cm] of chartMoods.entries()) {
    const cx = 16 + i * (csz + cgap);
    const cc = mkMoodCircle(cm.e, cm.l, cm.r, cx, 16, csz);
    chartCard.appendChild(cc);
    const dl = await mkText(days[i], cx, 58, 10, C.textSecondary);
    dl.resize(csz, dl.height); dl.textAlignHorizontal = 'CENTER';
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
    const home    = await buildHome(0);
    const records = await buildRecords((FRAME_W + GAP) * 1);
    const insights= await buildInsights((FRAME_W + GAP) * 2);
    const mypage  = await buildMyPage((FRAME_W + GAP) * 3);

    figma.currentPage.selection = [home, records, insights, mypage];
    figma.viewport.scrollAndZoomIntoView([home, records, insights, mypage]);
    figma.notify('✅ humu 4画面を生成しました！');
  } catch(e) {
    figma.notify('❌ ' + e.message, { error: true });
    console.error(e);
  }
  figma.closePlugin();
})();
