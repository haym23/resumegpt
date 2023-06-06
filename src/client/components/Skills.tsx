import React from 'react';
import { SectionWrapper } from './SectionWrapper';

import '../styles/Resume.css';

interface SkillsProps {
  skills: string[];
}

export const Skills = ({ skills }: SkillsProps) => {
  return (
    <SectionWrapper title="Skills">
      <ul className="leading-5 grid grid-cols-3 gap-4">
      {skills.map((skill, index) => (
        <li key={index} className="flex items-center">
          <span className="h-1 w-1 rounded-full bg-black mr-2"></span>
          {skill}
        </li>
      ))}
      </ul>
    </SectionWrapper>
  );
};