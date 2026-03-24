'use client'

import { useEffect, useState } from 'react'
import { FiX, FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import { useLanguage } from '@/context/LanguageContext'
import RobotCharacter, { RobotState } from './RobotCharacter'

interface TourStep {
    id: string
    targetSelector: string
    robotPosition: { x: number; y: number }
    message: string
    highlightPadding?: number
}

interface RobotTourGuideProps {
    onComplete: () => void
    onSkip: () => void
}

export default function RobotTourGuide({ onComplete, onSkip }: RobotTourGuideProps) {
    const { t, locale } = useLanguage()
    const [currentStep, setCurrentStep] = useState(0)
    const [highlightedElement, setHighlightedElement] = useState<DOMRect | null>(null)
    const [robotPos, setRobotPos] = useState({ x: 50, y: 50 })
    const [robotState, setRobotState] = useState<RobotState>('neutral')

    // Tour steps for job seekers
    const tourSteps: TourStep[] = [
        {
            id: 'welcome',
            targetSelector: '',
            robotPosition: { x: 50, y: 50 },
            message: t('tour.welcome')
        },
        {
            id: 'cv',
            targetSelector: 'a[href="/dashboard/cv"]',
            robotPosition: { x: 40, y: 40 },
            message: t('tour.cv_step')
        },
        {
            id: 'jobs',
            targetSelector: 'a[href="/dashboard/jobs"]',
            robotPosition: { x: 40, y: 50 },
            message: t('tour.jobs_step')
        },
        {
            id: 'notifications',
            targetSelector: 'a[href="/dashboard/notifications"]',
            robotPosition: { x: 60, y: 25 },
            message: t('tour.notifications_step')
        }
    ]

    const currentTourStep = tourSteps[currentStep]

    useEffect(() => {
        setRobotState('thinking')

        if (currentTourStep.targetSelector) {
            const timer = setTimeout(() => {
                const element = document.querySelector(currentTourStep.targetSelector)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    setHighlightedElement(rect)
                    setRobotPos(currentTourStep.robotPosition)
                    setRobotState('pointing')
                }
            }, 500)
            return () => clearTimeout(timer)
        } else {
            setHighlightedElement(null)
            setRobotPos(currentTourStep.robotPosition)
            setRobotState('happy')
        }
    }, [currentStep])

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            onComplete()
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    return (
        <>
            {/* Dark Overlay with Spotlight */}
            <div className="fixed inset-0 z-[100] pointer-events-none">
                <div className="absolute inset-0 bg-black/80 transition-opacity duration-700" />

                {highlightedElement && (
                    <div
                        className="absolute transition-all duration-700 ease-in-out pointer-events-auto shadow-[0_0_0_9999px_rgba(0,0,0,0.8),0_0_60px_20px_rgba(99,102,241,0.3)] rounded-2xl border-2 border-indigo-400/50"
                        style={{
                            left: highlightedElement.left - 12,
                            top: highlightedElement.top - 12,
                            width: highlightedElement.width + 24,
                            height: highlightedElement.height + 24,
                        }}
                    >
                        <div className="absolute inset-0 animate-pulse border-2 border-indigo-400 rounded-2xl opacity-50" />
                    </div>
                )}
            </div>

            {/* Moving Robot and Info Bubble Container */}
            <div
                className="fixed z-[101] transition-all duration-1000 ease-in-out flex items-center gap-8 pointer-events-none"
                style={{
                    left: `${robotPos.x}%`,
                    top: `${robotPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    flexDirection: locale === 'ar' ? 'row-reverse' : 'row'
                }}
            >
                {/* Robot Character */}
                <div className="flex-shrink-0">
                    <RobotCharacter size="lg" state={robotState} />
                </div>

                {/* Speech Bubble */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 max-w-sm pointer-events-auto border-4 border-indigo-500 relative animate-in fade-in zoom-in duration-300">
                    <div className="relative">
                        <p className="text-base text-slate-800 leading-relaxed font-bold">
                            {currentTourStep.message}
                        </p>

                        {/* Speech bubble tail */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-0 h-0"
                            style={{
                                [locale === 'ar' ? 'right' : 'left']: locale === 'ar' ? '-28px' : '-44px',
                                borderTop: '15px solid transparent',
                                borderBottom: '15px solid transparent',
                                [locale === 'ar' ? 'borderRight' : 'borderLeft']: locale === 'ar' ? 'none' : '20px solid #6366f1',
                                [locale === 'ar' ? 'borderLeft' : 'borderRight']: locale === 'ar' ? '20px solid #6366f1' : 'none'
                            }}
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-slate-100">
                        <button
                            onClick={onSkip}
                            className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                        >
                            {t('tour.skip')}
                        </button>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-400">
                                {currentStep + 1} / {tourSteps.length}
                            </span>

                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentStep === 0}
                                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition shadow-sm"
                                >
                                    <FiChevronLeft className={`w-5 h-5 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition shadow-lg shadow-indigo-200"
                                >
                                    {currentStep === tourSteps.length - 1 ? (
                                        <FiX className="w-5 h-5" />
                                    ) : (
                                        <FiChevronRight className={`w-5 h-5 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-custom {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                }
            `}</style>
        </>
    )
}
