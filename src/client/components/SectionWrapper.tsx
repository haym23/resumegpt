import React, { PropsWithChildren } from 'react';

import '../styles/Resume.css';

interface SectionWrapperProps extends PropsWithChildren<{
  title: string;
}> {
  title: string;
}

export const SectionWrapper = ({ children, title }: SectionWrapperProps) => (
  <>
    <div className="text-2xl font-bold mt-1">{title}</div>
    <hr className="border-solid border-1" />

    <div className="mt-half">{children}</div>
  </>
);