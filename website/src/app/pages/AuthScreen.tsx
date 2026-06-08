import React, { useState } from 'react';
import { Map, User, Lock } from 'lucide-react';

interface AuthScreenProps {
  onAuth: (userName: string) => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!name.trim()) {
      setError('请输入昵称');
      return;
    }
    if (!password) {
      setError('请输入密码');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }
    onAuth(name.trim());
  };

  return (
    <div className="w-full h-full bg-background flex flex-col items-center justify-center overflow-auto px-4 py-8">
      {/* Tab pills */}
      <div className="flex gap-1 bg-muted rounded-2xl p-1 mb-8 w-56">
        {(['login', 'register'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); }}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              mode === m
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            }`}
            style={{ fontSize: '0.875rem' }}
          >
            {m === 'login' ? '登录' : '注册'}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="bg-card rounded-3xl w-full max-w-sm px-6 py-8 border border-border">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Map style={{ width: 30, height: 30 }} className="text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <p
          className="text-foreground font-semibold text-center mb-6"
          style={{ fontSize: '1.5rem', letterSpacing: '0.04em' }}
        >
          城市猜猜猜
        </p>

        {/* Name input */}
        <div className="mb-3">
          <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border focus-within:border-primary transition-colors">
            <User size={16} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="昵称"
              className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              style={{ fontSize: '0.9375rem' }}
            />
          </div>
        </div>

        {/* Password input */}
        <div className="mb-3">
          <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border focus-within:border-primary transition-colors">
            <Lock size={16} className="text-muted-foreground flex-shrink-0" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="密码"
              className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              style={{ fontSize: '0.9375rem' }}
            />
          </div>
        </div>

        {/* Confirm password (register only) */}
        {mode === 'register' && (
          <div className="mb-3">
            <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border focus-within:border-primary transition-colors">
              <Lock size={16} className="text-muted-foreground flex-shrink-0" />
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="确认密码"
                className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                style={{ fontSize: '0.9375rem' }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-destructive mb-3" style={{ fontSize: '0.8125rem' }}>
            {error}
          </p>
        )}

        {/* CTA button */}
        <button
          onClick={handleSubmit}
          className="bg-primary text-primary-foreground rounded-2xl w-full py-3.5 font-semibold mt-2 transition-opacity active:opacity-80"
          style={{ fontSize: '1rem' }}
        >
          {mode === 'login' ? '登录' : '注册'}
        </button>

        {/* Toggle link */}
        <p className="text-center mt-4 text-muted-foreground" style={{ fontSize: '0.875rem' }}>
          {mode === 'login' ? '还没有账号？' : '已有账号？'}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-primary font-semibold ml-1 underline-offset-2 hover:underline"
          >
            {mode === 'login' ? '立即注册' : '去登录'}
          </button>
        </p>
      </div>
    </div>
  );
}
