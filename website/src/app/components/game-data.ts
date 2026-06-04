export interface Province {
  id: string;
  name: string;
}

export interface CountryInfo {
  id: string;
  name: string;
  flag: string;
  mapPos: { top: string; left: string; width: string; height: string };
  provinces: Province[];
}

export const COUNTRIES: CountryInfo[] = [
  {
    id: 'cn',
    name: '中国',
    flag: '🇨🇳',
    mapPos: { top: '20%', left: '63%', width: '13%', height: '25%' },
    provinces: [
      { id: 'bj', name: '北京' }, { id: 'tj', name: '天津' },
      { id: 'he', name: '河北' }, { id: 'sx', name: '山西' },
      { id: 'nm', name: '内蒙古' }, { id: 'ln', name: '辽宁' },
      { id: 'jl', name: '吉林' }, { id: 'hl', name: '黑龙江' },
      { id: 'sh', name: '上海' }, { id: 'js', name: '江苏' },
      { id: 'zj', name: '浙江' }, { id: 'ah', name: '安徽' },
      { id: 'fj', name: '福建' }, { id: 'jx', name: '江西' },
      { id: 'sd', name: '山东' }, { id: 'ha', name: '河南' },
      { id: 'hb', name: '湖北' }, { id: 'hn', name: '湖南' },
      { id: 'gd', name: '广东' }, { id: 'gx', name: '广西' },
      { id: 'hi', name: '海南' }, { id: 'cq', name: '重庆' },
      { id: 'sc', name: '四川' }, { id: 'gz', name: '贵州' },
      { id: 'yn', name: '云南' }, { id: 'xz', name: '西藏' },
      { id: 'sn', name: '陕西' }, { id: 'gs', name: '甘肃' },
      { id: 'qh', name: '青海' }, { id: 'nx', name: '宁夏' },
      { id: 'xj', name: '新疆' }, { id: 'hk', name: '香港' },
      { id: 'mo', name: '澳门' }, { id: 'tw', name: '台湾' },
    ],
  },
  {
    id: 'us',
    name: '美国',
    flag: '🇺🇸',
    mapPos: { top: '28%', left: '7%', width: '18%', height: '20%' },
    provinces: [
      { id: 'ca', name: '加利福尼亚' }, { id: 'tx', name: '德克萨斯' },
      { id: 'fl', name: '佛罗里达' }, { id: 'ny', name: '纽约' },
      { id: 'il', name: '伊利诺伊' }, { id: 'pa', name: '宾夕法尼亚' },
      { id: 'oh', name: '俄亥俄' }, { id: 'ga', name: '乔治亚' },
      { id: 'nc', name: '北卡罗来纳' }, { id: 'mi', name: '密歇根' },
    ],
  },
  {
    id: 'jp',
    name: '日本',
    flag: '🇯🇵',
    mapPos: { top: '26%', left: '77%', width: '3%', height: '22%' },
    provinces: [
      { id: 'tokyo', name: '东京都' }, { id: 'osaka', name: '大阪府' },
      { id: 'kyoto', name: '京都府' }, { id: 'hokkaido', name: '北海道' },
      { id: 'fukuoka', name: '福冈县' }, { id: 'aichi', name: '爱知县' },
    ],
  },
  {
    id: 'kr',
    name: '韩国',
    flag: '🇰🇷',
    mapPos: { top: '30%', left: '74%', width: '3%', height: '10%' },
    provinces: [
      { id: 'seoul', name: '首尔' }, { id: 'busan', name: '釜山' },
      { id: 'incheon', name: '仁川' }, { id: 'daegu', name: '大邱' },
    ],
  },
  {
    id: 'ru',
    name: '俄罗斯',
    flag: '🇷🇺',
    mapPos: { top: '8%', left: '42%', width: '26%', height: '18%' },
    provinces: [
      { id: 'moscow', name: '莫斯科' }, { id: 'spb', name: '圣彼得堡' },
      { id: 'novosibirsk', name: '新西伯利亚' }, { id: 'ekaterinburg', name: '叶卡捷琳堡' },
    ],
  },
  {
    id: 'ca',
    name: '加拿大',
    flag: '🇨🇦',
    mapPos: { top: '8%', left: '7%', width: '20%', height: '18%' },
    provinces: [
      { id: 'on', name: '安大略' }, { id: 'qc', name: '魁北克' },
      { id: 'bc', name: '不列颠哥伦比亚' }, { id: 'ab', name: '阿尔伯塔' },
    ],
  },
  {
    id: 'au',
    name: '澳大利亚',
    flag: '🇦🇺',
    mapPos: { top: '60%', left: '71%', width: '14%', height: '26%' },
    provinces: [
      { id: 'nsw', name: '新南威尔士' }, { id: 'vic', name: '维多利亚' },
      { id: 'qld', name: '昆士兰' }, { id: 'wa', name: '西澳大利亚' },
    ],
  },
  {
    id: 'de',
    name: '德国',
    flag: '🇩🇪',
    mapPos: { top: '28%', left: '36%', width: '4%', height: '12%' },
    provinces: [
      { id: 'bavaria', name: '巴伐利亚' }, { id: 'berlin', name: '柏林' },
      { id: 'hamburg', name: '汉堡' }, { id: 'nrw', name: '北莱茵-威斯特法伦' },
    ],
  },
  {
    id: 'fr',
    name: '法国',
    flag: '🇫🇷',
    mapPos: { top: '35%', left: '33%', width: '4%', height: '11%' },
    provinces: [
      { id: 'idf', name: '法兰西岛' }, { id: 'paca', name: '普罗旺斯' },
      { id: 'aura', name: '奥弗涅' }, { id: 'occ', name: '奥克西塔尼' },
    ],
  },
  {
    id: 'br',
    name: '巴西',
    flag: '🇧🇷',
    mapPos: { top: '52%', left: '13%', width: '13%', height: '28%' },
    provinces: [
      { id: 'sp', name: '圣保罗州' }, { id: 'rj', name: '里约热内卢' },
      { id: 'mg', name: '米纳斯吉拉斯' }, { id: 'ba', name: '巴伊亚' },
    ],
  },
];

export interface Question {
  id: string;
  type: string;
  text: string;
  options: string[];
  correct: number;
}

export const QUESTIONS_CN: Question[] = [
  { id: 'cn1', type: '城市猜省份', text: '杭州属于哪个省份？', options: ['浙江省', '江苏省', '安徽省', '福建省'], correct: 0 },
  { id: 'cn2', type: '古名猜城市', text: '古称"临安"的现代城市是？', options: ['南京', '杭州', '苏州', '无锡'], correct: 1 },
  { id: 'cn3', type: '特产猜城市', text: '西湖龙井茶产自哪个城市？', options: ['苏州', '南京', '杭州', '宁波'], correct: 2 },
  { id: 'cn4', type: '城市事件猜城市', text: '2008年夏季奥运会在哪个城市举办？', options: ['上海', '广州', '深圳', '北京'], correct: 3 },
  { id: 'cn5', type: '称号猜城市', text: '"天府之国"指的是哪个省份？', options: ['湖北省', '云南省', '四川省', '贵州省'], correct: 2 },
  { id: 'cn6', type: '城市猜省份', text: '成都属于哪个省份？', options: ['贵州省', '湖南省', '云南省', '四川省'], correct: 3 },
  { id: 'cn7', type: '城市猜省份', text: '哈尔滨属于哪个省份？', options: ['吉林省', '辽宁省', '内蒙古', '黑龙江省'], correct: 3 },
  { id: 'cn8', type: '城市事件猜城市', text: '2010年世界博览会在哪个城市举办？', options: ['北京', '深圳', '上海', '广州'], correct: 2 },
  { id: 'cn9', type: '城市猜省份', text: '乌鲁木齐是哪个自治区的首府？', options: ['西藏', '内蒙古', '宁夏', '新疆'], correct: 3 },
  { id: 'cn10', type: '特产猜城市', text: '阳澄湖大闸蟹的产地在哪个城市附近？', options: ['杭州', '南京', '苏州', '上海'], correct: 2 },
  { id: 'cn11', type: '古名猜城市', text: '古称"金陵"的现代城市是？', options: ['合肥', '苏州', '南京', '扬州'], correct: 2 },
  { id: 'cn12', type: '称号猜城市', text: '被称为"山城"的直辖市是？', options: ['昆明', '贵阳', '兰州', '重庆'], correct: 3 },
  { id: 'cn13', type: '城市猜省份', text: '拉萨是哪个地区的首府？', options: ['新疆', '甘肃', '西藏', '青海'], correct: 2 },
];

export const QUESTIONS_US: Question[] = [
  { id: 'us1', type: '城市猜州', text: '洛杉矶属于哪个州？', options: ['德克萨斯', '佛罗里达', '加利福尼亚', '纽约'], correct: 2 },
  { id: 'us2', type: '城市猜州', text: '休斯顿属于哪个州？', options: ['德克萨斯', '加利福尼亚', '佛罗里达', '俄亥俄'], correct: 0 },
  { id: 'us3', type: '城市猜州', text: '迈阿密属于哪个州？', options: ['佐治亚', '北卡罗来纳', '佛罗里达', '德克萨斯'], correct: 2 },
  { id: 'us4', type: '城市猜州', text: '芝加哥属于哪个州？', options: ['俄亥俄', '伊利诺伊', '密歇根', '印第安纳'], correct: 1 },
  { id: 'us5', type: '城市猜州', text: '拉斯维加斯属于哪个州？', options: ['加利福尼亚', '亚利桑那', '内华达', '科罗拉多'], correct: 2 },
  { id: 'us6', type: '称号猜城市', text: '"不夜城"指的是美国哪个城市？', options: ['洛杉矶', '纽约', '拉斯维加斯', '迈阿密'], correct: 2 },
  { id: 'us7', type: '城市猜州', text: '波士顿属于哪个州？', options: ['纽约', '马萨诸塞', '康涅狄格', '罗德岛'], correct: 1 },
  { id: 'us8', type: '城市猜州', text: '西雅图属于哪个州？', options: ['俄勒冈', '华盛顿', '加利福尼亚', '爱达荷'], correct: 1 },
  { id: 'us9', type: '城市猜州', text: '达拉斯属于哪个州？', options: ['俄克拉荷马', '路易斯安那', '德克萨斯', '新墨西哥'], correct: 2 },
  { id: 'us10', type: '城市猜州', text: '丹佛属于哪个州？', options: ['怀俄明', '犹他', '科罗拉多', '堪萨斯'], correct: 2 },
  { id: 'us11', type: '称号猜城市', text: '"风城"指的是美国哪个城市？', options: ['底特律', '芝加哥', '克利夫兰', '密尔沃基'], correct: 1 },
  { id: 'us12', type: '城市猜州', text: '菲尼克斯属于哪个州？', options: ['内华达', '新墨西哥', '亚利桑那', '科罗拉多'], correct: 2 },
  { id: 'us13', type: '城市猜州', text: '亚特兰大属于哪个州？', options: ['阿拉巴马', '南卡罗来纳', '北卡罗来纳', '佐治亚'], correct: 3 },
];

export const QUESTIONS_BY_COUNTRY: Record<string, Question[]> = {
  cn: QUESTIONS_CN,
  us: QUESTIONS_US,
};

export const AI_NAMES = [
  '旅行者小明', '地图探索者', '城市猎手', '知行合一', '漫游者',
  '寰宇达人', '地理通', '方舆学者', '行万里路', '博闻强记',
];

export function getQuestionsForCountry(countryId: string): Question[] {
  const pool = QUESTIONS_BY_COUNTRY[countryId] ?? QUESTIONS_CN;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  wins: number;
  total: number;
  avatar: string;
  province?: string;
  isCurrentUser?: boolean;
}

export const LEADERBOARD_GLOBAL: LeaderboardEntry[] = [
  { rank: 1, name: '地理王者', score: 3580, wins: 234, total: 289, avatar: '🏆', province: '北京' },
  { rank: 2, name: '城市漫游者', score: 3210, wins: 198, total: 245, avatar: '🌍', province: '上海' },
  { rank: 3, name: '山河无限', score: 2980, wins: 187, total: 241, avatar: '🗺️', province: '广东' },
  { rank: 4, name: '知行合一', score: 2756, wins: 165, total: 220, avatar: '🧭', province: '浙江' },
  { rank: 5, name: '寰宇达人', score: 2543, wins: 152, total: 210, avatar: '✈️', province: '四川' },
  { rank: 6, name: '方舆学者', score: 2389, wins: 143, total: 198, avatar: '📚', province: '江苏' },
  { rank: 7, name: '博闻强记', score: 2201, wins: 134, total: 189, avatar: '🎓', province: '湖北' },
  { rank: 8, name: '行万里路', score: 2089, wins: 128, total: 178, avatar: '🚀', province: '陕西' },
  { rank: 9, name: '地图探索者', score: 1987, wins: 119, total: 167, avatar: '🔭', province: '黑龙江' },
  { rank: 10, name: '城市猎手', score: 1876, wins: 113, total: 159, avatar: '🎯', province: '山东' },
  { rank: 11, name: '历史漫谈', score: 1754, wins: 105, total: 151, avatar: '📖', province: '河南' },
  { rank: 12, name: '地球故事', score: 1643, wins: 98, total: 143, avatar: '🌐', province: '湖南' },
  { rank: 13, name: '你的昵称', score: 1280, wins: 28, total: 45, avatar: '😊', province: '浙江', isCurrentUser: true },
  { rank: 14, name: '漫游天下', score: 1198, wins: 67, total: 102, avatar: '🌟', province: '福建' },
  { rank: 15, name: '地理小白', score: 1087, wins: 54, total: 89, avatar: '🌱', province: '安徽' },
];

export interface Message {
  id: string;
  type: 'official' | 'friend' | 'system';
  title: string;
  content: string;
  sender: string;
  time: string;
  read: boolean;
  avatar: string;
}

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    type: 'official',
    title: '🎉 新版本上线通知',
    content: '城市猜猜猜 v1.2.0 已上线！新增日本、韩国题库，修复若干已知问题。',
    sender: '官方团队',
    time: '10分钟前',
    read: false,
    avatar: '📢',
  },
  {
    id: 'm2',
    type: 'system',
    title: '对战结果通知',
    content: '你赢得了与"地图探索者"的对战，积分 +12。继续加油！',
    sender: '系统',
    time: '2小时前',
    read: false,
    avatar: '⚔️',
  },
  {
    id: 'm3',
    type: 'friend',
    title: '好友邀请对战',
    content: '知行合一 邀请你进行1v1对战，点击接受挑战！',
    sender: '知行合一',
    time: '3小时前',
    read: false,
    avatar: '🤝',
  },
  {
    id: 'm4',
    type: 'system',
    title: '成就解锁通知',
    content: '恭喜！你解锁了成就「初出茅庐」，完成了首场对战。',
    sender: '系统',
    time: '昨天',
    read: true,
    avatar: '🏅',
  },
  {
    id: 'm5',
    type: 'official',
    title: '每周精选题目上新',
    content: '本周新增50道四川特色题目，快来挑战吧！涵盖成都、乐山、九寨沟等热门城市。',
    sender: '官方团队',
    time: '2天前',
    read: true,
    avatar: '📢',
  },
  {
    id: 'm6',
    type: 'system',
    title: '好友申请',
    content: '城市漫游者 请求添加你为好友。',
    sender: '系统',
    time: '3天前',
    read: true,
    avatar: '👥',
  },
];

export interface Achievement {
  id: string;
  category: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', category: '对战次数', name: '初出茅庐', description: '完成第一场对战', icon: '⚔️', tier: 'bronze', unlocked: true },
  { id: 'a2', category: '对战次数', name: '百战老兵', description: '完成100场对战', icon: '🎖️', tier: 'silver', unlocked: false, progress: 45, target: 100 },
  { id: 'a3', category: '对战次数', name: '千战王者', description: '完成1000场对战', icon: '👑', tier: 'gold', unlocked: false, progress: 45, target: 1000 },
  { id: 'a4', category: '积分数', name: '积分破千', description: '积分达到1000', icon: '🏆', tier: 'bronze', unlocked: true },
  { id: 'a5', category: '积分数', name: '积分破万', description: '积分达到10000', icon: '💎', tier: 'silver', unlocked: false, progress: 1280, target: 10000 },
  { id: 'a6', category: '打卡次数', name: '初次打卡', description: '完成首次打卡', icon: '✅', tier: 'bronze', unlocked: true },
  { id: 'a7', category: '打卡次数', name: '打卡达人', description: '累计打卡30天', icon: '📅', tier: 'silver', unlocked: true },
  { id: 'a8', category: '打卡次数', name: '打卡专家', description: '累计打卡100天', icon: '🌟', tier: 'gold', unlocked: false, progress: 45, target: 100 },
  { id: 'a9', category: '连续打卡', name: '坚持一周', description: '连续打卡7天', icon: '🔥', tier: 'bronze', unlocked: true },
  { id: 'a10', category: '连续打卡', name: '坚持一月', description: '连续打卡30天', icon: '⭐', tier: 'silver', unlocked: false, progress: 12, target: 30 },
  { id: 'a11', category: '国家探索', name: '中国探索者', description: '中国对战积累1000积分', icon: '🇨🇳', tier: 'bronze', unlocked: true },
  { id: 'a12', category: '国家探索', name: '中国精通者', description: '中国对战积累10000积分', icon: '🏯', tier: 'silver', unlocked: false, progress: 1280, target: 10000 },
];

export interface BattleRecord {
  id: string;
  opponent: string;
  opponentAvatar: string;
  country: string;
  result: 'win' | 'lose' | 'draw';
  myScore: number;
  oppScore: number;
  scoreChange: number;
  date: string;
}

export const BATTLE_HISTORY: BattleRecord[] = [
  { id: 'b1', opponent: '地图探索者', opponentAvatar: '🔭', country: '中国', result: 'win', myScore: 16, oppScore: 4, scoreChange: 12, date: '今天 14:23' },
  { id: 'b2', opponent: '旅行者小明', opponentAvatar: '✈️', country: '中国', result: 'lose', myScore: 6, oppScore: 14, scoreChange: -8, date: '今天 11:05' },
  { id: 'b3', opponent: '城市漫游者', opponentAvatar: '🌍', country: '中国', result: 'win', myScore: 14, oppScore: 8, scoreChange: 6, date: '昨天 20:41' },
  { id: 'b4', opponent: '知行合一', opponentAvatar: '🧭', country: '中国', result: 'win', myScore: 18, oppScore: 2, scoreChange: 16, date: '昨天 18:30' },
  { id: 'b5', opponent: '博闻强记', opponentAvatar: '🎓', country: '中国', result: 'lose', myScore: 4, oppScore: 16, scoreChange: -12, date: '2天前' },
];
