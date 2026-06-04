import React, { useState } from 'react';
import { Bell, Users, Megaphone, MailOpen, ChevronLeft } from 'lucide-react';
import { MOCK_MESSAGES, type Message } from './game-data';

type FilterType = 'all' | 'official' | 'friend' | 'system';

function MessageTypeIcon({ type }: { type: Message['type'] }) {
  const icons: Record<Message['type'], React.ReactNode> = {
    official: <Megaphone size={15} className="text-foreground" />,
    system: <Bell size={15} className="text-muted-foreground" />,
    friend: <Users size={15} className="text-foreground" />,
  };
  return icons[type] ?? <Bell size={15} className="text-muted-foreground" />;
}

export function MessagesScreen() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selected, setSelected] = useState<Message | null>(null);

  const unreadCount = messages.filter(m => !m.read).length;
  const filtered = filter === 'all' ? messages : messages.filter(m => m.type === filter);

  const markRead = (id: string) => setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  const markAllRead = () => setMessages(prev => prev.map(m => ({ ...m, read: true })));
  const handleOpen = (msg: Message) => { setSelected(msg); markRead(msg.id); };

  if (selected) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-border bg-card flex-shrink-0">
          <button
            onClick={() => setSelected(null)}
            className="p-1.5 bg-muted rounded-lg border border-border"
          >
            <ChevronLeft size={16} className="text-foreground" />
          </button>
          <h2 className="text-foreground font-semibold flex-1 truncate" style={{ fontSize: '0.9375rem' }}>{selected.title}</h2>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <MessageTypeIcon type={selected.type} />
              </div>
              <div>
                <p className="text-foreground font-semibold" style={{ fontSize: '0.875rem' }}>{selected.sender}</p>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{selected.time}</p>
              </div>
              <TypeBadge type={selected.type} />
            </div>
            <p className="text-foreground leading-relaxed" style={{ fontSize: '0.875rem' }}>{selected.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground flex items-center gap-2">
              消息邮箱
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-semibold" style={{ fontSize: '0.75rem' }}>
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>收件箱</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-muted-foreground px-3 py-1.5 bg-card rounded-full border border-border hover:bg-accent transition-colors"
              style={{ fontSize: '0.75rem' }}
            >
              全部已读
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          {(['all', 'official', 'system', 'friend'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full transition-all ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground border border-border hover:bg-accent'
              }`}
              style={{ fontSize: '0.75rem' }}
            >
              {f === 'all' ? '全部' : f === 'official' ? '官方' : f === 'system' ? '系统' : '好友'}
            </button>
          ))}
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-auto px-4 pb-24 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-3">
              <MailOpen size={26} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>暂无消息</p>
          </div>
        ) : (
          filtered.map(msg => (
            <button
              key={msg.id}
              onClick={() => handleOpen(msg)}
              className={`w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all ${
                !msg.read
                  ? 'bg-card border-primary/30 hover:bg-accent'
                  : 'bg-card border-border opacity-70 hover:opacity-100 hover:bg-accent'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0 relative">
                <MessageTypeIcon type={msg.type} />
                {!msg.read && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <TypeBadge type={msg.type} />
                  <p className={`font-semibold truncate flex-1 ${!msg.read ? 'text-foreground' : 'text-muted-foreground'}`} style={{ fontSize: '0.875rem' }}>
                    {msg.title}
                  </p>
                </div>
                <p className="text-muted-foreground truncate" style={{ fontSize: '0.75rem' }}>{msg.content}</p>
                <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.625rem' }}>{msg.time}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: Message['type'] }) {
  const config: Record<string, { label: string; cls: string }> = {
    official: { label: '官方', cls: 'bg-primary text-primary-foreground' },
    system: { label: '系统', cls: 'bg-muted text-muted-foreground' },
    friend: { label: '好友', cls: 'bg-muted text-foreground' },
  };
  const c = config[type];
  return (
    <span className={`px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${c.cls}`} style={{ fontSize: '0.625rem' }}>
      {c.label}
    </span>
  );
}
