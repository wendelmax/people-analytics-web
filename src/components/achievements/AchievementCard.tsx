import React from 'react';
import { Achievement, AchievementType } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

interface AchievementCardProps {
  achievement: Achievement;
}

const getAchievementIcon = (type: AchievementType) => {
  switch (type) {
    case AchievementType.CERTIFICATION:
      return '🏆';
    case AchievementType.BADGE:
      return '🎖️';
    case AchievementType.MILESTONE:
      return '⭐';
    case AchievementType.AWARD:
      return '🏅';
    case AchievementType.SKILL_MASTERY:
      return '💎';
    default:
      return '✨';
  }
};

const getAchievementColor = (type: AchievementType) => {
  switch (type) {
    case AchievementType.CERTIFICATION:
      return 'bg-yellow-50 border-yellow-200';
    case AchievementType.BADGE:
      return 'bg-blue-50 border-blue-200';
    case AchievementType.MILESTONE:
      return 'bg-purple-50 border-purple-200';
    case AchievementType.AWARD:
      return 'bg-red-50 border-red-200';
    case AchievementType.SKILL_MASTERY:
      return 'bg-green-50 border-green-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <Card className={`${getAchievementColor(achievement.type)}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{achievement.icon || getAchievementIcon(achievement.type)}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
              <Badge variant="info" size="sm">
                {achievement.type.replace('_', ' ')}
              </Badge>
            </div>
            {achievement.description && (
              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              {achievement.issuer && (
                <span>
                  <strong>Emissor:</strong> {achievement.issuer}
                </span>
              )}
              <span>
                <strong>Conquistado em:</strong> {formatDate(achievement.earnedAt)}
              </span>
            </div>
            {achievement.certificateUrl && (
              <a
                href={achievement.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800"
              >
                Ver Certificado →
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

