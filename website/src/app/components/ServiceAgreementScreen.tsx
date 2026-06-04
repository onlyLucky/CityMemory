import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface ServiceAgreementScreenProps {
  onBack: () => void;
}

const SECTIONS = [
  {
    title: '一、服务说明',
    body: '城市猜猜猜（以下简称"本应用"）是一款基于地理知识的实时对战应用。用户通过答题与全国玩家竞技，积累积分并解锁地图成就。\n\n本协议适用于所有注册及使用本应用服务的用户。使用本服务即视为您已阅读并同意本协议全部条款。',
  },
  {
    title: '二、用户注册',
    body: '注册账号须满足以下条件：\n\n• 年满 13 周岁，未成年人须在监护人同意下注册。\n• 提供真实有效的注册信息，昵称不得含有违法或侵权内容。\n• 每人仅限注册一个账号，不得出租、转让或借用账号。',
  },
  {
    title: '三、用户行为规范',
    body: '使用本应用时，您不得：\n\n• 使用外挂、脚本或其他作弊手段干扰游戏公平性。\n• 传播违法、色情、暴力或侵权内容。\n• 恶意刷分、对战放水或组织刷榜行为。\n• 骚扰、攻击或侮辱其他玩家。\n\n违反上述规范将导致账号封禁或永久注销。',
  },
  {
    title: '四、知识产权',
    body: '本应用所有内容（含题库、图标、UI设计、代码）均为城市猜猜猜工作室所有，受著作权法保护。未经授权，不得复制、传播或用于商业用途。',
  },
  {
    title: '五、隐私保护',
    body: '我们重视您的隐私，收集和使用个人信息的详细说明请参阅《隐私政策》。我们承诺不向第三方出售您的个人数据。',
  },
  {
    title: '六、免责声明',
    body: '因以下情形导致的服务中断或数据丢失，本应用不承担责任：\n\n• 不可抗力（自然灾害、战争、政策变动等）。\n• 用户设备故障或网络问题。\n• 第三方服务异常导致的影响。',
  },
  {
    title: '七、协议修改',
    body: '我们保留随时修改本协议的权利。重大变更将通过应用内通知提前告知。继续使用本服务视为您接受修改后的协议。',
  },
];

export function ServiceAgreementScreen({ onBack }: ServiceAgreementScreenProps) {
  return (
    <div className="flex flex-col h-full bg-background overflow-auto">
      <div className="px-4 pt-5 pb-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0"
        >
          <ChevronLeft size={18} className="text-primary-foreground" />
        </button>
        <div>
          <p className="text-foreground" style={{ fontSize: '1.125rem', fontWeight: 600 }}>用户服务协议</p>
          <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>请仔细阅读以下条款</p>
        </div>
      </div>

      <div className="mx-4 mb-4 bg-primary/8 border border-primary/20 rounded-2xl px-4 py-3 flex-shrink-0">
        <p className="text-foreground" style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
          本协议由您与城市猜猜猜工作室共同缔结，请在使用服务前仔细阅读。
        </p>
      </div>

      <div className="px-4 pb-28 space-y-5">
        {SECTIONS.map(s => (
          <div key={s.title}>
            <p className="text-foreground mb-2" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{s.title}</p>
            <p className="text-muted-foreground" style={{ fontSize: '0.8125rem', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{s.body}</p>
          </div>
        ))}
        <p className="text-center text-muted-foreground pt-2" style={{ fontSize: '0.6875rem' }}>
          版本 1.0.0 · 生效日期 2026年01月01日
        </p>
      </div>
    </div>
  );
}
