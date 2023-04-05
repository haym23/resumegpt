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
        <div className="leading-5 inline-block text-xs sm:text-sm md:text-base">
          <span className="text-2xs sm:text-sm mx-0.5 sm:mx-1">•</span>
          <span>{skill}</span>
        </div>
      ))}
    </SectionWrapper>
  );
};