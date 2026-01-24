import React, { useState } from 'react';
import { GameState } from './types';
import { getRandomQuestions, ExamQuestion } from './data/examQuestions';
import { AcademicCapIcon, ChevronRightIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface AcademyProps {
    gameState: GameState;
    updateState: (updates: Partial<GameState>) => void;
}



const Academy: React.FC<AcademyProps> = ({ gameState, updateState }) => {
    // 筛选条件
    const [selectedSubject, setSelectedSubject] = useState<string>('基础');
    const [questionCount, setQuestionCount] = useState<number>(10);

    // 考试状态
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Map<string, number | number[]>>(new Map());
    const [selectedAnswer, setSelectedAnswer] = useState<number | number[] | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [currentResult, setCurrentResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [examStarted, setExamStarted] = useState(false);
    const [examCompleted, setExamCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);

    // 执业兽医资格证考试四个科目
    const subjects = [
        { value: '基础', label: '科目一：基础兽医学', icon: '🔬' },
        { value: '预防', label: '科目二：预防兽医学', icon: '💉' },
        { value: '临床', label: '科目三：临床兽医学', icon: '🏥' },
        { value: '综合', label: '科目四：综合应用', icon: '📋' }
    ];



    const handleStartExam = async () => {
        if (gameState.energy < 20) {
            alert('精力不足！无法开始考试。请休息。');
            return;
        }

        setLoading(true);
        setExamStarted(false);
        setExamCompleted(false);
        setScore(0);

        try {
            // 从本地数据随机抽取题目
            const fetchedQuestions = getRandomQuestions(questionCount, selectedSubject);

            if (fetchedQuestions.length === 0) {
                alert('没有找到符合条件的题目，请调整筛选条件。');
                setLoading(false);
                return;
            }

            setQuestions(fetchedQuestions);
            setCurrentQuestionIndex(0);
            setUserAnswers(new Map());
            setSelectedAnswer(null);
            setShowResult(false);
            setExamStarted(true);
            setStartTime(Date.now());

            // 消耗精力
            updateState({ energy: gameState.energy - 20 });
        } catch (error) {
            console.error(error);
            alert('加载题目失败，请检查网络或稍后重试。');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAnswer = (optionIndex: number) => {
        if (showResult) return; // 已提交，不能再选择

        const currentQuestion = questions[currentQuestionIndex];

        if (currentQuestion.question_type === 'multiple') {
            // 多选题：切换选中状态
            const currentSelections = Array.isArray(selectedAnswer) ? selectedAnswer : [];
            if (currentSelections.includes(optionIndex)) {
                setSelectedAnswer(currentSelections.filter(i => i !== optionIndex));
            } else {
                setSelectedAnswer([...currentSelections, optionIndex]);
            }
        } else {
            // 单选题：直接设置
            setSelectedAnswer(optionIndex);
        }
    };

    const handleSubmitAnswer = async () => {
        if (selectedAnswer === null || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)) {
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];

        // 本地验证答案
        const correctAnswer = currentQuestion.correct_answer;
        let isCorrect = false;

        if (Array.isArray(correctAnswer)) {
            // 多选题：比较数组
            const userAnswerArray = Array.isArray(selectedAnswer) ? selectedAnswer.sort() : [];
            const correctAnswerArray = correctAnswer.sort();
            isCorrect = JSON.stringify(userAnswerArray) === JSON.stringify(correctAnswerArray);
        } else {
            // 单选题：直接比较
            isCorrect = selectedAnswer === correctAnswer;
        }

        const result = {
            isCorrect,
            explanation: currentQuestion.explanation,
            correctAnswer: currentQuestion.correct_answer
        };

        setCurrentResult(result);
        setShowResult(true);

        if (result.isCorrect) {
            setScore(s => s + 1);
        }

        // 记录答案
        const newAnswers = new Map(userAnswers);
        newAnswers.set(currentQuestion.id, selectedAnswer);
        setUserAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setSelectedAnswer(null);
            setShowResult(false);
            setCurrentResult(null);
            setStartTime(Date.now());
        } else {
            finishExam();
        }
    };

    const finishExam = () => {
        setExamCompleted(true);

        // 奖励
        const xpReward = score * 50;
        const reputationReward = score * 10;

        updateState({
            experience: gameState.experience + xpReward,
            reputation: gameState.reputation + reputationReward
        });
    };

    const resetExam = () => {
        setExamStarted(false);
        setExamCompleted(false);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setUserAnswers(new Map());
        setSelectedAnswer(null);
        setShowResult(false);
        setCurrentResult(null);
        setScore(0);
    };

    const currentQuestion = examStarted && questions.length > 0 ? questions[currentQuestionIndex] : null;

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8">
            <div className="flex flex-col gap-6 min-h-full max-w-4xl mx-auto">

                {/* 选择界面 */}
                {!examStarted && !loading && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                                <AcademicCapIcon className="w-8 h-8 text-blue-600" />
                                执业兽医资格证考试 - 真题练习
                            </h2>
                            <p className="text-slate-500 mt-2">
                                真题题库系统，包含单选题、多选题和共用题干题
                            </p>
                        </div>

                        {/* 筛选条件 */}
                        <div className="space-y-6">
                            {/* 科目选择 - 选项卡样式 */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">选择考试科目</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {subjects.map(s => (
                                        <button
                                            key={s.value}
                                            onClick={() => setSelectedSubject(s.value)}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${selectedSubject === s.value
                                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{s.icon}</span>
                                                <div>
                                                    <div className={`font-bold text-sm ${selectedSubject === s.value ? 'text-blue-700' : 'text-slate-700'
                                                        }`}>
                                                        {s.label}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>



                            {/* 题目数量 */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">题目数量</label>
                                <div className="flex gap-2">
                                    {[5, 10, 20].map(count => (
                                        <button
                                            key={count}
                                            onClick={() => setQuestionCount(count)}
                                            className={`flex-1 p-3 rounded-xl border-2 transition-all ${questionCount === count
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            {count} 题
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleStartExam}
                                disabled={gameState.energy < 20}
                                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {gameState.energy < 20 ? '精力不足' : '开始考试 (-20 精力)'}
                            </button>
                        </div>
                    </div>
                )}

                {/* 加载中 */}
                {loading && (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl p-8 border border-slate-100 min-h-[50vh]">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                        <h3 className="text-xl font-bold text-slate-700">正在加载题目...</h3>
                        <p className="text-slate-500 mt-2">请稍候</p>
                    </div>
                )}

                {/* 答题界面 */}
                {examStarted && !examCompleted && currentQuestion && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                        {/* 进度 */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                问题 {currentQuestionIndex + 1} / {questions.length}
                            </span>
                            <span className="text-sm text-slate-500">
                                {currentQuestion.question_type === 'multiple' ? '多选题' : '单选题'} | {currentQuestion.subject}
                            </span>
                        </div>

                        {/* 题干 */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 leading-relaxed mb-2">
                                {currentQuestion.stem}
                            </h3>
                            {currentQuestion.exam_year && (
                                <span className="text-xs text-slate-400">({currentQuestion.exam_year}年真题)</span>
                            )}
                        </div>

                        {/* 选项 */}
                        <div className="space-y-3 mb-6">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = Array.isArray(selectedAnswer)
                                    ? selectedAnswer.includes(idx)
                                    : selectedAnswer === idx;

                                let btnClass = 'border-slate-200 hover:bg-slate-50';

                                if (showResult && currentResult) {
                                    const correctAnswers = Array.isArray(currentQuestion.correct_answer)
                                        ? currentQuestion.correct_answer
                                        : [currentQuestion.correct_answer];

                                    if (correctAnswers.includes(idx)) {
                                        btnClass = 'bg-green-50 border-green-500 text-green-700';
                                    } else if (isSelected) {
                                        btnClass = 'bg-red-50 border-red-400 text-red-700';
                                    } else {
                                        btnClass = 'opacity-50 border-slate-100';
                                    }
                                } else if (isSelected) {
                                    btnClass = 'border-blue-500 bg-blue-50';
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectAnswer(idx)}
                                        disabled={showResult}
                                        className={`w-full text-left p-4 border-2 rounded-xl transition-all ${btnClass}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 mt-0.5 ${currentQuestion.question_type === 'multiple' ? 'rounded-md' : ''
                                                }`}>
                                                {isSelected && !showResult && (
                                                    <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                                                )}
                                                {!isSelected && !showResult && String.fromCharCode(65 + idx)}
                                                {showResult && currentResult && (
                                                    Array.isArray(currentQuestion.correct_answer)
                                                        ? currentQuestion.correct_answer.includes(idx) ? <CheckCircleIcon className="w-5 h-5 text-green-600" /> : String.fromCharCode(65 + idx)
                                                        : currentQuestion.correct_answer === idx ? <CheckCircleIcon className="w-5 h-5 text-green-600" /> : String.fromCharCode(65 + idx)
                                                )}
                                            </div>
                                            <span className="flex-1">{option}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* 多选题提示 */}
                        {currentQuestion.question_type === 'multiple' && !showResult && (
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-6 text-sm text-amber-800">
                                <span className="font-bold">提示：</span> 本题为多选题，请选择所有正确答案。
                            </div>
                        )}

                        {/* 解析 */}
                        {showResult && currentResult && (
                            <div className={`p-4 rounded-xl border mb-6 ${currentResult.isCorrect
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                                }`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {currentResult.isCorrect ? (
                                        <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                    ) : (
                                        <XCircleIcon className="w-6 h-6 text-red-600" />
                                    )}
                                    <h4 className="font-bold text-sm">
                                        {currentResult.isCorrect ? '回答正确！' : '回答错误'}
                                    </h4>
                                </div>
                                <p className="text-sm leading-relaxed">{currentResult.explanation}</p>
                            </div>
                        )}

                        {/* 操作按钮 */}
                        <div className="flex gap-4">
                            {!showResult ? (
                                <button
                                    onClick={handleSubmitAnswer}
                                    disabled={selectedAnswer === null || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)}
                                    className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    提交答案
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextQuestion}
                                    className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    {currentQuestionIndex < questions.length - 1 ? (
                                        <>下一题 <ChevronRightIcon className="w-5 h-5" /></>
                                    ) : (
                                        '完成考试'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 完成界面 */}
                {examCompleted && (
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <div className="text-6xl mb-6">
                            {score === questions.length ? '🏆' : score >= questions.length * 0.6 ? '👏' : '📚'}
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">考试结束</h2>
                        <p className="text-slate-500 mb-8">
                            你答对了 <span className="text-blue-600 font-bold text-2xl">{score}</span> / {questions.length} 题
                            <br />
                            正确率: <span className="font-bold">{Math.round((score / questions.length) * 100)}%</span>
                        </p>

                        <div className="flex gap-4 mb-8 bg-slate-50 p-6 rounded-xl justify-center">
                            <div className="text-center px-6 border-r border-slate-200">
                                <div className="text-xs text-slate-400 uppercase">经验值</div>
                                <div className="font-bold text-purple-600 text-xl">+{score * 50} XP</div>
                            </div>
                            <div className="text-center px-6">
                                <div className="text-xs text-slate-400 uppercase">声望</div>
                                <div className="font-bold text-amber-500 text-xl">+{score * 10}</div>
                            </div>
                        </div>

                        <button
                            onClick={resetExam}
                            className="px-8 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            返回继续练习
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Academy;