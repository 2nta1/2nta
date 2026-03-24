'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type RobotState = 'neutral' | 'happy' | 'talking' | 'pointing' | 'thinking' | 'waving'

interface RobotCharacterProps {
    state?: RobotState
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    style?: React.CSSProperties
}

const RobotCharacter: React.FC<RobotCharacterProps> = ({
    state = 'neutral',
    size = 'md',
    className = '',
    style = {}
}) => {
    // Size mapping
    const dimensions = {
        sm: { width: 80, height: 90 },
        md: { width: 120, height: 140 },
        lg: { width: 180, height: 210 },
        xl: { width: 250, height: 280 }
    }

    const { width, height } = dimensions[size]

    return (
        <div
            className={`robot-character-container ${className}`}
            style={{
                width,
                height,
                ...style
            }}
        >
            <motion.div
                className="relative w-full h-full"
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Visual Robot SVG */}
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 180 220"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Shadow under robot (dynamic) */}
                    <motion.ellipse
                        cx="90" cy="205" rx="30" ry="6"
                        fill="rgba(0,0,0,0.15)"
                        animate={{
                            rx: [30, 20, 30],
                            opacity: [0.15, 0.05, 0.15]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Antenna */}
                    <g>
                        <motion.line
                            x1="90" y1="15" x2="90" y2="40"
                            stroke="url(#robot_grad_main)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            animate={state === 'thinking' ? { strokeWidth: [4, 6, 4], stroke: ["#4f46e5", "#22d3ee", "#4f46e5"] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                        <motion.circle
                            cx="90" cy="12" r="6"
                            fill="#22d3ee"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                        <circle cx="90" cy="12" r="3" fill="white" />
                    </g>

                    {/* Head */}
                    <path
                        d="M 45 65 Q 45 35 90 35 Q 135 35 135 65 L 135 85 Q 135 105 90 105 Q 45 105 45 85 Z"
                        fill="url(#robot_grad_head)"
                        stroke="#4f46e5"
                        strokeWidth="2"
                    />

                    {/* Face Plate */}
                    <rect x="55" y="55" width="70" height="35" rx="15" fill="#0f172a" />

                    {/* Digital Eyes */}
                    <g>
                        {/* Left Eye */}
                        <motion.rect
                            x="68" y="65" width="12" height="12" rx="3"
                            fill="#22d3ee"
                            filter="url(#eye_glow)"
                            animate={state === 'happy' ? { scaleY: [1, 0.5, 1], y: [0, -2, 0] } : (state === 'thinking' ? { opacity: [1, 0.5, 1] } : { scaleY: [1, 1, 0, 1, 1] })}
                            transition={{
                                duration: state === 'happy' ? 0.3 : (state === 'thinking' ? 1.5 : 4),
                                repeat: Infinity,
                                times: [0, 0.1, 0.12, 0.15, 1]
                            }}
                        />
                        {/* Right Eye */}
                        <motion.rect
                            x="100" y="65" width="12" height="12" rx="3"
                            fill="#22d3ee"
                            filter="url(#eye_glow)"
                            animate={state === 'happy' ? { scaleY: [1, 0.5, 1], y: [0, -2, 0] } : (state === 'thinking' ? { opacity: [1, 0.5, 1] } : { scaleY: [1, 1, 0, 1, 1] })}
                            transition={{
                                duration: state === 'happy' ? 0.3 : (state === 'thinking' ? 1.5 : 4),
                                repeat: Infinity,
                                times: [0, 0.1, 0.12, 0.15, 1]
                            }}
                        />
                    </g>

                    {/* Mouth / Voice Wave (for 'talking' state) */}
                    {state === 'talking' ? (
                        <motion.path
                            d="M 75 80 Q 90 75 105 80"
                            stroke="#22d3ee"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                            animate={{ d: ["M 75 80 Q 90 75 105 80", "M 75 80 Q 90 85 105 80", "M 75 80 Q 90 75 105 80"] }}
                            transition={{ duration: 0.2, repeat: Infinity }}
                        />
                    ) : (
                        <path
                            d={state === 'happy' ? "M 75 78 Q 90 85 105 78" : "M 80 82 L 100 82"}
                            stroke="#22d3ee"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                            opacity="0.6"
                        />
                    )}

                    {/* Cheek Blushes (Cute factor) */}
                    <circle cx="65" cy="85" r="3" fill="#f472b6" opacity="0.4" />
                    <circle cx="115" cy="85" r="3" fill="#f472b6" opacity="0.4" />

                    {/* Body */}
                    <path
                        d="M 50 110 Q 50 105 90 105 Q 130 105 130 110 L 140 160 Q 140 175 90 175 Q 40 175 40 160 Z"
                        fill="url(#robot_grad_body)"
                        stroke="#4f46e5"
                        strokeWidth="2"
                    />

                    {/* Interior Core */}
                    <circle cx="90" cy="140" r="15" fill="rgba(34, 211, 238, 0.1)" />
                    <motion.circle
                        cx="90" cy="140" r="8"
                        fill="url(#robot_grad_core)"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Left Arm */}
                    <motion.g
                        animate={state === 'waving' ? { rotate: [0, -30, 0], transformOrigin: "35px 120px" } : {}}
                        transition={{ duration: 0.5, repeat: state === 'waving' ? Infinity : 0 }}
                    >
                        <rect x="25" y="115" width="15" height="40" rx="7" fill="url(#robot_grad_arm)" stroke="#4f46e5" strokeWidth="1.5" />
                    </motion.g>

                    {/* Right Arm */}
                    <motion.g
                        animate={state === 'pointing' ? { rotate: [0, 40, 0], transformOrigin: "145px 120px" } : {}}
                        transition={{ duration: 1, repeat: state === 'pointing' ? Infinity : 0 }}
                    >
                        <rect x="140" y="115" width="15" height="40" rx="7" fill="url(#robot_grad_arm)" stroke="#4f46e5" strokeWidth="1.5" />
                        {state === 'pointing' && (
                            <motion.g
                                animate={{ x: [0, 10, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <path d="M 155 135 L 180 130" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
                                <circle cx="182" cy="129" r="4" fill="#22d3ee" />
                            </motion.g>
                        )}
                    </motion.g>

                    {/* Lighting / Highlights */}
                    <path d="M 60 45 Q 90 40 120 45" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                    <path d="M 125 120 L 130 150" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.1" />

                    {/* Defs */}
                    <defs>
                        <filter id="eye_glow">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="robot_grad_head" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                        <linearGradient id="robot_grad_body" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#4338ca" />
                        </linearGradient>
                        <linearGradient id="robot_grad_core" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#0891b2" />
                        </linearGradient>
                        <linearGradient id="robot_grad_arm" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>
                        <linearGradient id="robot_grad_main" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>

            <style jsx>{`
                .robot-character-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    perspective: 1000px;
                }
            `}</style>
        </div>
    )
}

export default RobotCharacter
