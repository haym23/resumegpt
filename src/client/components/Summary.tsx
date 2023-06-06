import React from 'react';
import { SectionWrapper } from './SectionWrapper';

interface SummaryProps {
  summary: string;
}

export const Summary = ({ summary }: SummaryProps) => {
  return (
    <SectionWrapper title="Summary">
      <div className="ml-1 leading-5">{summary}</div>
    </SectionWrapper>
  );
};