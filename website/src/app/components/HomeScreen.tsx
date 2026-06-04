import React, { useState } from 'react';
import { Map, Zap, Shuffle, Globe, Trophy, ChevronLeft, MapPin } from 'lucide-react';
import { COUNTRIES, type CountryInfo } from './game-data';

import chinaMapImg from '../../imports/首页/9a39d2dacc22188ce1be74c233caeef1f9aead2d.png';

interface HomeScreenProps {
  selectedCountry: string;
  onSelectCountry: (id: string) => void;
  litProvinces: Record<string, string[]>;
  onStartBattle: () => void;
  userScore: number;
}

const COUNTRY_REGIONS: Record<string, { cn: string; en: string }> = {
  cn: { cn: '亚洲 · 中国', en: 'Asia · China' },
  us: { cn: '北美洲 · 美国', en: 'North America · USA' },
  jp: { cn: '亚洲 · 日本', en: 'Asia · Japan' },
  kr: { cn: '亚洲 · 韩国', en: 'Asia · South Korea' },
  ru: { cn: '欧亚 · 俄罗斯', en: 'Eurasia · Russia' },
  ca: { cn: '北美洲 · 加拿大', en: 'North America · Canada' },
  au: { cn: '大洋洲 · 澳大利亚', en: 'Oceania · Australia' },
  de: { cn: '欧洲 · 德国', en: 'Europe · Germany' },
  fr: { cn: '欧洲 · 法国', en: 'Europe · France' },
  br: { cn: '南美洲 · 巴西', en: 'South America · Brazil' },
};

const COUNTRY_MAP_IMAGES: Record<string, string> = {
  cn: chinaMapImg,
};

export function HomeScreen({ selectedCountry, onSelectCountry, litProvinces, onStartBattle, userScore }: HomeScreenProps) {
  const [view, setView] = useState<'country' | 'world' | 'provinces'>('country');
  const country = COUNTRIES.find(c => c.id === selectedCountry)!;
  const lit = litProvinces[selectedCountry] ?? [];
  const region = COUNTRY_REGIONS[selectedCountry] ?? { cn: country.name, en: '' };
  const mapImage = COUNTRY_MAP_IMAGES[selectedCountry];

  const handleSelectCountry = (id: string) => {
    onSelectCountry(id);
    setView('country');
  };

  const SubHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-border bg-card flex-shrink-0">
      <button
        onClick={() => setView('country')}
        className="p-1.5 bg-muted rounded-lg border border-border"
      >
        <ChevronLeft size={16} className="text-foreground" />
      </button>
      <div>
        <p className="text-foreground font-semibold" style={{ fontSize: '0.875rem' }}>{title}</p>
        <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{subtitle}</p>
      </div>
      <div className="ml-auto bg-muted rounded-lg px-2.5 py-1 flex items-center gap-1.5 border border-border">
        <Trophy size={12} className="text-foreground" />
        <span className="text-foreground font-semibold" style={{ fontSize: '0.75rem' }}>{userScore}</span>
      </div>
    </div>
  );

  if (view === 'world') {
    return (
      <div className="flex flex-col h-full bg-background">
        <SubHeader title="选择国家" subtitle="点击国家切换对战地图" />
        <div className="flex-1 p-4 overflow-auto">
          <WorldMapView
            countries={COUNTRIES}
            selectedId={selectedCountry}
            litProvinces={litProvinces}
            onSelect={handleSelectCountry}
          />
        </div>
      </div>
    );
  }

  if (view === 'provinces') {
    return (
      <div className="flex flex-col h-full bg-background">
        <SubHeader title={region.cn} subtitle={`已点亮 ${lit.length}/${country.provinces.length} 个省份`} />
        <div className="flex-1 p-4 overflow-auto">
          <ProvinceMapView country={country} litProvinces={lit} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <p className="text-foreground font-semibold" style={{ fontSize: '0.875rem' }}>首页</p>
        <div className="bg-card rounded-lg px-2.5 py-1 flex items-center gap-1.5 border border-border">
          <Trophy size={12} className="text-foreground" />
          <span className="text-foreground font-semibold" style={{ fontSize: '0.75rem' }}>{userScore}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto">
        {/* Country title */}
        <div className="px-4 pt-3 pb-1 text-center">
          <p className="text-foreground font-semibold" style={{ fontSize: '1.25rem', lineHeight: 1.3 }}>{region.cn}</p>
          {region.en && (
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.875rem' }}>{region.en}</p>
          )}
        </div>

        {/* Map image */}
        <div className="px-4 py-2 flex justify-center">
          <div className="w-full max-w-sm" style={{ height: 280 }}>
            {mapImage ? (
              <img
                src={mapImage}
                alt={country.name}
                className="w-full h-full object-contain"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-card rounded-xl border border-border flex flex-col items-center justify-center gap-3">
                <Globe size={48} className="text-border" />
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>{country.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress badge + tagline */}
        <div className="px-4 pb-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-muted border border-border mb-2">
            <MapPin size={12} className="text-foreground" />
            <span className="text-foreground font-medium" style={{ fontSize: '0.8125rem' }}>
              探索 {lit.length}/{country.provinces.length} 地区
            </span>
          </div>
          <p className="text-muted-foreground px-4" style={{ fontSize: '0.75rem' }}>
            每一个节点，都是一段尘封的历史与新发现。
          </p>
        </div>
      </div>

      {/* 3-action pill bar */}
      <div className="px-4 pb-5 pt-2 flex-shrink-0">
        <div className="bg-card rounded-full border border-border shadow-sm flex items-center">
          <button
            onClick={() => setView('world')}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-foreground rounded-full hover:bg-muted transition-colors"
          >
            <Map size={14} />
            <span style={{ fontSize: '0.8125rem' }}>城市地图</span>
          </button>
          <div className="w-px h-5 bg-border" />
          <button
            onClick={onStartBattle}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-foreground rounded-full hover:bg-muted transition-colors"
          >
            <Zap size={14} />
            <span style={{ fontSize: '0.8125rem' }}>开始探索</span>
          </button>
          <div className="w-px h-5 bg-border" />
          <button
            onClick={() => setView('provinces')}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-foreground rounded-full hover:bg-muted transition-colors"
          >
            <Shuffle size={14} />
            <span style={{ fontSize: '0.8125rem' }}>省份地图</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function WorldMapView({
  countries,
  selectedId,
  litProvinces,
  onSelect,
}: {
  countries: CountryInfo[];
  selectedId: string;
  litProvinces: Record<string, string[]>;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="bg-muted rounded-2xl overflow-hidden relative border border-border" style={{ height: 340, minHeight: 280 }}>
      {/* Grid bg */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 10} x2={400} y2={i * 10} stroke="currentColor" strokeWidth={0.5} />
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 10} y1={0} x2={i * 10} y2={200} stroke="currentColor" strokeWidth={0.5} />
        ))}
      </svg>

      {countries.map(c => {
        const lit = litProvinces[c.id] ?? [];
        const pct = lit.length > 0 ? Math.round((lit.length / c.provinces.length) * 100) : 0;
        const isSelected = c.id === selectedId;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`absolute transition-all duration-200 rounded-lg ${
              isSelected
                ? 'bg-primary shadow-lg scale-105 z-10'
                : 'bg-card hover:bg-accent hover:scale-105 z-0'
            } border ${isSelected ? 'border-primary' : 'border-border'}`}
            style={{
              top: c.mapPos.top, left: c.mapPos.left,
              width: c.mapPos.width, height: c.mapPos.height,
              minWidth: 44, minHeight: 34,
            }}
          >
            <div className="flex flex-col items-center justify-center h-full px-1 py-1">
              <Globe size={10} className={isSelected ? 'text-primary-foreground' : 'text-muted-foreground'} />
              <span className={`truncate w-full text-center font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`} style={{ fontSize: '0.5625rem', lineHeight: 1.2, marginTop: 2 }}>
                {c.name}
              </span>
              {pct > 0 && (
                <div className="w-full mt-0.5 px-0.5">
                  <div className="h-0.5 bg-border rounded-full">
                    <div className={`h-full rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
            </div>
          </button>
        );
      })}

      <div className="absolute bottom-3 right-3 bg-card/80 backdrop-blur rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 border border-border">
        <Globe size={11} className="text-muted-foreground" />
        <span className="text-muted-foreground" style={{ fontSize: '0.625rem' }}>点击国家选择</span>
      </div>
    </div>
  );
}

function ProvinceMapView({ country, litProvinces }: { country: CountryInfo; litProvinces: string[] }) {
  const litSet = new Set(litProvinces);
  return (
    <div className="bg-card rounded-2xl p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe size={15} className="text-foreground" />
          <span className="text-foreground font-semibold" style={{ fontSize: '0.875rem' }}>{country.name}省份地图</span>
        </div>
        <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
          {litProvinces.length}/{country.provinces.length}
        </span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {country.provinces.map(p => {
          const isLit = litSet.has(p.id);
          return (
            <div
              key={p.id}
              className={`rounded-lg py-2 px-1 text-center transition-all ${isLit ? 'bg-primary' : 'bg-muted'}`}
            >
              <p className={`font-medium leading-tight ${isLit ? 'text-primary-foreground' : 'text-muted-foreground'}`} style={{ fontSize: '0.6875rem' }}>
                {p.name}
              </p>
              {isLit && <div className="w-1 h-1 rounded-full bg-primary-foreground mx-auto mt-1 opacity-60" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
