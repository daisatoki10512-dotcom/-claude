// ============================================================
// humu アプリ Figma デザイン自動生成プラグイン
// 使い方: Figma で Plugins > Development > Run Script に貼り付けて実行
// ============================================================

// ── デザイントークン ─────────────────────────────────────────
const C = {
  bg: { r: 0.898, g: 0.961, b: 0.937, a: 1 },       // #E5F5EF
  card: { r: 1, g: 1, b: 1, a: 1 },                   // #FFFFFF
  textPrimary: { r: 0.102, g: 0.102, b: 0.102, a: 1 },// #1A1A1A
  textSecondary: { r: 0.420, g: 0.447, b: 0.502, a: 1 },// #6B7280
  teal: { r: 0.165, g: 0.627, b: 0.565, a: 1 },       // #2AA090
  tealLight: { r: 0.878, g: 0.969, b: 0.941, a: 1 },  // #E0F5F0
  disabled: { r: 0.898, g: 0.910, b: 0.922, a: 1 },   // #E5E7EB
  disabledText: { r: 0.612, g: 0.639, b: 0.675, a: 1 },// #9CA3AF
  border: { r: 0.898, g: 0.910, b: 0.922, a: 1 },     // #E5E7EB
  tabBg: { r: 1, g: 1, b: 1, a: 1 },
  tagBg: { r: 0.953, g: 0.957, b: 0.965, a: 1 },      // #F3F4F6
  tagText: { r: 0.216, g: 0.255, b: 0.318, a: 1 },    // #374151
  // ムードグラデ（左色）
  moodPurple: { r: 0.608, g: 0.498, b: 0.910, a: 1 }, // #9B7FE8
  moodBlue: { r: 0.494, g: 0.722, b: 0.941, a: 1 },   // #7EB8F0
  moodGreen: { r: 0.365, g: 0.847, b: 0.753, a: 1 },  // #5DD8C0
  moodLightGreen: { r: 0.553, g: 0.878, b: 0.541, a: 1 },// #8DE08A
  moodYellow: { r: 0.961, g: 0.816, b: 0.290, a: 1 }, // #F5D04A
  white: { r: 1, g: 1, b: 1, a: 1 },
};

const FRAME_W = 390;
const FRAME_H = 844;
const TAB_H = 83;
const PADDING = 20;
const CARD_RADIUS = 16;

// ── ユーティリティ ───────────────────────────────────────────
function hex(color) {
  const toHex = v => Math.round(v * 255).toString(16).padStart(2, '0');
  return '#' + toHex(color.r) + toHex(color.g) + toHex(color.b);
}

function frame(name, x, y, w, h, fill) {
  const f = figma.createFrame();
  f.name = name;
  f.x = x; f.y = y;
  f.resize(w, h);
  if (fill) f.fills = [{ type: 'SOLID', color: fill }];
  else f.fills = [];
  f.clipsContent = true;
  return f;
}

function rect(name, x, y, w, h, fill, radius = 0) {
  const r = figma.createRectangle();
  r.name = name;
  r.x = x; r.y = y;
  r.resize(w, h);
  r.fills = [{ type: 'SOLID', color: fill }];
  r.cornerRadius = radius;
  return r;
}

async function text(content, x, y, fontSize, color, fontWeight = 'Regular', maxWidth = null) {
  const t = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style: fontWeight === 'Bold' ? 'Bold' : fontWeight === 'SemiBold' ? 'Semi Bold' : 'Regular' });
  t.fontName = { family: 'Inter', style: fontWeight === 'Bold' ? 'Bold' : fontWeight === 'SemiBold' ? 'Semi Bold' : 'Regular' };
  t.fontSize = fontSize;
  t.fills = [{ type: 'SOLID', color: color }];
  t.characters = content;
  t.x = x; t.y = y;
  if (maxWidth) {
    t.textAutoResize = 'HEIGHT';
    t.resize(maxWidth, t.height);
  }
  return t;
}

function shadow(node) {
  node.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.06 },
    offset: { x: 0, y: 2 },
    radius: 8,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
}

function moodCircle(parent, emoji, colorLeft, colorRight, x, y, size) {
  const g = frame(`mood-${emoji}`, x, y, size, size, colorLeft);
  g.cornerRadius = size / 2;
  // グラデーション
  g.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: { ...colorLeft, a: 1 } },
      { position: 1, color: { ...colorRight, a: 1 } },
    ]
  }];
  const emojiNode = figma.createText();
  figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
    emojiNode.characters = emoji;
    emojiNode.fontSize = size * 0.5;
    emojiNode.x = (size - emojiNode.width) / 2;
    emojiNode.y = (size - emojiNode.height) / 2;
  });
  g.appendChild(emojiNode);
  parent.appendChild(g);
  return g;
}

// ── タブバー ──────────────────────────────────────────────────
async function createTabBar(parent, activeTab, yOffset) {
  const tabBar = frame('TabBar', 0, yOffset, FRAME_W, TAB_H, C.tabBg);

  // 上ボーダー
  const border = rect('border', 0, 0, FRAME_W, 1, C.border);
  tabBar.appendChild(border);

  const tabs = [
    { icon: '⌂', label: 'ホーム', index: 0 },
    { icon: '💡', label: '気づき', index: 1 },
    { icon: '🔖', label: 'ブックマーク', index: 2 },
    { icon: '📄', label: '記録', index: 3 },
    { icon: '👤', label: 'マイページ', index: 4 },
  ];

  const tabW = FRAME_W / tabs.length;
  for (const tab of tabs) {
    const isActive = tab.index === activeTab;
    const color = isActive ? C.teal : C.disabledText;
    const tx = tab.index * tabW;

    const iconNode = await text(tab.icon, tx + (tabW / 2) - 12, 12, 20, color);
    tabBar.appendChild(iconNode);

    const labelNode = await text(tab.label, tx, 38, 10, color);
    labelNode.resize(tabW, labelNode.height);
    labelNode.textAlignHorizontal = 'CENTER';
    tabBar.appendChild(labelNode);

    if (isActive) {
      // アクティブドット（テキスト色のみで表現）
    }
  }

  parent.appendChild(tabBar);
  return tabBar;
}

// ── ホーム画面 ────────────────────────────────────────────────
async function createHomeScreen(parentX) {
  const screen = frame('ホーム', parentX, 0, FRAME_W, FRAME_H, C.bg);
  figma.currentPage.appendChild(screen);

  let y = 60;

  // 挨拶
  const greetTitle = await text('こんにちは、 だいさん', PADDING, y, 24, C.textPrimary, 'Bold', FRAME_W - PADDING * 2);
  screen.appendChild(greetTitle);
  y += 36;

  const greetSub = await text('今日を穏やかに過ごすために\n残りの時間はゆっくり過ごしましょうね。', PADDING, y, 13, C.textSecondary, 'Regular', FRAME_W - PADDING * 2);
  screen.appendChild(greetSub);
  y += 52;

  // セクションタイトル
  const sTitle1 = await text('今どんな気持ちですか？', PADDING, y, 18, C.textPrimary, 'Bold');
  screen.appendChild(sTitle1);
  y += 32;

  // ムードカード
  const moodCard = frame('MoodCard', PADDING, y, FRAME_W - PADDING * 2, 148, C.card);
  moodCard.cornerRadius = CARD_RADIUS;
  shadow(moodCard);
  screen.appendChild(moodCard);

  // 5つのムード円
  const moods = [
    { emoji: '😢', left: C.moodPurple, right: { r: 0.486, g: 0.227, b: 0.929, a: 1 } },
    { emoji: '😔', left: C.moodBlue, right: { r: 0.290, g: 0.565, b: 0.851, a: 1 } },
    { emoji: '😐', left: C.moodGreen, right: { r: 0.106, g: 0.682, b: 0.580, a: 1 } },
    { emoji: '🙂', left: C.moodLightGreen, right: { r: 0.247, g: 0.722, b: 0.235, a: 1 } },
    { emoji: '😄', left: C.moodYellow, right: { r: 0.941, g: 0.627, b: 0.125, a: 1 } },
  ];

  const circleSize = 52;
  const totalCircles = moods.length;
  const cardInnerW = FRAME_W - PADDING * 2 - 40; // 20px padding inside card
  const gap = (cardInnerW - circleSize * totalCircles) / (totalCircles - 1);

  moods.forEach((mood, i) => {
    const cx = 20 + i * (circleSize + gap);
    const circle = frame(`mood-${mood.emoji}`, cx, 20, circleSize, circleSize, mood.left);
    circle.cornerRadius = circleSize / 2;
    circle.fills = [{
      type: 'GRADIENT_LINEAR',
      gradientTransform: [[0, 1, 0], [-1, 0, 1]],
      gradientStops: [
        { position: 0, color: mood.left },
        { position: 1, color: mood.right },
      ]
    }];
    moodCard.appendChild(circle);
  });

  // 記録するボタン（無効状態）
  const btnBg = rect('記録するボタン', 20, 84, cardInnerW, 44, C.disabled, 22);
  moodCard.appendChild(btnBg);
  const btnLabel = await text('記録する', 0, 84 + 12, 15, C.disabledText, 'SemiBold');
  btnLabel.x = (FRAME_W - PADDING * 2 - btnLabel.width) / 2;
  moodCard.appendChild(btnLabel);

  y += 164;

  // ふりかえりセクション
  const sTitle2 = await text('ふりかえり', PADDING, y, 18, C.textPrimary, 'Bold');
  screen.appendChild(sTitle2);
  y += 32;

  // ふりかえりカード
  const reviewCard = frame('ReviewCard', PADDING, y, FRAME_W - PADDING * 2, 260, C.card);
  reviewCard.cornerRadius = CARD_RADIUS;
  shadow(reviewCard);
  screen.appendChild(reviewCard);

  // イラストエリア
  const illArea = frame('IllustrationArea', 0, 0, FRAME_W - PADDING * 2, 160, { r: 0.973, g: 0.980, b: 0.976, a: 1 });
  reviewCard.appendChild(illArea);

  const illEmoji = await text('🌱 💧', (FRAME_W - PADDING * 2) / 2 - 40, 55, 56, C.textPrimary);
  reviewCard.appendChild(illEmoji);

  const reviewTitle = await text('自己理解を深めましょう！', 20, 172, 18, C.textPrimary, 'Bold', FRAME_W - PADDING * 2 - 40);
  reviewCard.appendChild(reviewTitle);

  const reviewDesc = await text('記録を続けていくと同時に、あなたの自己理解につながるコンテンツ...', 20, 200, 13, C.textSecondary, 'Regular', FRAME_W - PADDING * 2 - 40);
  reviewCard.appendChild(reviewDesc);

  await createTabBar(screen, 0, FRAME_H - TAB_H);

  return screen;
}

// ── 記録画面 ─────────────────────────────────────────────────
async function createRecordsScreen(parentX) {
  const screen = frame('記録', parentX, 0, FRAME_W, FRAME_H, C.bg);
  figma.currentPage.appendChild(screen);

  // ヘッダー
  const header = frame('Header', 0, 44, FRAME_W, 52, C.bg);
  screen.appendChild(header);
  const headerTitle = await text('記録', FRAME_W / 2 - 20, 14, 16, C.textPrimary, 'SemiBold');
  header.appendChild(headerTitle);
  const searchIcon = await text('🔍', 16, 14, 18, C.textPrimary);
  header.appendChild(searchIcon);

  let y = 104;

  // タブ切り替え
  const tabContainer = frame('TabSwitch', PADDING, y, FRAME_W - PADDING * 2, 44, C.disabled);
  tabContainer.cornerRadius = 22;
  screen.appendChild(tabContainer);

  const activeTabRect = rect('ActiveTab', 4, 4, (FRAME_W - PADDING * 2) / 2 - 8, 36, C.card, 18);
  shadow(activeTabRect);
  tabContainer.appendChild(activeTabRect);

  const tabLabel1 = await text('リスト', 0, 10, 13, C.textPrimary, 'SemiBold');
  tabLabel1.x = ((FRAME_W - PADDING * 2) / 2 - tabLabel1.width) / 2;
  tabContainer.appendChild(tabLabel1);

  const tabLabel2 = await text('カレンダー', 0, 10, 13, C.textSecondary, 'Regular');
  tabLabel2.x = (FRAME_W - PADDING * 2) / 2 + ((FRAME_W - PADDING * 2) / 2 - tabLabel2.width) / 2;
  tabContainer.appendChild(tabLabel2);

  y += 60;

  // 日付ヘッダー
  const dateHeader = await text('11/9（土）', PADDING, y, 15, C.textPrimary, 'Bold');
  screen.appendChild(dateHeader);
  y += 26;

  // 記録カード 1
  const card1 = frame('RecordCard1', PADDING, y, FRAME_W - PADDING * 2, 200, C.card);
  card1.cornerRadius = CARD_RADIUS;
  shadow(card1);
  screen.appendChild(card1);

  // ムード円
  const moodC1 = frame('mood', 16, 16, 44, 44, C.moodBlue);
  moodC1.cornerRadius = 22;
  moodC1.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: C.moodBlue },
      { position: 1, color: { r: 0.290, g: 0.565, b: 0.851, a: 1 } },
    ]
  }];
  card1.appendChild(moodC1);

  const moodEmoji1 = await text('😔', 8, 9, 22, C.white);
  moodC1.appendChild(moodEmoji1);

  const cardTitle1 = await text('相談したいのに、予定を合わせてもらえなかった', 70, 16, 14, C.textPrimary, 'Bold', FRAME_W - PADDING * 2 - 110);
  card1.appendChild(cardTitle1);

  const bookmark1 = await text('🔖', FRAME_W - PADDING * 2 - 32, 16, 18, C.disabledText);
  card1.appendChild(bookmark1);

  const desc1 = await text('上司の方に相談を申し込んだのに、なかなか時間が決まらないと「嫌われているのかな」と不安になってしまいますよね...', 16, 78, 12, C.textSecondary, 'Regular', FRAME_W - PADDING * 2 - 32);
  card1.appendChild(desc1);

  // AIバッジ
  const aiBadge = frame('AIBadge', 16, 128, 50, 26, C.tealLight);
  aiBadge.cornerRadius = 13;
  card1.appendChild(aiBadge);
  const aiText = await text('AI 1', 12, 5, 12, C.teal, 'SemiBold');
  aiBadge.appendChild(aiText);

  // 感情タグ
  const tags = ['不安', 'がっかり', '後悔', '職場関係'];
  let tagX = 16;
  for (const tag of tags) {
    const tagBg = frame(`tag-${tag}`, tagX, 162, 0, 26, C.tagBg);
    tagBg.cornerRadius = 13;
    card1.appendChild(tagBg);
    const tagText2 = await text(tag, 10, 5, 11, C.tagText);
    tagBg.appendChild(tagText2);
    tagBg.resize(tagText2.width + 20, 26);
    tagX += tagBg.width + 6;
  }

  y += 216;

  // 日付ヘッダー2
  const dateHeader2 = await text('11/8（金）', PADDING, y, 15, C.textPrimary, 'Bold');
  screen.appendChild(dateHeader2);
  y += 26;

  // 記録カード 2
  const card2 = frame('RecordCard2', PADDING, y, FRAME_W - PADDING * 2, 150, C.card);
  card2.cornerRadius = CARD_RADIUS;
  shadow(card2);
  screen.appendChild(card2);

  const moodC2 = frame('mood', 16, 16, 44, 44, C.moodGreen);
  moodC2.cornerRadius = 22;
  moodC2.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: C.moodGreen },
      { position: 1, color: { r: 0.106, g: 0.682, b: 0.580, a: 1 } },
    ]
  }];
  card2.appendChild(moodC2);

  const moodEmoji2 = await text('😐', 8, 9, 22, C.white);
  moodC2.appendChild(moodEmoji2);

  const cardTitle2 = await text('職場での頼まれごとに戸惑いを覚えた', 70, 16, 14, C.textPrimary, 'Bold', FRAME_W - PADDING * 2 - 90);
  card2.appendChild(cardTitle2);

  const desc2 = await text('相手の意図が読み取れず、戸惑いが残ったようですね。本当はもっと明確な役割や期待を知りたかったから...', 16, 68, 12, C.textSecondary, 'Regular', FRAME_W - PADDING * 2 - 32);
  card2.appendChild(desc2);

  const tags2 = ['不満', '職場関係'];
  let tagX2 = 16;
  for (const tag of tags2) {
    const tagBg = frame(`tag-${tag}`, tagX2, 116, 0, 26, C.tagBg);
    tagBg.cornerRadius = 13;
    card2.appendChild(tagBg);
    const tagText3 = await text(tag, 10, 5, 11, C.tagText);
    tagBg.appendChild(tagText3);
    tagBg.resize(tagText3.width + 20, 26);
    tagX2 += tagBg.width + 6;
  }

  await createTabBar(screen, 3, FRAME_H - TAB_H);
  return screen;
}

// ── 気づき画面 ────────────────────────────────────────────────
async function createInsightsScreen(parentX) {
  const screen = frame('気づき', parentX, 0, FRAME_W, FRAME_H, C.bg);
  figma.currentPage.appendChild(screen);

  let y = 60;

  const title = await text('気づき', PADDING, y, 24, C.textPrimary, 'Bold');
  screen.appendChild(title);
  y += 44;

  const newLabel = await text('新しい気づき', PADDING, y, 16, C.textPrimary, 'Bold');
  screen.appendChild(newLabel);
  y += 28;

  // 新しい気づきカード1 (サーモン背景)
  const iCard1 = frame('InsightCard1', PADDING, y, FRAME_W - PADDING * 2, 120, { r: 0.831, g: 0.537, b: 0.478, a: 1 });
  iCard1.cornerRadius = CARD_RADIUS;
  screen.appendChild(iCard1);
  const iTitle1 = await text('他人と比較するのは禁物', 20, 24, 16, C.white, 'Bold', 200);
  iCard1.appendChild(iTitle1);
  const iDesc1 = await text('他人と比較していると気分が落ち込んでいます。', 20, 52, 12, { r: 1, g: 0.9, b: 0.9, a: 1 }, 'Regular', 200);
  iCard1.appendChild(iDesc1);
  const iEmoji1 = await text('⚠️', FRAME_W - PADDING * 2 - 60, 30, 40, C.white);
  iCard1.appendChild(iEmoji1);
  y += 136;

  // 新しい気づきカード2 (グリーン背景)
  const iCard2 = frame('InsightCard2', PADDING, y, FRAME_W - PADDING * 2, 120, { r: 0.490, g: 0.722, b: 0.604, a: 1 });
  iCard2.cornerRadius = CARD_RADIUS;
  screen.appendChild(iCard2);
  const iTitle2 = await text('小さな一歩を大切に', 20, 24, 16, C.white, 'Bold', 200);
  iCard2.appendChild(iTitle2);
  const iDesc2 = await text('毎日の積み重ねが大きな変化につながります。', 20, 52, 12, { r: 0.9, g: 1, b: 0.95, a: 1 }, 'Regular', 200);
  iCard2.appendChild(iDesc2);
  const iEmoji2 = await text('🌿', FRAME_W - PADDING * 2 - 60, 30, 40, C.white);
  iCard2.appendChild(iEmoji2);
  y += 136;

  // 過去の気づき
  const pastLabel = await text('過去の気づき', PADDING, y, 16, C.textPrimary, 'Bold');
  screen.appendChild(pastLabel);
  y += 28;

  const pastInsights = [
    { icon: '✨', bg: { r: 0.698, g: 0.910, b: 0.878, a: 1 }, title: '事前準備は心の余裕に', desc: '予定を見通せると、不安が和らぐ傾向があります。', date: '2025/9/21' },
    { icon: '💡', bg: { r: 0.992, g: 0.910, b: 0.753, a: 1 }, title: '感情を言葉にする力', desc: '感情を言語化することで自己理解が深まります。', date: '2025/9/14' },
  ];

  for (const pi of pastInsights) {
    const piCard = frame(`PastInsight-${pi.title}`, PADDING, y, FRAME_W - PADDING * 2, 88, C.card);
    piCard.cornerRadius = CARD_RADIUS;
    shadow(piCard);
    screen.appendChild(piCard);

    const iconCircle = frame('icon', 16, 20, 44, 44, pi.bg);
    iconCircle.cornerRadius = 22;
    piCard.appendChild(iconCircle);
    const iconText = await text(pi.icon, 8, 9, 22, C.textPrimary);
    iconCircle.appendChild(iconText);

    const piTitle = await text(pi.title, 72, 16, 14, C.textPrimary, 'Bold', FRAME_W - PADDING * 2 - 90);
    piCard.appendChild(piTitle);
    const piDesc = await text(pi.desc, 72, 38, 12, C.textSecondary, 'Regular', FRAME_W - PADDING * 2 - 90);
    piCard.appendChild(piDesc);
    const piDate = await text(pi.date, 72, 62, 11, C.disabledText);
    piCard.appendChild(piDate);

    y += 104;
  }

  await createTabBar(screen, 1, FRAME_H - TAB_H);
  return screen;
}

// ── マイページ画面 ────────────────────────────────────────────
async function createMyPageScreen(parentX) {
  const screen = frame('マイページ', parentX, 0, FRAME_W, FRAME_H, C.bg);
  figma.currentPage.appendChild(screen);

  let y = 60;

  const title = await text('マイページ', PADDING, y, 22, C.textPrimary, 'Bold');
  screen.appendChild(title);
  y += 48;

  // プロフィールカード
  const profileCard = frame('ProfileCard', PADDING, y, FRAME_W - PADDING * 2, 120, C.card);
  profileCard.cornerRadius = CARD_RADIUS;
  shadow(profileCard);
  screen.appendChild(profileCard);

  const avatar = frame('Avatar', 20, 20, 72, 72, C.teal);
  avatar.cornerRadius = 36;
  profileCard.appendChild(avatar);
  const avatarText = await text('だい', 14, 22, 20, C.white, 'Bold');
  avatar.appendChild(avatarText);

  const userName = await text('だいさん', 108, 24, 18, C.textPrimary, 'Bold');
  profileCard.appendChild(userName);
  const userSub = await text('記録 12日目', 108, 52, 13, C.textSecondary);
  profileCard.appendChild(userSub);

  const editBtn = frame('EditBtn', FRAME_W - PADDING * 2 - 80, 44, 72, 32, C.tealLight);
  editBtn.cornerRadius = 16;
  profileCard.appendChild(editBtn);
  const editText = await text('編集', 20, 7, 13, C.teal, 'SemiBold');
  editBtn.appendChild(editText);

  y += 136;

  // 自己理解4グリッド
  const sectionLabel = await text('自己理解', PADDING, y, 16, C.textPrimary, 'Bold');
  screen.appendChild(sectionLabel);
  y += 28;

  const profileCards = [
    { label: '強み', emoji: '🏋️', left: { r: 0.761, g: 0.439, b: 0.188, a: 1 }, right: { r: 0.627, g: 0.314, b: 0.125, a: 1 } },
    { label: '価値観', emoji: '🔺', left: { r: 0.227, g: 0.494, b: 0.761, a: 1 }, right: { r: 0.125, g: 0.376, b: 0.627, a: 1 } },
    { label: 'ストレス要因', emoji: '🤹', left: { r: 0.831, g: 0.157, b: 0.471, a: 1 }, right: { r: 0.690, g: 0.063, b: 0.376, a: 1 } },
    { label: '思考', emoji: '🧘', left: { r: 0.439, g: 0.251, b: 0.753, a: 1 }, right: { r: 0.314, g: 0.125, b: 0.627, a: 1 } },
  ];

  const gridW = (FRAME_W - PADDING * 2 - 12) / 2;

  profileCards.forEach((pc, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = PADDING + col * (gridW + 12);
    const cy = y + row * (gridW + 12);

    const cardF = frame(`ProfileCard-${pc.label}`, cx, cy, gridW, gridW, pc.left);
    cardF.cornerRadius = CARD_RADIUS;
    cardF.fills = [{
      type: 'GRADIENT_LINEAR',
      gradientTransform: [[0, 1, 0], [-1, 0, 1]],
      gradientStops: [
        { position: 0, color: pc.left },
        { position: 1, color: pc.right },
      ]
    }];
    screen.appendChild(cardF);

    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
      const emojiNode = figma.createText();
      emojiNode.characters = pc.emoji;
      emojiNode.fontSize = 32;
      emojiNode.x = gridW / 2 - 16;
      emojiNode.y = gridW / 2 - 30;
      cardF.appendChild(emojiNode);
    });

    figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' }).then(() => {
      const labelNode = figma.createText();
      labelNode.fontName = { family: 'Inter', style: 'Semi Bold' };
      labelNode.characters = pc.label;
      labelNode.fontSize = 14;
      labelNode.fills = [{ type: 'SOLID', color: C.white }];
      labelNode.x = gridW / 2 - labelNode.width / 2;
      labelNode.y = gridW - 36;
      cardF.appendChild(labelNode);
    });
  });

  await createTabBar(screen, 4, FRAME_H - TAB_H);
  return screen;
}

// ── メイン実行 ───────────────────────────────────────────────
async function main() {
  figma.currentPage.name = 'humu - App Screens';

  const SPACING = 60;

  try {
    const home = await createHomeScreen(0);
    const records = await createRecordsScreen(FRAME_W + SPACING);
    const insights = await createInsightsScreen((FRAME_W + SPACING) * 2);
    const mypage = await createMyPageScreen((FRAME_W + SPACING) * 3);

    // 全フレームを選択してビューに合わせる
    figma.currentPage.selection = [home, records, insights, mypage];
    figma.viewport.scrollAndZoomIntoView([home, records, insights, mypage]);

    figma.notify('✅ humu アプリのデザインを生成しました！4画面作成完了');
  } catch (e) {
    figma.notify('❌ エラー: ' + e.message, { error: true });
    console.error(e);
  }

  figma.closePlugin();
}

main();
