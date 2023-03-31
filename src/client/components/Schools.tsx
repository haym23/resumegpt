import React from 'react';
import { ISchoolPayload } from '../../shared/types';
import { SectionWrapper } from './SectionWrapper';

import '../styles/Resume.css';

interface SchoolsProps {
  schools: ISchoolPayload[];
}

export const Schools = ({ schools }: SchoolsProps) => {
  return (
    <SectionWrapper title="Schools">
      <ul className="ml-2">
        {schools.map((school, i) => (
          <li key={school.name} className={i % 2 ? `mt-1` : `mt-half`}>
            <div className="flex">
              <div className="text-xl">
                {school.name} - school.location
              </div>
              <span className="ml-auto text-muted">{school.startDate}</span>
            </div>
            <h4>
              {school.degree}, {school.major}
            </h4>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
};