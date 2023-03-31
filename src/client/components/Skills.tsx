import React from 'react';
import { SectionWrapper } from './SectionWrapper';

import '../styles/Resume.css';

interface SkillsProps {
  skills: string[];
}

export const Skills = ({ skills }: SkillsProps) => {
  return (
    <SectionWrapper title="Skills">
      {skills.map((skill) => (
        <p className="inline-block">
          <span className="mx-1">•</span>
          <span>{skill}</span>
        </p>
      ))}
    </SectionWrapper>
  );
};