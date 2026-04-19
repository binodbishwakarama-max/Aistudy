import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { fetchUserStats, updateUserStats } from '../services/api';

const GamificationContext = createContext();
const DEFAULT_GAME_STATE = {
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: null,
    achievements: []
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [gameState, setGameState] = useState(DEFAULT_GAME_STATE);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [isStatsLoaded, setIsStatsLoaded] = useState(false);

    // Load stats from server when user logs in
    useEffect(() => {
        if (!user) {
            setGameState(DEFAULT_GAME_STATE);
            setIsStatsLoaded(false);
            return;
        }

        let isMounted = true;
        fetchUserStats()
            .then((data) => {
                if (isMounted) {
                    setGameState({
                        xp: data.xp || 0,
                        level: data.level || 1,
                        streak: data.streak || 0,
                        lastStudyDate: data.lastStudyDate || null,
                        achievements: Array.isArray(data.achievements) ? data.achievements : []
                    });
                    setIsStatsLoaded(true);
                }
            })
            .catch((err) => {
                console.error("Failed to load user stats via API:", err);
            });

        return () => {
            isMounted = false;
        };
    }, [user]);

    // Save stats to server when gameState changes (and is fully loaded)
    useEffect(() => {
        if (!user || !isStatsLoaded) return;
        
        // Use a simple fire-and-forget logic
        updateUserStats(gameState).catch(console.error);
    }, [gameState, user, isStatsLoaded]);

    const getXpToNextLevel = (level) => {
        return level * 100 * 1.5; // Simple curve: 150, 300, 450...
    };

    const addXP = (amount) => {
        setGameState(prev => {
            let newXP = prev.xp + amount;
            let newLevel = prev.level;
            let leveledUp = false;

            const xpNeeded = getXpToNextLevel(newLevel);
            if (newXP >= xpNeeded) {
                newLevel++;
                newXP = newXP - xpNeeded;
                leveledUp = true;
            }

            if (leveledUp) {
                triggerLevelUpEffects();
            }

            return {
                ...prev,
                xp: newXP,
                level: newLevel
            };
        });
    };

    const triggerLevelUpEffects = () => {
        setShowLevelUp(true);
        confetti({
            particleCount: 200,
            spread: 160,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF4500']
        });

        // Auto hide modal after 3 seconds if we implement one
        setTimeout(() => setShowLevelUp(false), 3000);
    };

    const updateStreak = () => {
        const today = new Date().toISOString().split('T')[0];
        setGameState(prev => {
            if (prev.lastStudyDate === today) {
                return prev; // Already studied today
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split('T')[0];

            let newStreak = prev.streak;

            if (prev.lastStudyDate === yesterdayString) {
                newStreak += 1; // Continued streak
            } else {
                newStreak = 1; // Broken streak or first day
            }

            return {
                ...prev,
                streak: newStreak,
                lastStudyDate: today
            };
        });
    };

    const unlockAchievement = (id) => {
        setGameState(prev => {
            if (prev.achievements.includes(id)) return prev;

            // New achievement unlocked!
            confetti({ particleCount: 50, spread: 50 });
            return {
                ...prev,
                achievements: [...prev.achievements, id]
            };
        });
    };

    return (
        <GamificationContext.Provider value={{
            gameState,
            addXP,
            updateStreak,
            unlockAchievement,
            getXpToNextLevel,
            showLevelUp,
            setShowLevelUp
        }}>
            {children}
        </GamificationContext.Provider>
    );
};
