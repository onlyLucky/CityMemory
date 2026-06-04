import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

const SECTIONS = [
  {
    title: '一、信息收集',
    body: '我们收集以下信息以提供服务：\n\n• 账号信息：注册时填写的昵称、头像等资料。\n• 对战记录：答题结果、积分变化、胜负情况及对战时长。\n• 设备信息：设备型号、操作系统版本及网络连接状态。\n• 日志信息：访问时间、IP地址及崩溃报告，用于故障排查。',
  },
  {
    title: '二、信息使用',
    body: '我们将收集的信息用于：\n\n• 提供、维护和改进各项功能，包括匹配对战、排行榜和成就系统。\n• 向您发送服务通知，如对战邀请、系统公告及每日提醒。\n• 进行反作弊检测，维护公平竞技环境。\n• 分析使用数据，优化题库内容和用户体验。',
  },
  {
    title: '三、信息存储与安全',
    body: '您的个人信息存储于经过加密保护的服务器中。我们采用 SSL/TLS 加密传输保护数据，防止未经授权的访问或篡改。账号数据保留至您注销账号后 30 天，之后将被永久删除。',
  },
  {
    title: '四、信息共享',
    body: '我们不会向任何第三方出售您的个人信息。以下情形除外：\n\n• 经您明确同意后，与合作伙伴共享必要信息。\n• 法律法规要求或政府机关依法要求提供。\n• 保护用户、公众或平台的合法权益。',
  },
  {
    title: '五、用户权利',
    body: '您对自己的个人信息享有以下权利：\n\n• 访问权：随时查看账号信息和对战记录。\n• 更正权：通过"编辑资料"功能修改错误信息。\n• 删除权：注销账号后，我们将在 30 天内删除全部数据。\n• 撤回同意：可在设置中关闭非必要数据收集选项。',
  },
  {
    title: '六、Cookie 政策',
    body: '我们使用 Cookie 保持登录状态、记忆偏好设置，并统计访问数据以改善服务。您可以通过浏览器设置拒绝 Cookie，但这可能影响部分功能的正常使用。',
  },
  {
    title: '七、未成年人保护',
    body: '城市猜猜猜面向 13 周岁及以上用户。若我们发现收集了 13 周岁以下未成年人的信息，将立即删除相关数据并限制账号使用。',
  },
  {
    title: '八、联系我们',
    body: '如您对本隐私政策有任何疑问，请通过以下方式联系我们：\n\n邮箱：privacy@cityguessgame.com\n工作时间：周一至周五 10:00–18:00（北京时间）\n\n我们将在 15 个工作日内回复您的请求。',
  },
];

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
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
          <p className="text-foreground" style={{ fontSize: '1.125rem', fontWeight: 600 }}>隐私政策</p>
          <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>请仔细阅读以下条款</p>
        </div>
      </div>

      <div className="mx-4 mb-4 bg-primary/8 border border-primary/20 rounded-2xl px-4 py-3 flex-shrink-0">
        <p className="text-foreground" style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
          城市猜猜猜工作室非常重视您的隐私。本政策说明我们如何收集、使用和保护您的个人信息。
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
