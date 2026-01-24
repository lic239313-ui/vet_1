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
  LightBulbIcon
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
    <div className="p-6 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-500 mt-2">
      <div className="flex items-center gap-2 font-bold text-lg text-slate-600">
        <LockClosedIcon className="w-5 h-5" /> {label}
      </div>
      <div className="text-sm">需要设备: <span className="font-bold text-slate-700">{getEquipName(equipKey)}</span></div>
      <button
        onClick={() => onChangeView(GameView.MANAGEMENT)}
        className="mt-1 flex items-center gap-2 bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
      >
        <ShoppingCartIcon className="w-4 h-4" /> 前往采购市场
      </button>
    </div>
  );

  if (stage === 'IDLE') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-slate-100 mb-4 animate-pop">
          <PlayIcon className="w-16 h-16 text-teal-600 ml-2" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800">VetLogic 临床轮转</h1>
          <p className="text-slate-500 mt-2 font-medium">请像真正的兽医一样思考 (SOAP 流程)</p>
        </div>
        <button onClick={startCase} className="btn-game btn-primary w-full max-w-md py-4 rounded-xl text-xl font-bold shadow-lg shadow-teal-200">
          接诊下一位 (-15 精力)
        </button>
      </div>
    );
  }

  if (stage === 'LOADING') {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="mt-4 font-mono text-slate-500 text-sm font-bold">正在读取病历系统 (PMS)...</p>
      </div>
    );
  }

  if (stage === 'RESULT') {
    return (
      <div className="h-full overflow-y-auto p-4 animate-pop">
        <div className={`game-card p-6 border-l-8 ${evalResult.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800">
                {evalResult.isCorrect ? '诊疗成功' : '诊疗偏差'}
              </h2>
              <p className="text-slate-500 font-mono text-sm font-bold">得分: {evalResult.score}/100</p>
            </div>
            <div className="text-4xl">{evalResult.isCorrect ? '✅' : '⚠️'}</div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2 text-sm uppercase">专家复盘 (Debrief)</h3>
              <p className="text-slate-700 leading-relaxed text-sm">{evalResult.feedback}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <span className="text-xs font-bold text-green-700 uppercase">正确诊断</span>
                <p className="font-medium text-slate-800">{evalResult.correctDiagnosis}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-xs font-bold text-blue-700 uppercase">金标准方案</span>
                <p className="font-medium text-slate-800 text-xs">{evalResult.standardOfCare}</p>
              </div>
            </div>
          </div>

          <button onClick={() => setStage('IDLE')} className="mt-8 w-full py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors">
            完成并在病历存档
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      {/* Patient Header (PMS Style) */}
      <div className="bg-slate-800 text-white p-4 rounded-t-2xl shadow-md shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center font-bold text-2xl">
            {currentCase?.species === '猫' ? '🐱' : '🐶'}
          </div>
          <div>
            <div className="font-mono font-bold text-lg leading-none">
              {currentCase?.breed} <span className="text-slate-400 text-sm font-normal">| {currentCase?.sex}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              ID: {currentCase?.id.slice(-6)} | {currentCase?.age} | {currentCase?.weightKg} kg
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-slate-400">主人特征</div>
          <div className="font-bold text-amber-400">{currentCase?.ownerPersona}</div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white border-b border-slate-200 flex overflow-x-auto shrink-0">
        {Object.values(SOAPStage).map((s) => (
          <button
            key={s}
            onClick={() => setStage(s)}
            className={`flex-1 py-3 text-sm font-bold whitespace-nowrap border-b-4 transition-colors px-4
              ${stage === s ? 'border-teal-500 text-teal-800 bg-teal-50' : 'border-transparent text-slate-400 hover:bg-slate-50'}
            `}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-100 overflow-y-auto p-4">

        {/* SUBJECTIVE STAGE - Chat Interface */}
        {stage === SOAPStage.SUBJECTIVE && (
          <div className="h-full flex flex-col gap-4 animate-pop">

            {/* Chat Log Window */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 overflow-y-auto space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'VET' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                     max-w-[85%] p-3 rounded-2xl text-sm font-medium leading-relaxed
                     ${msg.role === 'VET'
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'}
                   `}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Interaction Area */}
            <div className="shrink-0 bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-teal-600" />
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
                        text-left p-3 rounded-xl border text-sm font-bold transition-all
                        ${isAsked
                          ? 'bg-slate-50 border-slate-100 text-slate-400 line-through'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 hover:shadow-sm'}
                      `}
                    >
                      <span className="block text-xs text-slate-400 font-normal mb-0.5">{option.topic}</span>
                      {option.question}
                    </button>
                  );
                })}
              </div>

              {/* Progress Button */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                <button onClick={() => setStage(SOAPStage.OBJECTIVE)} className="btn-game btn-primary px-8 py-3 rounded-xl font-bold w-full sm:w-auto">
                  问诊结束，开始体格检查 (O)
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
                  const isLocked = item.equip && !hasEquip(item.equip);

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

              {hasEquip('cbc') && currentCase?.cbc ? (
                <LabTable title="CBC 血常规" data={currentCase.cbc} />
              ) : (
                <LockedData label="CBC 数据未解锁" equipKey="cbc" />
              )}

              {hasEquip('chem') && currentCase?.chem ? (
                <div className="mt-4">
                  <LabTable title="Biochemistry 生化" data={currentCase.chem} />
                </div>
              ) : (
                <LockedData label="生化数据未解锁" equipKey="chem" />
              )}

              {hasEquip('bloodGas') ? (
                currentCase?.bloodGas ? (
                  <div className="mt-4">
                    <LabTable title="Blood Gas 血气分析" data={currentCase.bloodGas} />
                  </div>
                ) : null // Case might not have blood gas data generated if not severe
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
                  X-RAY REPORT: {currentCase?.imaging?.xrayDescription || "未见明显异常 (NAD)"}
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