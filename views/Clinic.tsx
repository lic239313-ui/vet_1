import React, { useState, useRef, useEffect } from 'react';
import { GameState, ClinicalCase, SOAPStage, LabResultItem, GameView, CaseHistoryItem } from '../types';
import { generateClinicalCase, evaluateTreatment } from '../services/apiClient';
import {
  ClipboardDocumentCheckIcon,
  BeakerIcon,
  ChatBubbleBottomCenterTextIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TableCellsIcon,
  CalculatorIcon,
  LockClosedIcon,
  ShoppingCartIcon,
  EyeIcon,
  SpeakerWaveIcon,
  HandRaisedIcon,
  SparklesIcon,
  LightBulbIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/solid';

interface ClinicProps {
  gameState: GameState;
  updateState: (updates: Partial<GameState>) => void;
  onChangeView: (view: GameView) => void;
}

interface ChatMessage {
  role: 'VET' | 'OWNER';
  text: string;
}

const Clinic: React.FC<ClinicProps> = ({ gameState, updateState, onChangeView }) => {
  const [stage, setStage] = useState<SOAPStage | 'IDLE' | 'LOADING' | 'RESULT'>('IDLE');
  const [currentCase, setCurrentCase] = useState<ClinicalCase | null>(null);

  // Player Inputs - Subjective
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [askedQuestionIndices, setAskedQuestionIndices] = useState<Set<number>>(new Set());
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Player Inputs - Objective (Interactive Physical Exam)
  const [revealedExam, setRevealedExam] = useState<Set<string>>(new Set());

  // Player Inputs - Assessment & Plan
  const [diagnosisInput, setDiagnosisInput] = useState('');
  const [planInput, setPlanInput] = useState('');

  // Game State
  const [evalResult, setEvalResult] = useState<any>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const startCase = async () => {
    if (gameState.energy < 15) {
      alert("精力不足 (需要 15 点)");
      return;
    }
    setStage('LOADING');
    setChatHistory([]);
    setAskedQuestionIndices(new Set());
    setRevealedExam(new Set());
    setDiagnosisInput('');
    setPlanInput('');

    try {
      const newCase = await generateClinicalCase(gameState.rank);
      setCurrentCase(newCase);
      updateState({ energy: gameState.energy - 15 });
      setStage(SOAPStage.SUBJECTIVE);
      // Initial greeting from owner based on chief complaint
      setChatHistory([
        { role: 'OWNER', text: `医生，快帮帮我家 ${newCase.breed}！${newCase.chiefComplaint}` }
      ]);
    } catch (e) {
      console.error(e);
      alert("AI 病例生成失败，请重试。");
      setStage('IDLE');
    }
  };

  const handleAskQuestion = (index: number) => {
    if (!currentCase || askedQuestionIndices.has(index)) return;

    const pair = currentCase.dialogue[index];

    // Add Vet Question
    setChatHistory(prev => [...prev, { role: 'VET', text: pair.question }]);

    // Simulate thinking delay for Owner
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'OWNER', text: pair.answer }]);
    }, 600);

    const newSet = new Set(askedQuestionIndices);
    newSet.add(index);
    setAskedQuestionIndices(newSet);
  };

  const toggleExamReveal = (key: string) => {
    const newSet = new Set(revealedExam);
    if (!newSet.has(key)) {
      newSet.add(key);
      setRevealedExam(newSet);
    }
  };

  const submitSOAP = async () => {
    if (!currentCase) return;
    setStage('LOADING');
    try {
      const result = await evaluateTreatment(currentCase, diagnosisInput, planInput);
      setEvalResult(result);

      // Create History Record
      const historyItem: CaseHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        caseData: currentCase,
        result: result,
        userDiagnosis: diagnosisInput,
        userPlan: planInput
      };

      // Reward Calculation
      const moneyChange = result.isCorrect ? 300 + (result.score * 5) : -100;
      const repChange = result.isCorrect ? 10 : -5;

      updateState({
        money: gameState.money + moneyChange,
        reputation: gameState.reputation + repChange,
        experience: gameState.experience + (result.isCorrect ? result.score : 10),
        totalPatientsTreated: gameState.totalPatientsTreated + 1,
        caseHistory: [historyItem, ...gameState.caseHistory] // Add to history
      });

      setStage('RESULT');
    } catch (e) {
      alert("评估失败，请检查网络。");
      setStage(SOAPStage.PLAN);
    }
  };

  // Helper to check if equipment is owned
  const hasEquip = (key: string) => gameState.inventory.some(e => e.owned && e.unlocksParams.includes(key));
  const getEquipName = (key: string) => gameState.inventory.find(e => e.unlocksParams.includes(key))?.name;

  // Custom UI Component for Locked Data with Buy Action
  const LockedData = ({ label, equipKey }: { label: string, equipKey: string }) => (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-500 mt-2">
      <div className="flex items-center gap-2 font-bold text-base text-slate-600">
        <LockClosedIcon className="w-5 h-5 text-slate-400" /> {label}
      </div>
      <div className="text-sm">需要设备: <span className="font-bold text-cyan-700">{getEquipName(equipKey)}</span></div>
      <button
        onClick={() => onChangeView(GameView.MANAGEMENT)}
        className="mt-1 flex items-center gap-2 bg-amber-100 text-amber-700 hover:bg-amber-200 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 cursor-pointer"
      >
        <ShoppingCartIcon className="w-4 h-4" /> 前往采购市场
      </button>
    </div>
  );

  // IDLE State - Enhanced Welcome Screen
  if (stage === 'IDLE') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="relative mb-8">
          <div className="w-36 h-36 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white animate-pulse-glow rotate-3">
            <HeartIcon className="w-16 h-16 text-white drop-shadow-lg" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-cyan-100 -rotate-6">
            <PlayIcon className="w-8 h-8 text-cyan-600 ml-0.5" />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-700 via-teal-600 to-cyan-700 bg-clip-text text-transparent">
            VetLogic 临床轮转
          </h1>
          <p className="text-slate-500 mt-3 font-medium text-lg">
            请像真正的兽医一样思考
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-400">
            <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full font-semibold">S</span>
            <ArrowRightIcon className="w-4 h-4" />
            <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full font-semibold">O</span>
            <ArrowRightIcon className="w-4 h-4" />
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold">A</span>
            <ArrowRightIcon className="w-4 h-4" />
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-semibold">P</span>
          </div>
        </div>

        <button
          onClick={startCase}
          className="btn-game btn-primary w-full max-w-md py-4 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 hover-lift"
        >
          <PlayIcon className="w-6 h-6" />
          接诊下一位
          <span className="text-cyan-200 text-sm font-normal">(-15 精力)</span>
        </button>

        <p className="text-slate-400 text-sm mt-6 max-w-md">
          每个病例都是AI根据您的职称级别动态生成的真实临床情境
        </p>
      </div>
    );
  }

  // LOADING State - Enhanced with Skeleton
  if (stage === 'LOADING') {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-cyan-100 border-t-cyan-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <HeartIcon className="w-8 h-8 text-cyan-500 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 font-bold text-slate-700 text-lg">正在读取病历系统...</p>
        <p className="text-slate-400 text-sm mt-2">AI正在生成临床病例</p>

        {/* Skeleton Preview */}
        <div className="mt-8 w-full max-w-md space-y-3">
          <div className="skeleton h-12 w-full"></div>
          <div className="skeleton h-8 w-3/4"></div>
          <div className="skeleton h-8 w-1/2"></div>
        </div>
      </div>
    );
  }

  // RESULT State - Enhanced Feedback Display
  if (stage === 'RESULT') {
    return (
      <div className="h-full overflow-y-auto p-4 animate-pop">
        <div className={`game-card p-6 border-l-4 ${evalResult.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                {evalResult.isCorrect ? (
                  <CheckCircleIcon className="w-8 h-8 text-green-500" />
                ) : (
                  <ExclamationTriangleIcon className="w-8 h-8 text-amber-500" />
                )}
                {evalResult.isCorrect ? '诊疗成功' : '诊疗偏差'}
              </h2>
              <p className="text-slate-500 font-mono text-sm font-bold mt-1">
                得分: <span className={evalResult.isCorrect ? 'text-green-600' : 'text-amber-600'}>{evalResult.score}</span>/100
              </p>
            </div>
            <div className={`text-5xl ${evalResult.isCorrect ? 'animate-bounce' : ''}`}>
              {evalResult.isCorrect ? '🎉' : '📚'}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-gradient-to-r from-slate-50 to-cyan-50 p-5 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                <ClipboardDocumentCheckIcon className="w-4 h-4 text-cyan-600" />
                专家复盘
              </h3>
              <p className="text-slate-700 leading-relaxed">{evalResult.feedback}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <span className="text-xs font-bold text-green-700 uppercase tracking-wide">正确诊断</span>
                <p className="font-semibold text-slate-800 mt-1">{evalResult.correctDiagnosis}</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wide">金标准方案</span>
                <p className="font-medium text-slate-700 text-sm mt-1">{evalResult.standardOfCare}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStage('IDLE')}
            className="mt-8 w-full py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-bold rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all shadow-lg cursor-pointer"
          >
            完成并保存病历
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      {/* Patient Header - Enhanced with gradient */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-4 rounded-t-2xl shadow-lg shrink-0 flex justify-between items-center border-b border-slate-600">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center font-bold text-2xl shadow-inner border border-slate-500">
            {currentCase?.species === '猫' ? '🐱' : '🐶'}
          </div>
          <div>
            <div className="font-bold text-lg leading-none flex items-center gap-2">
              {currentCase?.breed}
              <span className="text-slate-400 text-sm font-normal">| {currentCase?.sex}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1.5 font-mono flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-slate-600 rounded text-slate-300">ID: {currentCase?.id.slice(-6)}</span>
              <span>{currentCase?.age}</span>
              <span className="text-cyan-400">{currentCase?.weightKg} kg</span>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-slate-400 mb-1">主人特征</div>
          <div className="font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg text-sm">{currentCase?.ownerPersona}</div>
        </div>
      </div>

      {/* Progress Stepper - Enhanced with colors */}
      <div className="bg-white/95 backdrop-blur border-b border-slate-200 flex overflow-x-auto shrink-0">
        {Object.values(SOAPStage).map((s, index) => {
          const colors = [
            { active: 'border-cyan-500 text-cyan-700 bg-cyan-50', hover: 'hover:bg-cyan-50/50' },
            { active: 'border-teal-500 text-teal-700 bg-teal-50', hover: 'hover:bg-teal-50/50' },
            { active: 'border-emerald-500 text-emerald-700 bg-emerald-50', hover: 'hover:bg-emerald-50/50' },
            { active: 'border-green-500 text-green-700 bg-green-50', hover: 'hover:bg-green-50/50' },
          ];
          const colorSet = colors[index] || colors[0];
          return (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`flex-1 py-3.5 text-sm font-bold whitespace-nowrap border-b-4 transition-all px-4 cursor-pointer
                ${stage === s ? colorSet.active : `border-transparent text-slate-400 ${colorSet.hover}`}
              `}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 overflow-y-auto p-4">

        {/* SUBJECTIVE STAGE - Chat Interface */}
        {stage === SOAPStage.SUBJECTIVE && (
          <div className="h-full flex flex-col gap-4 animate-pop">

            {/* Chat Log Window */}
            <div className="flex-1 game-card p-4 overflow-y-auto space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'VET' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                  <div className={`
                     max-w-[85%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm
                     ${msg.role === 'VET'
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200'}
                   `}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Interaction Area */}
            <div className="shrink-0 game-card p-4">
              <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-cyan-600" />
                问诊方向
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentCase?.dialogue.map((option, idx) => {
                  const isAsked = askedQuestionIndices.has(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAskQuestion(idx)}
                      disabled={isAsked}
                      className={`
                        text-left p-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer
                        ${isAsked
                          ? 'bg-slate-50 border-slate-100 text-slate-400 line-through opacity-60'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-800 hover:shadow-md hover:-translate-y-0.5'}
                      `}
                    >
                      <span className="block text-xs text-cyan-600 font-medium mb-1">{option.topic}</span>
                      {option.question}
                    </button>
                  );
                })}
              </div>

              {/* Progress Button */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                <button onClick={() => setStage(SOAPStage.OBJECTIVE)} className="btn-game btn-primary px-8 py-3.5 rounded-xl font-bold w-full sm:w-auto flex items-center justify-center gap-2">
                  问诊结束，开始体格检查
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OBJECTIVE STAGE */}
        {stage === SOAPStage.OBJECTIVE && (
          <div className="space-y-4 animate-pop">

            {/* Interactive Physical Exam Grid */}
            <div className="game-card p-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-4 border-b pb-2">
                <HandRaisedIcon className="w-5 h-5 text-amber-500" />
                五感检查 (Physical Exam)
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                {[
                  { key: 'visual', label: '视诊', icon: EyeIcon, color: 'text-blue-500', equip: null },
                  { key: 'auscultation', label: '听诊', icon: SpeakerWaveIcon, color: 'text-red-500', equip: null },
                  { key: 'palpation', label: '触诊', icon: HandRaisedIcon, color: 'text-amber-500', equip: null },
                  { key: 'olfaction', label: '嗅诊', icon: SparklesIcon, color: 'text-purple-500', equip: null },
                  { key: 'woodsLamp', label: '伍德氏灯', icon: LightBulbIcon, color: 'text-indigo-500', equip: 'woodsLamp' },
                ].map((item) => {
                  const isRevealed = revealedExam.has(item.key);
                  const detail = currentCase?.physicalExam?.[item.key as keyof typeof currentCase.physicalExam];
                  // Check if equipment is needed and owned
                  const isLocked = !!(item.equip && !hasEquip(item.equip));

                  return (
                    <button
                      key={item.key}
                      onClick={() => !isLocked && toggleExamReveal(item.key)}
                      disabled={isLocked}
                      className={`
                           text-left p-3 rounded-xl border-2 transition-all relative overflow-hidden group min-h-[5rem]
                           ${isLocked
                          ? 'bg-slate-100 border-slate-200 opacity-70'
                          : isRevealed
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-50 border-slate-100 hover:border-teal-200'}
                         `}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        {isLocked ? (
                          <LockClosedIcon className="w-4 h-4 text-slate-400" />
                        ) : (
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        )}
                        <span className="font-bold text-slate-700 text-xs">{item.label}</span>
                      </div>

                      {isLocked ? (
                        <div className="text-[10px] text-slate-400 font-medium">需要设备</div>
                      ) : isRevealed ? (
                        <div className="text-xs text-slate-600 font-medium leading-snug animate-pop">
                          {detail || '未见异常'}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-2">
                          点击检查
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Basic Vitals */}
            <div className="game-card p-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-4 border-b pb-2">
                <BeakerIcon className="w-5 h-5 text-red-500" />
                基础体征 (Vitals)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <MetricBox label="体温 (T)" value={`${currentCase?.tpr.temp}°C`} highlight={currentCase!.tpr.temp > 39.2} />
                <MetricBox label="心率 (HR)" value={`${currentCase?.tpr.hr} bpm`} highlight={currentCase!.tpr.hr > 140} />
                <MetricBox label="呼吸 (RR)" value={`${currentCase?.tpr.rr} bpm`} />
                <MetricBox label="粘膜/CRT" value={`${currentCase?.tpr.mm} / ${currentCase?.tpr.crt}`} />
                {hasEquip('bp') ? (
                  <MetricBox label="血压 (BP)" value={`${currentCase?.tpr.bp || '120'} mmHg`} highlight={(parseInt(currentCase?.tpr.bp || "120") > 160) || (parseInt(currentCase?.tpr.bp || "120") < 90)} />
                ) : (
                  <div className="p-3 rounded-lg border bg-slate-100 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                    <LockClosedIcon className="w-4 h-4 mb-1" />
                    <span className="text-[10px]">需血压计</span>
                  </div>
                )}
              </div>
            </div>

            {/* Labs - Conditional */}
            <div className="game-card p-4">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="flex items-center gap-2 font-bold text-slate-700">
                  <TableCellsIcon className="w-5 h-5 text-blue-500" />
                  实验室数据 (Labs)
                </h3>
              </div>

              {hasEquip('cbc') ? (
                currentCase?.cbcSummary ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <span className="font-bold text-blue-700 text-sm">CBC 血常规：</span>
                    <span className="text-slate-700 ml-2">{currentCase.cbcSummary}</span>
                  </div>
                ) : currentCase?.cbc ? (
                  <LabTable title="CBC 血常规" data={currentCase.cbc} />
                ) : (
                  <p className="text-slate-400 text-sm">血常规未见明显异常</p>
                )
              ) : (
                <LockedData label="CBC 数据未解锁" equipKey="cbc" />
              )}

              {hasEquip('chem') ? (
                currentCase?.chemSummary ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 mt-3">
                    <span className="font-bold text-green-700 text-sm">生化 Chem：</span>
                    <span className="text-slate-700 ml-2">{currentCase.chemSummary}</span>
                  </div>
                ) : currentCase?.chem ? (
                  <div className="mt-4">
                    <LabTable title="Biochemistry 生化" data={currentCase.chem} />
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm mt-3">生化未见明显异常</p>
                )
              ) : (
                <LockedData label="生化数据未解锁" equipKey="chem" />
              )}

              {hasEquip('bloodGas') ? (
                currentCase?.bloodGas && currentCase.bloodGas.length > 0 ? (
                  <div className="mt-4">
                    <LabTable title="Blood Gas 血气分析" data={currentCase.bloodGas} />
                  </div>
                ) : null
              ) : (
                <LockedData label="血气分析未解锁" equipKey="bloodGas" />
              )}
            </div>

            {/* Imaging */}
            <div className="game-card p-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-4 border-b pb-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-500" />
                影像学检查 (Imaging)
              </h3>
              {hasEquip('xray') ? (
                <p className="font-mono text-sm text-slate-800 bg-black/5 p-3 rounded border border-black/10">
                  X-RAY REPORT: {currentCase?.xraySummary || currentCase?.imaging?.xrayDescription || "未见明显异常 (NAD)"}
                </p>
              ) : <LockedData label="X光影像未解锁" equipKey="xray" />}
            </div>

            <div className="text-center">
              <button onClick={() => setStage(SOAPStage.ASSESSMENT)} className="btn-game btn-primary px-8 py-3 rounded-xl font-bold">下一步: 鉴别诊断 (A)</button>
            </div>
          </div>
        )}

        {/* ASSESSMENT STAGE */}
        {stage === SOAPStage.ASSESSMENT && (
          <div className="space-y-4 animate-pop h-full flex flex-col">
            <div className="game-card p-6 flex-1">
              <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                鉴别诊断 (Differential Diagnosis)
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                综合 S 与 O 的信息，列出最可能的病因。
              </p>

              <textarea
                className="w-full h-48 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none font-bold text-slate-700 resize-none"
                placeholder="例如：
1. 细小病毒肠炎 (CPV)
2. 异物梗阻
3. 饮食性胃肠炎"
                value={diagnosisInput}
                onChange={e => setDiagnosisInput(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button onClick={() => setStage(SOAPStage.PLAN)} className="btn-game btn-primary px-8 py-3 rounded-xl font-bold">下一步: 治疗方案 (P)</button>
            </div>
          </div>
        )}

        {/* PLAN STAGE */}
        {stage === SOAPStage.PLAN && (
          <div className="space-y-4 animate-pop h-full flex flex-col">
            <div className="game-card p-6 flex-1">
              <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-2">
                <CalculatorIcon className="w-5 h-5 text-green-600" />
                治疗方案 (Plan)
              </h3>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-xs text-yellow-800 mb-4 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4" />
                注意：体重 {currentCase?.weightKg} kg。请务必计算准确 mg/kg 剂量。
              </div>

              <textarea
                className="w-full h-64 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-green-500 outline-none font-mono text-sm text-slate-700 resize-none"
                placeholder={`Rx:
1. 乳酸林格氏液 (LRS) ___ ml/hr
2. 速诺 (Synulox) ___ mg SC
3. 止吐宁 (Cerenia) ___ mg SC`}
                value={planInput}
                onChange={e => setPlanInput(e.target.value)}
              />
            </div>
            <button
              onClick={submitSOAP}
              disabled={!diagnosisInput || !planInput}
              className="btn-game btn-primary w-full py-4 rounded-xl font-bold text-lg shadow-xl"
            >
              提交完整病历
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

// UI Components

const MetricBox = ({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) => (
  <div className={`p-3 rounded-lg border text-center ${highlight ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
    <div className="text-xs text-slate-500 uppercase font-bold">{label}</div>
    <div className={`font-mono font-bold text-lg ${highlight ? 'text-red-600' : 'text-slate-700'}`}>{value}</div>
  </div>
);

const LabTable = ({ title, data }: { title: string, data: LabResultItem[] }) => (
  <div className="mb-4">
    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 pl-1">{title}</h4>
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden text-sm">
      <table className="w-full">
        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-3 py-2 text-left font-bold">项目</th>
            <th className="px-3 py-2 text-right font-bold">结果</th>
            <th className="px-3 py-2 text-right font-normal text-xs">参考值</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-b border-slate-50 last:border-0">
              <td className="px-3 py-2 font-medium text-slate-700">{item.name}</td>
              <td className={`px-3 py-2 text-right font-mono font-bold ${item.flag === 'H' || item.flag === 'L' ? 'text-red-600' : 'text-slate-800'}`}>
                {item.value} {item.flag && <span className="ml-1 text-[10px] bg-red-100 text-red-700 px-1 rounded">{item.flag}</span>}
              </td>
              <td className="px-3 py-2 text-right text-slate-400 text-xs font-mono">{item.refRange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Clinic;