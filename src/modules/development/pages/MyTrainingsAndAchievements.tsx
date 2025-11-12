import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { useEmployeeDashboard } from '../../../hooks/useEmployeeDashboard';
import { TrainingProgressCard } from '../../../components/training/TrainingProgressCard';
import { AchievementCard } from '../../../components/achievements/AchievementCard';
import { Tabs } from '../../../components/common/Tabs';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Card } from '../../../components/common/Card';
import { TrainingStatus, AchievementType } from '../../../types';

export const MyTrainingsAndAchievements: React.FC = () => {
  const { data, loading, error } = useEmployeeDashboard();
  const [activeTab, setActiveTab] = useState<'trainings' | 'achievements'>('trainings');

  if (loading) {
    return (
      <ModuleLayout moduleId="development">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="development">
        <ErrorMessage message={error.message} />
      </ModuleLayout>
    );
  }

  const trainings = data?.trainings || [];
  const achievements = data?.achievements || [];

  const completedTrainings = trainings.filter((t) => t.status === TrainingStatus.COMPLETED);
  const inProgressTrainings = trainings.filter((t) => t.status === TrainingStatus.IN_PROGRESS);
  const enrolledTrainings = trainings.filter((t) => t.status === TrainingStatus.ENROLLED);

  const certifications = achievements.filter((a) => a.type === AchievementType.CERTIFICATION);
  const badges = achievements.filter((a) => a.type === AchievementType.BADGE);
  const awards = achievements.filter((a) => a.type === AchievementType.AWARD);

  return (
    <ModuleLayout moduleId="development">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Treinamentos e Conquistas</h1>
          <p className="text-gray-600">Visualize seus treinamentos e achievements</p>
        </div>

        <Tabs
          tabs={[
            {
              id: 'trainings',
              label: 'Treinamentos',
              content: (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{trainings.length}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                    </Card>
                    <Card>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {completedTrainings.length}
                        </p>
                        <p className="text-sm text-gray-600">Concluídos</p>
                      </div>
                    </Card>
                    <Card>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                          {inProgressTrainings.length}
                        </p>
                        <p className="text-sm text-gray-600">Em Progresso</p>
                      </div>
                    </Card>
                  </div>

                  {enrolledTrainings.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Inscritos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enrolledTrainings.map((training) => (
                          <TrainingProgressCard key={training.id} training={training} />
                        ))}
                      </div>
                    </div>
                  )}

                  {inProgressTrainings.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Em Progresso</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inProgressTrainings.map((training) => (
                          <TrainingProgressCard key={training.id} training={training} />
                        ))}
                      </div>
                    </div>
                  )}

                  {completedTrainings.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Concluídos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completedTrainings.map((training) => (
                          <TrainingProgressCard key={training.id} training={training} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
            {
              id: 'achievements',
              label: 'Conquistas',
              content: (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {certifications.length}
                        </p>
                        <p className="text-sm text-gray-600">Certificações</p>
                      </div>
                    </Card>
                    <Card>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-orange-600">{badges.length}</p>
                        <p className="text-sm text-gray-600">Badges</p>
                      </div>
                    </Card>
                    <Card>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">{awards.length}</p>
                        <p className="text-sm text-gray-600">Prêmios</p>
                      </div>
                    </Card>
                  </div>

                  {achievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements.map((achievement) => (
                        <AchievementCard key={achievement.id} achievement={achievement} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">🏆</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conquista encontrada</h3>
                      <p className="text-gray-500">Suas conquistas aparecerão aqui quando você completar treinamentos.</p>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </ModuleLayout>
  );
};

