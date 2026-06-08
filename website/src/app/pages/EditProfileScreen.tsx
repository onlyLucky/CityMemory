import React, { useState } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';

interface EditProfileScreenProps {
  userName: string;
  onBack: () => void;
  onSave: (name: string) => void;
}

const AVATAR_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function EditProfileScreen({ userName, onBack, onSave }: EditProfileScreenProps) {
  const [selectedAvatar, setSelectedAvatar] = useState('A');
  const [nickname, setNickname] = useState(userName);
  const [bio, setBio] = useState('');
  const [province] = useState('浙江省');

  const handleSave = () => {
    if (nickname.trim()) {
      onSave(nickname.trim());
    }
  };

  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0"
        >
          <ChevronLeft size={18} className="text-primary-foreground" />
        </button>
        <p className="text-foreground font-semibold" style={{ fontSize: '1.125rem' }}>
          编辑资料
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 pb-6">
        {/* Current avatar preview */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="bg-primary rounded-full flex items-center justify-center font-bold text-primary-foreground mb-3"
            style={{ width: 64, height: 64, fontSize: '1.75rem' }}
          >
            {selectedAvatar}
          </div>
          <p className="text-muted-foreground" style={{ fontSize: '0.8125rem' }}>
            选择头像字母
          </p>
        </div>

        {/* Avatar options */}
        <div className="flex justify-center gap-3 mb-8">
          {AVATAR_LETTERS.map(letter => (
            <button
              key={letter}
              onClick={() => setSelectedAvatar(letter)}
              className={`rounded-full flex items-center justify-center font-semibold transition-all ${
                selectedAvatar === letter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
              style={{ width: 40, height: 40, fontSize: '1rem' }}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          {/* Nickname */}
          <div>
            <p className="text-muted-foreground mb-1.5" style={{ fontSize: '0.8125rem' }}>
              昵称
            </p>
            <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border focus-within:border-primary transition-colors">
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="请输入昵称"
                className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                style={{ fontSize: '0.9375rem' }}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-muted-foreground mb-1.5" style={{ fontSize: '0.8125rem' }}>
              个性签名
            </p>
            <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border focus-within:border-primary transition-colors">
              <input
                type="text"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="每天学一点，世界大一点"
                className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                style={{ fontSize: '0.9375rem' }}
              />
            </div>
          </div>

          {/* Province */}
          <div>
            <p className="text-muted-foreground mb-1.5" style={{ fontSize: '0.8125rem' }}>
              所在省份
            </p>
            <button className="w-full flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border text-left">
              <span className="flex-1 text-foreground" style={{ fontSize: '0.9375rem' }}>
                {province}
              </span>
              <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="bg-primary text-primary-foreground rounded-2xl w-full py-3.5 font-semibold mt-8"
          style={{ fontSize: '1rem' }}
        >
          保存
        </button>
      </div>
    </div>
  );
}
