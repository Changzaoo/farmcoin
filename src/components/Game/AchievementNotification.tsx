import { memo, useEffect, useState } from 'react';
import { Achievement } from '../../features/achievements/achievements';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementNotification = memo<AchievementNotificationProps>(({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animação de entrada
    setTimeout(() => setIsVisible(true), 100);

    // Auto-fechar após 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Esperar animação de saída
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-20 right-4 z-50 max-w-sm
        transform transition-all duration-300
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 p-1 rounded-lg shadow-2xl">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-start gap-3">
            {/* Ícone */}
            <div className="text-5xl animate-bounce">
              {achievement.icon}
            </div>

            {/* Conteúdo */}
            <div className="flex-1">
              <h3 className="font-black text-lg text-gray-900 mb-1">
                🏆 Conquista Desbloqueada!
              </h3>
              <p className="font-bold text-md text-gray-800 mb-1">
                {achievement.name}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {achievement.description}
              </p>

              {/* Recompensas */}
              <div className="flex flex-wrap gap-2">
                {achievement.reward.coins && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                    💰 +{achievement.reward.coins}
                  </span>
                )}
                {achievement.reward.multiplier && achievement.reward.multiplier > 1 && (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                    ⚡ x{achievement.reward.multiplier}
                  </span>
                )}
                {achievement.reward.prestigePoints && (
                  <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                    ⭐ +{achievement.reward.prestigePoints}
                  </span>
                )}
              </div>
            </div>

            {/* Botão fechar */}
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar notificação"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

AchievementNotification.displayName = 'AchievementNotification';

export default AchievementNotification;
