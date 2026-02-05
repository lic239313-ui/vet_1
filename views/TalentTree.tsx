import React from 'react';
import { GameState, TalentNode, TalentBranch, INITIAL_TALENTS } from '../types';
import {
    BeakerIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    LockClosedIcon,
    CheckCircleIcon,
    SparklesIcon
} from '@heroicons/react/24/solid';

interface TalentTreeProps {
    gameState: GameState;
    updateState: (updates: Partial<GameState>) => void;
    onClose: () => void;
}

const BRANCH_CONFIG: Record<TalentBranch, { name: string; icon: React.ElementType; color: string; gradient: string }> = {
    clinical: {
        name: '临床专精',
        icon: BeakerIcon,
        color: 'text-red-500',
        gradient: 'from-red-500 to-rose-600'
    },
    management: {
        name: '经营管理',
        icon: BriefcaseIcon,
        color: 'text-amber-500',
        gradient: 'from-amber-500 to-orange-600'
    },
    academic: {
        name: '学术研究',
        icon: AcademicCapIcon,
        color: 'text-blue-500',
        gradient: 'from-blue-500 to-indigo-600'
    }
};

const TalentTree: React.FC<TalentTreeProps> = ({ gameState, updateState, onClose }) => {
    // Safe fallbacks for old game saves
    const skillPoints = gameState.skillPoints ?? 0;
    const talents = gameState.talents ?? INITIAL_TALENTS;

    const canUnlock = (talent: TalentNode): boolean => {
        if (talent.unlocked) return false;
        if (skillPoints < talent.cost) return false;
        if (talent.prerequisite) {
            const prereq = talents.find(t => t.id === talent.prerequisite);
            if (!prereq?.unlocked) return false;
        }
        return true;
    };

    const unlockTalent = (talentId: string) => {
        const talent = talents.find(t => t.id === talentId);
        if (!talent || !canUnlock(talent)) return;

        const updatedTalents = talents.map(t =>
            t.id === talentId ? { ...t, unlocked: true } : t
        );

        updateState({
            skillPoints: skillPoints - talent.cost,
            talents: updatedTalents
        });
    };

    const getTalentsByBranch = (branch: TalentBranch) =>
        talents.filter(t => t.branch === branch).sort((a, b) => a.tier - b.tier);

    const renderTalentCard = (talent: TalentNode) => {
        const isUnlocked = talent.unlocked;
        const canUnlockNow = canUnlock(talent);
        const config = BRANCH_CONFIG[talent.branch];

        return (
            <div
                key={talent.id}
                className={`
          relative p-4 rounded-xl border-2 transition-all
          ${isUnlocked
                        ? `bg-gradient-to-br ${config.gradient} text-white border-transparent shadow-lg`
                        : canUnlockNow
                            ? 'bg-white border-slate-300 hover:border-cyan-400 hover:shadow-md cursor-pointer'
                            : 'bg-slate-100 border-slate-200 opacity-60'
                    }
        `}
                onClick={() => canUnlockNow && unlockTalent(talent.id)}
            >
                {/* Status Icon */}
                <div className="absolute -top-2 -right-2">
                    {isUnlocked ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                            <CheckCircleIcon className="w-4 h-4 text-white" />
                        </div>
                    ) : !canUnlockNow ? (
                        <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center">
                            <LockClosedIcon className="w-3 h-3 text-white" />
                        </div>
                    ) : null}
                </div>

                {/* Content */}
                <div className="flex items-start gap-3">
                    <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold
            ${isUnlocked ? 'bg-white/20' : 'bg-slate-200'}
          `}>
                        T{talent.tier}
                    </div>
                    <div className="flex-1">
                        <h4 className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-slate-800'}`}>
                            {talent.name}
                        </h4>
                        <p className={`text-xs mt-1 ${isUnlocked ? 'text-white/80' : 'text-slate-500'}`}>
                            {talent.description}
                        </p>

                        {!isUnlocked && (
                            <div className="mt-2 flex items-center gap-1 text-xs font-bold">
                                <SparklesIcon className="w-3 h-3 text-amber-500" />
                                <span className={canUnlockNow ? 'text-amber-600' : 'text-slate-400'}>
                                    {talent.cost} SP
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-extrabold flex items-center gap-2">
                                <SparklesIcon className="w-7 h-7 text-amber-400" />
                                技能树
                            </h2>
                            <p className="text-slate-300 text-sm mt-1">
                                选择你的专精方向，打造独特的职业路线
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-amber-400">{skillPoints}</div>
                            <div className="text-xs text-slate-400 uppercase">可用技能点</div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(['clinical', 'management', 'academic'] as TalentBranch[]).map(branch => {
                            const config = BRANCH_CONFIG[branch];
                            const branchTalents = getTalentsByBranch(branch);
                            const Icon = config.icon;

                            return (
                                <div key={branch} className="space-y-4">
                                    {/* Branch Header */}
                                    <div className={`flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r ${config.gradient} text-white`}>
                                        <Icon className="w-5 h-5" />
                                        <span className="font-bold">{config.name}</span>
                                        <span className="ml-auto text-xs opacity-80">
                                            {branchTalents.filter(t => t.unlocked).length}/{branchTalents.length}
                                        </span>
                                    </div>

                                    {/* Talents */}
                                    <div className="space-y-3">
                                        {branchTalents.map(renderTalentCard)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all cursor-pointer"
                    >
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TalentTree;
