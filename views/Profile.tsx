import React, { useState } from 'react';
import { GameState, Rank, RANK_THRESHOLDS, QuizQuestion, INITIAL_GAME_STATE } from '../types';
import { generateQualificationExam } from '../services/apiClient';
import {
  AcademicCapIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  ArchiveBoxArrowDownIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/solid';

interface ProfileProps {
  gameState: GameState;
  updateState: (updates: Partial<GameState>) => void;
}

const Profile: React.FC<ProfileProps> = ({ gameState, updateState }) => {
  const [examMode, setExamMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [examQuestion, setExamQuestion] = useState<QuizQuestion | null>(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const ranks = Object.values(Rank);
  const currentRankIndex = ranks.indexOf(gameState.rank);
  const nextRank = ranks[currentRankIndex + 1];
  const nextRankThreshold = nextRank ? RANK_THRESHOLDS[nextRank as Rank] : Infinity;
  const progress = nextRank
    ? Math.min(100, (gameState.experience / nextRankThreshold) * 100)
    : 100;

  const startExam = async () => {
    if (!nextRank) return;
    setLoading(true);
    setExamMode(true);
    try {
      const q = await generateQualificationExam(nextRank);
      setExamQuestion(q);
    } catch (e) {
      alert("考核系统连接失败。");
      setExamMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (!examQuestion) return;

    if (index === examQuestion.correctAnswer) {
      alert(`✅ 考核通过！\n\n${examQuestion.explanation}`);
      updateState({ rank: nextRank as Rank });
      setExamMode(false);
      setExamQuestion(null);
    } else {
      alert(`❌ 考核失败。\n正确答案是: ${examQuestion.options[examQuestion.correctAnswer]}\n\n解析: ${examQuestion.explanation}\n\n请重新复习后再来尝试。`);
      setExamMode(false);
      setExamQuestion(null);
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

  const handleResetGame = () => {
    const confirmReset = window.confirm("⚠️ 确定要重置所有游戏进度吗？\n\n此操作将删除所有资金、设备和职称，且无法撤销！");
    if (confirmReset) {
      localStorage.removeItem('vet-tycoon-state');
      updateState(INITIAL_GAME_STATE);
      alert("游戏进度已重置。");
    }
  };

  const toggleHistory = (id: string) => {
    setExpandedHistoryId(expandedHistoryId === id ? null : id);
  };

  if (examMode) {
    return (
      <div className="h-full overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <AcademicCapIcon className="w-8 h-8 text-teal-600" />
            {nextRank} 资格认证考核
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-500">考官正在抽取考题...</p>
            </div>
          ) : examQuestion ? (
            <div>
              <p className="text-lg font-medium text-slate-800 mb-8 leading-relaxed border-l-4 border-teal-500 pl-4 bg-slate-50 py-4">
                {examQuestion.question}
              </p>
              <div className="space-y-3">
                {examQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800 transition-all font-medium"
                  >
                    <span className="font-bold mr-3">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
              <button onClick={() => setExamMode(false)} className="mt-8 text-slate-400 text-sm hover:text-slate-600">放弃考核</button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ID Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-6xl shadow-inner border-4 border-white ring-4 ring-teal-50">
            👨‍⚕️
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">当前职称: {gameState.rank}</h2>

            <div className="space-y-4 mt-4">
              <div className="flex justify-between text-sm text-slate-500 mb-1">
                <span>晋升进度 ({nextRank || '最高职级'})</span>
                <span>{gameState.experience} / {nextRank ? nextRankThreshold : 'MAX'} XP</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {nextRank && (
                <button
                  onClick={startExam}
                  disabled={gameState.experience < nextRankThreshold}
                  className={`mt-4 w-full md:w-auto font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2
                  ${gameState.experience >= nextRankThreshold
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                `}
                >
                  <AcademicCapIcon className="w-5 h-5" />
                  {gameState.experience >= nextRankThreshold ? '参加晋升资格考核' : '经验不足，无法晋升'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-lg text-slate-700 mb-4">职业生涯统计</h3>
            <ul className="space-y-4">
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">累计收入</span>
                <span className="font-mono font-medium text-slate-800">¥ {gameState.money.toLocaleString()}</span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">治愈病例</span>
                <span className="font-mono font-medium text-slate-800">{gameState.totalPatientsTreated}</span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">行业声望</span>
                <span className="font-mono font-medium text-slate-800">{gameState.reputation}</span>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-slate-500">拥有设备数</span>
                <span className="font-mono font-medium text-slate-800">
                  {gameState.inventory.filter(i => i.owned).length} / {gameState.inventory.length}
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-teal-900 text-white p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-teal-800 rounded-full opacity-20 -mr-16 -mt-16"></div>
            <h3 className="font-bold text-lg mb-4 relative z-10">考证指南</h3>
            <p className="text-teal-200 text-sm leading-relaxed relative z-10">
              <strong>资格认证</strong> 是提升兽医职称的唯一途径。
              <br /><br />
              当您的临床经验（XP）达到标准后，医师协会将向您开放资格考试入口。考试题目由 AI 考官根据您的目标职称实时生成，涵盖内科、外科、药理等核心领域。
              <br /><br />
              只有通过考核，才能获得更高的诊疗权限与声望加成！
            </p>
          </div>
        </div>

        {/* Case History Section */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-5 h-5 text-teal-600" />
              历史接诊记录 ({gameState.caseHistory.length})
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {gameState.caseHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">暂无接诊记录</div>
            ) : (
              gameState.caseHistory.map((item) => (
                <div key={item.id} className="bg-white">
                  <button
                    onClick={() => toggleHistory(item.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${item.result.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
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
                        <p className="text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-200">
                          {item.result.feedback}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">金标准方案</span>
                        <p className="text-slate-500 text-xs font-mono">
                          {item.result.standardOfCare}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Settings Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <h3 className="font-bold text-lg text-slate-700 mb-6 flex items-center gap-2">
            <Cog6ToothIcon className="w-5 h-5" /> 系统设置
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleManualSave}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-teal-50 text-teal-700 font-bold rounded-xl hover:bg-teal-100 transition-colors border border-teal-100"
            >
              <ArchiveBoxArrowDownIcon className="w-5 h-5" />
              保存进度
            </button>

            <button
              onClick={handleResetGame}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-100"
            >
              <ArrowPathIcon className="w-5 h-5" />
              重置进度
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            * 游戏会自动保存。手动保存可用于确保数据安全。重置进度将清除本地所有存档。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;