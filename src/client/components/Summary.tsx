import React from 'react';
import { SectionWrapper } from './SectionWrapper';

interface SummaryProps {
  summary: string;
}

export const Summary = ({ summary }: SummaryProps) => {
  return (
    <SectionWrapper title="Summary">
      <div className="leading-5 text-xs sm:text-sm md:text-md lg:text-lg">{summary}</div>
    </SectionWrapper>
  );
};