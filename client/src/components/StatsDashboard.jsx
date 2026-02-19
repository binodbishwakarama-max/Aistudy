import { useGamification } from '../context/GamificationContext';

const StatsDashboard = () => {
    const { gameState } = useGamification();

    const [stats, setStats] = useState(() => {
        // Load stats from localStorage
        const quizStats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
        const favorites = JSON.parse(localStorage.getItem('flashcard_favorites') || '[]');
        const difficulty = JSON.parse(localStorage.getItem('flashcard_difficulty') || '{}');

        const hardCards = Object.values(difficulty).filter(d => d === 'hard').length;
        const mediumCards = Object.values(difficulty).filter(d => d === 'medium').length;
        const easyCards = Object.values(difficulty).filter(d => d === 'easy').length;

        return {
            totalQuestions: quizStats.totalQuestions || 0,
            correctAnswers: quizStats.correctAnswers || 0,
            totalTimeSpent: quizStats.totalTimeSpent || 0,
            cardsReviewed: hardCards + mediumCards + easyCards,
            favorites: favorites.length,
            hardCards,
            mediumCards,
            easyCards
        };
    });

    const accuracy = stats.totalQuestions > 0
        ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
        : 0;

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white drop-shadow-md">Study Statistics</h2>
                    <p className="text-white/80 font-medium">Your journey to mastery</p>
                </div>

                {/* Gamification Badge */}
                <div className="flex gap-4">
                    <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 animate-float">
                        <div className="bg-yellow-500/20 p-2 rounded-full">
                            <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div>
                            <div className="text-sm text-white/70 font-medium uppercase tracking-wider">Level {gameState.level}</div>
                            <div className="text-xl font-bold text-white">{gameState.xp} XP</div>
                        </div>
                    </div>

                    <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
                        <div className="bg-orange-500/20 p-2 rounded-full">
                            <Flame className="w-6 h-6 text-orange-400 fill-orange-400" />
                        </div>
                        <div>
                            <div className="text-sm text-white/70 font-medium uppercase tracking-wider">Daily Streak</div>
                            <div className="text-xl font-bold text-white">{gameState.streak} Days</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    icon={Target}
                    label="Quiz Accuracy"
                    value={`${accuracy}%`}
                    color="from-indigo-500 to-blue-500"
                    subtitle={`${stats.correctAnswers} / ${stats.totalQuestions} correct`}
                />
                <StatCard
                    icon={Clock}
                    label="Time Studied"
                    value={formatTime(stats.totalTimeSpent)}
                    color="from-purple-500 to-pink-500"
                    subtitle={`${stats.totalQuestions} questions answered`}
                />
                <StatCard
                    icon={Brain}
                    label="Cards Reviewed"
                    value={stats.cardsReviewed}
                    color="from-blue-500 to-cyan-500"
                    subtitle="Flashcards practiced"
                />
                <StatCard
                    icon={Star}
                    label="Favorites"
                    value={stats.favorites}
                    color="from-yellow-400 to-orange-500"
                    subtitle="Bookmarked cards"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Mastery Level"
                    value={stats.easyCards > 10 ? "Expert" : "Novice"}
                    color="from-green-500 to-emerald-500"
                    subtitle={`${stats.easyCards} concepts mastered`}
                />
                <StatCard
                    icon={Trophy}
                    label="Focus Points"
                    value={(stats.cardsReviewed * 10) + (stats.correctAnswers * 50)}
                    color="from-red-500 to-rose-500"
                    subtitle="Based on activity"
                />
            </div>

            {/* Difficulty Breakdown */}
            {stats.cardsReviewed > 0 && (
                <div className="glass-card p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-indigo-600" />
                        Knowledge Gap Analysis
                    </h3>
                    <div className="space-y-6">
                        <DifficultyBar label="Mastered (Easy)" value={stats.easyCards} total={stats.cardsReviewed} color="bg-green-500" />
                        <DifficultyBar label="Learning (Medium)" value={stats.mediumCards} total={stats.cardsReviewed} color="bg-yellow-500" />
                        <DifficultyBar label="Struggling (Hard)" value={stats.hardCards} total={stats.cardsReviewed} color="bg-red-500" />
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <div className="glass-card p-6 relative overflow-hidden group">
        <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br ${color} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`} />

        <div className="flex items-start justify-between mb-4 relative z-10">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>

        <div className="relative z-10">
            <div className="text-4xl font-bold text-gray-800 mb-1 tracking-tight">{value}</div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">{label}</div>
            {subtitle && <div className="text-xs text-indigo-600 font-medium mt-2 bg-indigo-50 inline-block px-2 py-1 rounded-lg">{subtitle}</div>}
        </div>
    </div>
);

const DifficultyBar = ({ label, value, total, color }) => (
    <div>
        <div className="flex justify-between text-sm mb-2 font-medium">
            <span className="text-gray-700">{label}</span>
            <span className="text-gray-900">{Math.round((value / total) * 100)}% ({value})</span>
        </div>
        <div className="w-full bg-gray-200/50 rounded-full h-3 backdrop-blur-sm overflow-hidden border border-white/50">
            <div
                className={`${color} h-3 rounded-full transition-all duration-1000 ease-out shadow-sm`}
                style={{ width: `${(value / total) * 100}%` }}
            />
        </div>
    </div>
);

export default StatsDashboard;
