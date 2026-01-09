import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: ViewType) => void;
}

interface Step {
    id: number;
    title: string;
    description: string;
    icon: string;
    action?: string;
    highlight?: ViewType;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onNavigate }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const steps: Step[] = [
        {
            id: 1,
            title: 'Welcome to ExportFlow! 🚀',
            description: 'Your AI-powered export quote management platform. Let\'s take a quick tour to help you get started.',
            icon: 'rocket_launch',
        },
        {
            id: 2,
            title: 'Smart Dashboard',
            description: 'Get a bird\'s eye view of your business. Track KPIs, monitor shipments, and see AI-powered insights at a glance.',
            icon: 'dashboard',
            highlight: 'dashboard',
        },
        {
            id: 3,
            title: 'AI Quote Builder',
            description: 'Create quotes in seconds! Simply type what you need in natural language, and our AI will generate professional quotes.',
            icon: 'auto_awesome',
            highlight: 'quotes',
        },
        {
            id: 4,
            title: 'Client Intelligence',
            description: 'Manage clients with AI-powered risk scoring, payment history tracking, and smart recommendations.',
            icon: 'groups',
            highlight: 'clients',
        },
        {
            id: 5,
            title: 'Smart Logistics',
            description: 'Track shipments in real-time, compare carrier rates, and get ETAs with container optimization.',
            icon: 'local_shipping',
            highlight: 'logistics',
        },
        {
            id: 6,
            title: 'Document Automation',
            description: 'Generate invoices, packing lists, and certificates automatically. AI ensures compliance.',
            icon: 'description',
            highlight: 'documents',
        },
        {
            id: 7,
            title: 'Command Palette (⌘K)',
            description: 'Press ⌘K (or Ctrl+K) anytime to quickly search, navigate, or take action. It\'s your productivity superpower!',
            icon: 'keyboard',
            action: 'Try ⌘K Now',
        },
        {
            id: 8,
            title: 'You\'re All Set! 🎉',
            description: 'Start by creating your first quote or exploring the dashboard. We\'re here to help you export smarter!',
            icon: 'celebration',
        },
    ];

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
        }
    }, [isOpen]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsAnimating(false);
            }, 150);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev - 1);
                setIsAnimating(false);
            }, 150);
        }
    };

    const handleComplete = () => {
        // Save to localStorage that onboarding is complete
        localStorage.setItem('exportflow_onboarding_complete', 'true');
        onClose();
    };

    const handleGoToFeature = () => {
        const step = steps[currentStep];
        if (step.highlight) {
            onNavigate(step.highlight);
            onClose();
        }
    };

    if (!isOpen) return null;

    const step = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-surface-dark rounded-3xl shadow-2xl overflow-hidden">
                {/* Progress Bar */}
                <div className="h-1 bg-gray-100 dark:bg-gray-800">
                    <div 
                        className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Skip Button */}
                <button
                    onClick={handleComplete}
                    className="absolute top-4 right-4 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    Skip Tour
                </button>

                {/* Content */}
                <div className={`p-8 pt-12 text-center transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
                        <span className="material-icons-outlined text-4xl text-white">
                            {step.icon}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                        {step.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                        {step.description}
                    </p>

                    {/* Feature Preview Image/Animation Placeholder */}
                    {step.highlight && (
                        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <span className="material-icons-outlined text-primary">touch_app</span>
                                <span>Click "Go There" to explore this feature</span>
                            </div>
                        </div>
                    )}

                    {/* Step Dots */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {steps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === currentStep
                                        ? 'w-6 bg-primary'
                                        : index < currentStep
                                            ? 'bg-primary/50'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="px-8 pb-8 flex items-center gap-3">
                    {currentStep > 0 && (
                        <button
                            onClick={handlePrev}
                            className="flex items-center gap-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <span className="material-icons-outlined text-sm">arrow_back</span>
                            Back
                        </button>
                    )}

                    <div className="flex-1" />

                    {step.highlight && (
                        <button
                            onClick={handleGoToFeature}
                            className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <span className="material-icons-outlined text-sm">open_in_new</span>
                            Go There
                        </button>
                    )}

                    {currentStep < steps.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            Next
                            <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all font-medium"
                        >
                            Get Started
                            <span className="material-icons-outlined text-sm">celebration</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
