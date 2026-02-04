import React, { useState } from 'react';
import { GameState, RANK_THRESHOLDS, Rank, CaseHistoryItem, INITIAL_GAME_STATE } from '../types';
import { generateQualificationExam } from '../services/apiClient';
import {
  TrophyIcon,
  StarIcon,
  AcademicCapIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyYenIcon,
  SparklesIcon,
  ArchiveBoxArrowDownIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/solid';

interface ProfileProps {
  gameState: GameState;
  updateState: (updates: Partial<GameState>) => void;
}

const Profile: React.FC<ProfileProps> = ({ gameState, updateState }) => {
  const [examState, setExamState] = useState<'IDLE' | 'LOADING' | 'TAKING' | 'RESULT'>('IDLE');
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [examScore, setExamScore] = useState(0);
  const [examPassed, setExamPassed] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const currentExpThreshold = RANK_THRESHOLDS[gameState.rank as Rank] || 0;
  const rankKeys = Object.keys(RANK_THRESHOLDS);
  const currentRankIndex = rankKeys.indexOf(gameState.rank as string);
  const nextRank = currentRankIndex < rankKeys.length - 1 ? rankKeys[currentRankIndex + 1] : null;
  const nextExpThreshold = nextRank ? RANK_THRESHOLDS[nextRank as Rank] : null;

  const progressPercent = nextExpThreshold
    ? Math.min(100, Math.max(0, ((gameState.experience - currentExpThreshold) / (nextExpThreshold - currentExpThreshold)) * 100))
    : 100;

  const startExam = async () => {
    setExamState('LOADING');
    try {
      const questions = await generateQualificationExam(gameState.rank, 5);
      if (questions && questions.length > 0) {
        setExamQuestions(questions);
        setCurrentQIdx(0);
        setExamScore(0);
        setExamState('TAKING');
      } else {
        throw new Error('No questions received');
      }
    } catch (error) {
      console.error(error);
      alert("无法获取考核题目，请稍后重试。");
      setExamState('IDLE');
    }
  };

  const handleAnswer = (index: number) => {
    const correct = index === examQuestions[currentQIdx].correctIndex;
    if (correct) setExamScore(s => s + 1);

    if (currentQIdx < examQuestions.length - 1) {
      setCurrentQIdx(i => i + 1);
    } else {
      const finalScore = examScore + (correct ? 1 : 0);
      const passed = finalScore >= 4;
      setExamPassed(passed);
      setExamScore(finalScore);
      setExamState('RESULT');

      if (passed && nextRank) {
        updateState({ rank: nextRank as Rank, experience: 0 });
      }
    }
  };

  const handleManualSave = () => {
    try {
      localStorage.setItem('vet-tycoon-state', JSON.stringify(gameState));
      alert("✅ 游戏进度已手动保存！");
    } catch (e) {
      alert("保存失败，请检查浏览器存储设置。");
    }
  };

  const resetGame = () => {
    if (window.confirm("⚠️ 确定要重置所有游戏进度吗？此操作无法撤销！")) {
      localStorage.removeItem('vet-tycoon-state');
      updateState(INITIAL_GAME_STATE);
      alert("游戏进度已重置。");
    }
  };

  const toggleHistory = (id: string) => {
    setExpandedHistoryId(expandedHistoryId === id ? null : id);
  };

  // 职业等级颜色映射
  const getRankStyle = (rank: string) => {
    const styles: Record<string, { gradient: string; icon: string }> = {
      '兽医学生': { gradient: 'from-slate-500 to-slate-600', icon: '📚' },
      '实习医生': { gradient: 'from-cyan-500 to-blue-600', icon: '🩺' },
      '住院医师': { gradient: 'from-teal-500 to-emerald-600', icon: '💉' },
      '主治医师': { gradient: 'from-green-500 to-emerald-600', icon: '⚕️' },
      '副主任医师': { gradient: 'from-amber-500 to-orange-600', icon: '🏅' },
      '主任医师': { gradient: 'from-purple-500 to-violet-600', icon: '👑' },
    };
    return styles[rank] || styles['兽医学生'];
  };

  const rankStyle = getRankStyle(gameState.rank);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile Header */}
        <div className="game-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className={`w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br ${rankStyle.gradient} rounded-3xl flex items-center justify-center text-5xl shadow-xl border-4 border-white`}>
              {rankStyle.icon}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">{gameState.rank}</h2>
                <TrophyIcon className="w-7 h-7 text-amber-500" />
              </div>

              {nextRank && (
                <div className="mt-4">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-500 font-medium">距离晋升 <span className="font-bold text-cyan-600">{nextRank}</span></span>
                    <span className="font-bold text-slate-700">{gameState.experience - currentExpThreshold}/{nextExpThreshold! - currentExpThreshold} XP</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full bg-gradient-to-r ${rankStyle.gradient} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {progressPercent >= 100 && examState === 'IDLE' && (
                    <button
                      onClick={startExam}
                      className="mt-4 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-200 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      <SparklesIcon className="w-5 h-5" />
                      开始晋升考核
                    </button>
                  )}
                </div>
              )}

              {nextRank === null && (
                <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-amber-600 font-bold">
                  <StarIcon className="w-5 h-5" />
                  您已达到最高职称！
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {examState === 'LOADING' && (
          <div className="game-card p-8 flex flex-col items-center justify-center animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <AcademicCapIcon className="w-7 h-7 text-amber-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 font-bold text-slate-700">正在生成晋升考核题目...</p>
          </div>
        )}

        {/* Exam Taking State */}
        {examState === 'TAKING' && examQuestions.length > 0 && (
          <div className="game-card p-6 animate-pop">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                <AcademicCapIcon className="w-6 h-6 text-amber-500" />
                晋升考核
              </h3>
              <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-bold text-sm">
                {currentQIdx + 1} / {examQuestions.length}
              </span>
            </div>

            <p className="text-slate-700 font-medium text-lg leading-relaxed mb-6 p-4 bg-slate-50 rounded-xl">
              {examQuestions[currentQIdx].question}
            </p>

            <div className="space-y-3">
              {examQuestions[currentQIdx].options.map((opt: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 transition-all font-medium cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg text-sm font-bold text-slate-600 mr-3">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exam Result State */}
        {examState === 'RESULT' && (
          <div className={`game-card p-8 text-center animate-pop border-l-4 ${examPassed ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <div className="text-6xl mb-4">{examPassed ? '🎉' : '📚'}</div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2 flex items-center justify-center gap-2">
              {examPassed ? (
                <>
                  <CheckCircleIcon className="w-8 h-8 text-green-500" />
                  考核通过！
                </>
              ) : (
                <>
                  <XCircleIcon className="w-8 h-8 text-red-500" />
                  考核未通过
                </>
              )}
            </h3>
            <p className="text-slate-600 mb-6">
              得分: <span className="font-bold text-xl">{examScore}</span> / {examQuestions.length}
              {examPassed && nextRank && (
                <span className="block mt-2 text-green-600 font-bold">
                  恭喜晋升为 {nextRank}！
                </span>
              )}
            </p>
            <button
              onClick={() => setExamState('IDLE')}
              className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all cursor-pointer"
            >
              返回档案
            </button>
          </div>
        )}

        {/* Stats Grid - Only show in IDLE state */}
        {examState === 'IDLE' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Career Stats */}
              <div className="game-card p-6">
                <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-cyan-600" />
                  职业生涯统计
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-slate-500 flex items-center gap-2">
                      <CurrencyYenIcon className="w-4 h-4 text-amber-500" />
                      累计收入
                    </span>
                    <span className="font-mono font-bold text-slate-800">¥ {gameState.money.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-slate-500">治愈病例</span>
                    <span className="font-mono font-bold text-slate-800">{gameState.totalPatientsTreated}</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-slate-500">行业声望</span>
                    <span className="font-mono font-bold text-slate-800">{gameState.reputation}</span>
                  </li>
                  <li className="flex justify-between items-center pt-1">
                    <span className="text-slate-500">拥有设备</span>
                    <span className="font-mono font-bold text-slate-800">
                      {gameState.inventory.filter(i => i.owned).length} / {gameState.inventory.length}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-cyan-700 to-teal-800 text-white p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <h3 className="font-bold text-lg mb-4 relative z-10 flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5" />
                  考证指南
                </h3>
                <p className="text-cyan-100 text-sm leading-relaxed relative z-10">
                  <strong>资格认证</strong> 是提升兽医职称的唯一途径。
                  <br /><br />
                  当您的临床经验（XP）达到标准后，医师协会将向您开放资格考试入口。考试题目由 AI 考官根据您的目标职称实时生成。
                  <br /><br />
                  只有通过考核，才能获得更高的诊疗权限与声望加成！
                </p>
              </div>
            </div>

            {/* Case History */}
            <div className="game-card overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-cyan-600" />
                  历史接诊记录 ({gameState.caseHistory.length})
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {gameState.caseHistory.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">暂无接诊记录</div>
                ) : (
                  gameState.caseHistory.slice(0, 10).map((item) => (
                    <div key={item.id} className="bg-white">
                      <button
                        onClick={() => toggleHistory(item.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${item.result.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                            {item.caseData.species === '猫' ? '🐱' : '🐶'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">
                              {item.caseData.breed} <span className="text-slate-400 font-normal">| {new Date(item.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="text-xs text-slate-500 truncate max-w-[150px] md:max-w-xs">
                              主诉: {item.caseData.chiefComplaint}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`font-bold ${item.result.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                              {item.result.score}分
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">
                              {item.result.isCorrect ? 'SUCCESS' : 'FAILURE'}
                            </div>
                          </div>
                          {expandedHistoryId === item.id ? <ChevronUpIcon className="w-5 h-5 text-slate-400" /> : <ChevronDownIcon className="w-5 h-5 text-slate-400" />}
                        </div>
                      </button>

                      {expandedHistoryId === item.id && (
                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-sm space-y-3 animate-pop">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">你的诊断</span>
                              <p className="font-medium text-slate-700">{item.userDiagnosis}</p>
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">正确诊断</span>
                              <p className="font-medium text-green-700">{item.result.correctDiagnosis}</p>
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">专家点评</span>
                            <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                              {item.result.feedback}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* System Settings */}
            <div className="game-card p-6">
              <h3 className="font-bold text-lg text-slate-700 mb-6 flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5 text-cyan-600" />
                系统设置
              </h3>

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleManualSave}
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-3.5 bg-cyan-50 text-cyan-700 font-bold rounded-xl hover:bg-cyan-100 transition-all border border-cyan-200 cursor-pointer"
                >
                  <ArchiveBoxArrowDownIcon className="w-5 h-5" />
                  保存进度
                </button>

                <button
                  onClick={resetGame}
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-3.5 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 transition-all border border-red-200 cursor-pointer"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                  重置进度
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">
                * 游戏会自动保存。手动保存可用于确保数据安全。重置进度将清除本地所有存档。
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;