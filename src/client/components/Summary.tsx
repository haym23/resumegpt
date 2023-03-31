import React from 'react';
import { SectionWrapper } from './SectionWrapper';

interface SummaryProps {
  summary: string;
}

export const Summary = ({ summary }: SummaryProps) => {
  return (
    <SectionWrapper title="Summary">
      <p>{summary}</p>
    </SectionWrapper>
  );
};