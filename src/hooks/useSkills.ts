import { useState, useEffect } from 'react';
import { skillService } from '../services/skillService';
import { Skill, CreateSkillDto, UpdateSkillDto } from '../types';

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    const data = await skillService.getAll();
    setSkills(data);
    setLoading(false);
  };

  const createSkill = async (data: CreateSkillDto) => {
    const newSkill = await skillService.create(data);
    setSkills([...skills, newSkill]);
    return newSkill;
  };

  const updateSkill = async (id: string, data: UpdateSkillDto) => {
    const updated = await skillService.update(id, data);
    setSkills(skills.map((skill) => (skill.id === id ? updated : skill)));
    return updated;
  };

  const deleteSkill = async (id: string) => {
    await skillService.delete(id);
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  return {
    skills,
    loading,
    error,
    refetch: fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  };
};


