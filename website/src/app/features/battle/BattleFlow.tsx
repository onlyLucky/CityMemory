import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Trophy, RotateCcw, Home, CheckCircle, XCircle, Clock, User, Globe, Flame, Zap } from 'lucide-react';
import { COUNTRIES, AI_NAMES, getQuestionsForCountry, type Question } from '../../data/game-data';
import confetti from 'canvas-confetti';

interface BattleFlowProps {
  selectedCountry: string;
  onFinish: (won: boolean, litProvince: string | null) => void;
  onCancel: () => void;
}

type Phase = 'matching' | 'ready' | 'playing' | 'finished';

interface PlayerState {
  name: string;
  avatar: string;
  score: number;
  currentAnswer: number | null;
  answeredAt: number | null;
}

export function BattleFlow({ selectedCountry, onFinish, onCancel }: BattleFlowProps) {
  const [phase, setPhase] = useState<Phase>('matching');
  const [matchTimer, setMatchTimer] = useState(3);
  const [readyCount, setReadyCount] = useState(3);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timer, setTimer] = useState(10);
  const [questionPhase, setQuestionPhase] = useState<'active' | 'revealing'>('active');
  const [user, setUser] = useState<PlayerState>({ name: '你', avatar: 'user', score: 0, currentAnswer: null, answeredAt: null });
  const [opponent, setOpponent] = useState<PlayerState>({
    name: AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)],
    avatar: 'ai',
    score: 0,
    currentAnswer: null,
    answeredAt: null,
  });
  const [streakUser, setStreakUser] = useState(0);
  const [streakOpponent, setStreakOpponent] = useState(0);
  const [scoreChanges, setScoreChanges] = useState<Array<{ user: number; opp: number }>>([]);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userRef = useRef(user);
  userRef.current = user;
  const opponentRef = useRef(opponent);
  opponentRef.current = opponent;

  const country = COUNTRIES.find(c => c.id === selectedCountry);

  // Phase: matching
  useEffect(() => {
    if (phase !== 'matching') return;
    const interval = setInterval(() => {
      setMatchTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          setPhase('ready');
          setQuestions(getQuestionsForCountry(selectedCountry));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, selectedCountry]);

  // Phase: ready countdown
  useEffect(() => {
    if (phase !== 'ready') return;
    const interval = setInterval(() => {
      setReadyCount(t => {
        if (t <= 1) {
          clearInterval(interval);
          setPhase('playing');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const handleReveal = useCallback((userAns: number | null, oppAns: number | null, uTime: number, oTime: number) => {
    setQuestionPhase('revealing');
    const q = questions[currentQ];
    let userDelta = 0;
    let oppDelta = 0;
    let newStreakUser = streakUser;
    let newStreakOpp = streakOpponent;

    const userCorrect = userAns !== null && userAns === q.correct;
    const oppCorrect = oppAns !== null && oppAns === q.correct;

    if (userAns !== null && oppAns !== null) {
      const userFirst = uTime <= oTime;
      if (userFirst) {
        if (userCorrect) {
          userDelta = 2 + streakUser;
          newStreakUser = streakUser + 1;
          newStreakOpp = 0;
        } else {
          userDelta = -2;
          newStreakUser = 0;
          if (oppCorrect) {
            oppDelta = 2 + streakOpponent;
            newStreakOpp = streakOpponent + 1;
          } else if (oppAns !== null) {
            oppDelta = -2;
            newStreakOpp = 0;
          }
        }
      } else {
        if (oppCorrect) {
          oppDelta = 2 + streakOpponent;
          newStreakOpp = streakOpponent + 1;
          newStreakUser = 0;
        } else {
          oppDelta = -2;
          newStreakOpp = 0;
          if (userCorrect) {
            userDelta = 2 + streakUser;
            newStreakUser = streakUser + 1;
          } else if (userAns !== null) {
            userDelta = -2;
            newStreakUser = 0;
          }
        }
      }
    } else if (userAns !== null) {
      if (userCorrect) {
        userDelta = 2 + streakUser;
        newStreakUser = streakUser + 1;
      } else {
        userDelta = -2;
        newStreakUser = 0;
      }
    } else if (oppAns !== null) {
      if (oppCorrect) {
        oppDelta = 2 + streakOpponent;
        newStreakOpp = streakOpponent + 1;
      } else {
        oppDelta = -2;
        newStreakOpp = 0;
      }
    }

    setStreakUser(newStreakUser);
    setStreakOpponent(newStreakOpp);
    setScoreChanges(prev => [...prev, { user: userDelta, opp: oppDelta }]);
    setUser(u => ({ ...u, score: Math.max(0, u.score + userDelta) }));
    setOpponent(o => ({ ...o, score: Math.max(0, o.score + oppDelta) }));

    setTimeout(() => {
      if (currentQ >= questions.length - 1) {
        setPhase('finished');
      } else {
        setCurrentQ(q => q + 1);
        setUser(u => ({ ...u, currentAnswer: null, answeredAt: null }));
        setOpponent(o => ({ ...o, currentAnswer: null, answeredAt: null }));
        setTimer(10);
        setQuestionPhase('active');
      }
    }, 2200);
  }, [questions, currentQ, streakUser, streakOpponent]);

  // Phase: playing — question timer
  useEffect(() => {
    if (phase !== 'playing' || questionPhase !== 'active') return;
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
          handleReveal(userRef.current.currentAnswer, opponentRef.current.currentAnswer, userRef.current.answeredAt ?? Infinity, opponentRef.current.answeredAt ?? Infinity);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, questionPhase, currentQ, handleReveal]);

  // Phase: playing — AI answer
  useEffect(() => {
    if (phase !== 'playing' || questionPhase !== 'active' || questions.length === 0) return;
    const delay = 2000 + Math.random() * 6000;
    aiTimerRef.current = setTimeout(() => {
      const q = questions[currentQ];
      const correct = Math.random() < 0.65;
      let aiAnswer: number;
      if (correct) {
        aiAnswer = q.correct;
      } else {
        const wrong = [0, 1, 2, 3].filter(i => i !== q.correct);
        aiAnswer = wrong[Math.floor(Math.random() * wrong.length)];
      }
      const now = Date.now();
      setOpponent(o => {
        if (o.currentAnswer !== null) return o;
        return { ...o, currentAnswer: aiAnswer, answeredAt: now };
      });
    }, delay);
    return () => { if (aiTimerRef.current) clearTimeout(aiTimerRef.current); };
  }, [phase, questionPhase, currentQ, questions]);

  // Check if both answered → reveal
  useEffect(() => {
    if (phase !== 'playing' || questionPhase !== 'active') return;
    if (user.currentAnswer !== null && opponent.currentAnswer !== null) {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      handleReveal(user.currentAnswer, opponent.currentAnswer, user.answeredAt!, opponent.answeredAt!);
    }
  }, [user.currentAnswer, opponent.currentAnswer, phase, questionPhase, handleReveal]);

  const handleUserAnswer = (idx: number) => {
    if (phase !== 'playing' || questionPhase !== 'active' || user.currentAnswer !== null) return;
    // If opponent already got it correct first, skip
    if (opponent.currentAnswer !== null && opponent.currentAnswer === questions[currentQ].correct) return;
    setUser(u => ({ ...u, currentAnswer: idx, answeredAt: Date.now() }));
  };

  // Finish effects
  useEffect(() => {
    if (phase !== 'finished') return;
    const won = user.score > opponent.score;
    if (won) confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
  }, [phase]);

  if (phase === 'matching') return <MatchingUI countryName={country?.name ?? ''} timer={matchTimer} onCancel={onCancel} />;
  if (phase === 'ready') return <ReadyUI count={readyCount} userName="你" oppName={opponent.name} countryName={country?.name ?? ''} />;
  if (phase === 'playing' && questions.length > 0) {
    return (
      <BattleUI
        question={questions[currentQ]}
        questionNum={currentQ + 1}
        total={questions.length}
        timer={timer}
        user={user}
        opponent={opponent}
        questionPhase={questionPhase}
        streak={streakUser}
        onAnswer={handleUserAnswer}
      />
    );
  }
  if (phase === 'finished') {
    const won = user.score > opponent.score;
    const totalScoreChange = scoreChanges.reduce((acc, c) => acc + c.user, 0);
    const litProvince = won && country ? country.provinces[Math.floor(Math.random() * country.provinces.length)].id : null;
    return (
      <ResultUI
        won={won}
        isDraw={user.score === opponent.score}
        userScore={user.score}
        oppScore={opponent.score}
        oppName={opponent.name}
        totalChange={totalScoreChange}
        scoreChanges={scoreChanges}
        questions={questions}
        userAnswers={[]}
        onPlayAgain={() => {
          setPhase('matching');
          setMatchTimer(3);
          setReadyCount(3);
          setCurrentQ(0);
          setTimer(10);
          setQuestionPhase('active');
          setUser({ name: '你', avatar: 'user', score: 0, currentAnswer: null, answeredAt: null });
          setOpponent({ name: AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)], avatar: 'ai', score: 0, currentAnswer: null, answeredAt: null });
          setStreakUser(0);
          setStreakOpponent(0);
          setScoreChanges([]);
          setQuestions(getQuestionsForCountry(selectedCountry));
        }}
        onHome={() => {
          onFinish(won, litProvince);
        }}
      />
    );
  }

  return null;
}

function MatchingUI({ countryName, timer, onCancel }: { countryName: string; timer: number; onCancel: () => void }) {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const i = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background px-6">
      <button onClick={onCancel} className="absolute top-5 right-5 p-2 bg-card rounded-full border border-border">
        <X size={18} className="text-foreground" />
      </button>

      <div className="mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center animate-pulse">
            <Globe size={40} className="text-primary-foreground" />
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-primary border-dashed animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      <h2 className="text-foreground font-semibold text-xl mb-2">正在匹配中{dots}</h2>
      <p className="text-muted-foreground text-sm mb-1">对战国家: {countryName}</p>
      <p className="text-muted-foreground text-sm">预计等待: {timer}秒</p>

      <div className="mt-10 w-full max-w-xs">
        <div className="w-full bg-border rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-1000"
            style={{ width: `${((3 - timer) / 3) * 100}%` }}
          />
        </div>
      </div>

      <button
        onClick={onCancel}
        className="mt-8 px-8 py-3 bg-card text-muted-foreground rounded-full text-sm border border-border"
      >
        取消匹配
      </button>
    </div>
  );
}

function ReadyUI({ count, userName, oppName, countryName }: {
  count: number; userName: string; oppName: string; countryName: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background px-6">
      <p className="text-muted-foreground text-sm mb-8">{countryName} · 即将开始</p>

      <div className="flex items-center gap-6 mb-10 w-full max-w-xs">
        {/* User */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary border-2 border-primary-foreground flex items-center justify-center mb-2">
            <User size={28} className="text-muted-foreground" />
          </div>
          <p className="text-primary-foreground font-semibold text-sm">{userName}</p>
          <p className="text-muted-foreground text-xs">1280分</p>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center">
          <div className="bg-primary border border-border rounded-2xl px-4 py-2">
            <span className="text-primary-foreground font-bold text-xl">VS</span>
          </div>
        </div>

        {/* Opponent */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary border-2 border-primary-foreground/30 flex items-center justify-center mb-2">
            <Globe size={28} className="text-muted-foreground" />
          </div>
          <p className="text-primary-foreground font-semibold text-sm">{oppName}</p>
          <p className="text-muted-foreground text-xs">1150分</p>
        </div>
      </div>

      {/* Countdown */}
      <div className="w-24 h-24 rounded-full bg-primary border-4 border-primary-foreground flex items-center justify-center">
        <span className="text-primary-foreground font-bold" style={{ fontSize: count > 0 ? 48 : 28 }}>
          {count > 0 ? count : '开始！'}
        </span>
      </div>
    </div>
  );
}

function BattleUI({ question, questionNum, total, timer, user, opponent, questionPhase, streak, onAnswer }: {
  question: Question;
  questionNum: number;
  total: number;
  timer: number;
  user: PlayerState;
  opponent: PlayerState;
  questionPhase: 'active' | 'revealing';
  streak: number;
  onAnswer: (idx: number) => void;
}) {
  const timerPct = (timer / 10) * 100;
  const timerColor = timer > 5 ? '#292526' : timer > 3 ? '#f59e0b' : '#ef4444';

  const getOptionStyle = (idx: number) => {
    if (questionPhase === 'active') {
      if (user.currentAnswer === idx) return 'bg-primary border-primary text-primary-foreground';
      if (opponent.currentAnswer !== null && opponent.currentAnswer === question.correct && opponent.currentAnswer === idx) {
        return 'bg-[#e8f5e9] border-[#22c55e] text-foreground';
      }
      return 'bg-card border-border text-foreground';
    }
    // Revealing
    if (idx === question.correct) return 'bg-[#dcfce7] border-[#22c55e] text-foreground';
    if (user.currentAnswer === idx && idx !== question.correct) return 'bg-[#fee2e2] border-[#ef4444] text-foreground';
    return 'bg-card border-border text-muted-foreground';
  };

  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Score header */}
      <div className="bg-primary px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-muted-foreground" />
            </div>
            <span className="text-primary-foreground font-bold text-2xl">{user.score}</span>
            {streak >= 2 && (
              <div className="flex items-center gap-0.5 bg-[#f59e0b] text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                <Flame size={11} />
                <span>×{streak}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <span className="text-muted-foreground text-xs">{questionNum}/{total}</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock size={11} className="text-muted-foreground" />
              <span
                className="font-bold text-sm tabular-nums"
                style={{ color: timerColor }}
              >
                {timer}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-primary-foreground font-bold text-2xl">{opponent.score}</span>
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Globe size={14} className="text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
          />
        </div>
      </div>

      {/* Opponent status */}
      <div className="px-5 py-2 flex items-center justify-end">
        <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1 border border-border">
          <Globe size={11} className="text-muted-foreground" />
          <span className="text-muted-foreground text-xs">
            {opponent.currentAnswer !== null
              ? (opponent.currentAnswer === question.correct ? '✓ 已答对' : '✗ 已答错')
              : '思考中...'}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-5 flex flex-col justify-center">
        <div className="bg-card rounded-3xl p-5 mb-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-background text-muted-foreground text-xs px-2 py-0.5 rounded-full">{question.type}</span>
          </div>
          <p className="text-foreground text-lg font-medium leading-snug">{question.text}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2.5">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onAnswer(idx)}
              disabled={questionPhase === 'revealing' || user.currentAnswer !== null || (opponent.currentAnswer !== null && opponent.currentAnswer === question.correct)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all ${getOptionStyle(idx)}`}
            >
              <span className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-sm font-semibold text-muted-foreground flex-shrink-0">
                {labels[idx]}
              </span>
              <span className="font-medium text-sm">{opt}</span>
              {questionPhase === 'revealing' && idx === question.correct && (
                <CheckCircle size={16} className="ml-auto text-[#22c55e]" />
              )}
              {questionPhase === 'revealing' && user.currentAnswer === idx && idx !== question.correct && (
                <XCircle size={16} className="ml-auto text-[#ef4444]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Streak banner */}
      {questionPhase === 'revealing' && streak >= 2 && (
        <div className="px-5 pb-3">
          <div className="bg-[#f59e0b] text-white rounded-2xl px-4 py-2 text-center font-semibold text-sm flex items-center justify-center gap-1.5">
            <Flame size={15} />
            连续答对 {streak} 题！额外 +{streak - 1} 分加成
          </div>
        </div>
      )}
    </div>
  );
}

function ResultUI({ won, isDraw, userScore, oppScore, oppName, totalChange, scoreChanges, questions, onPlayAgain, onHome }: {
  won: boolean;
  isDraw: boolean;
  userScore: number;
  oppScore: number;
  oppName: string;
  totalChange: number;
  scoreChanges: Array<{ user: number; opp: number }>;
  questions: Question[];
  userAnswers: (number | null)[];
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-background overflow-auto">
      {/* Result header */}
      <div className={`px-5 pt-6 pb-5 text-center ${won ? 'bg-primary' : isDraw ? 'bg-[#4a4849]' : 'bg-primary'}`}>
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 mx-auto">
          {won ? <Trophy size={32} className="text-[#f59e0b]" /> : isDraw ? <Zap size={32} className="text-muted-foreground" /> : <User size={32} className="text-muted-foreground" />}
        </div>
        <h2 className="text-primary-foreground text-2xl font-bold mb-1">
          {won ? '胜利！' : isDraw ? '平局！' : '失败'}
        </h2>
        <p className="text-muted-foreground text-sm">
          {won ? '你比对手更厉害！' : isDraw ? '势均力敌！' : '下次再战！'}
        </p>

        {/* Score display */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-primary-foreground font-bold text-3xl">{userScore}</span>
            <span className="text-muted-foreground text-xs">你的得分</span>
          </div>
          <span className="text-muted-foreground text-xl">:</span>
          <div className="flex flex-col items-center">
            <span className="text-primary-foreground font-bold text-3xl">{oppScore}</span>
            <span className="text-muted-foreground text-xs">{oppName}</span>
          </div>
        </div>

        {/* Score change */}
        <div className={`inline-flex items-center gap-1 mt-3 px-4 py-1.5 rounded-full ${totalChange >= 0 ? 'bg-[#22c55e]/20' : 'bg-[#ef4444]/20'}`}>
          <Trophy size={14} className={totalChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'} />
          <span className={`font-semibold text-sm ${totalChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
            {totalChange >= 0 ? '+' : ''}{totalChange} 积分
          </span>
        </div>
      </div>

      {/* Round breakdown */}
      <div className="px-5 py-4">
        <h3 className="text-foreground font-semibold text-sm mb-3">答题详情</h3>
        <div className="space-y-2">
          {scoreChanges.map((sc, i) => (
            <div key={i} className="bg-card rounded-2xl px-4 py-3 flex items-center border border-border">
              <span className="text-muted-foreground text-xs w-8">第{i + 1}题</span>
              <span className="flex-1 text-foreground text-xs truncate mx-2">
                {questions[i]?.text}
              </span>
              <span className={`text-xs font-semibold ${sc.user > 0 ? 'text-[#22c55e]' : sc.user < 0 ? 'text-[#ef4444]' : 'text-muted-foreground'}`}>
                {sc.user > 0 ? '+' : ''}{sc.user}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="px-5 pb-8 pt-2 mt-auto space-y-3">
        <button
          onClick={onPlayAgain}
          className="w-full bg-primary text-primary-foreground rounded-full py-4 font-semibold text-base flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          再来一局
        </button>
        <button
          onClick={onHome}
          className="w-full bg-card text-foreground rounded-full py-4 font-semibold text-base flex items-center justify-center gap-2 border border-border"
        >
          <Home size={18} />
          返回首页
        </button>
      </div>
    </div>
  );
}
