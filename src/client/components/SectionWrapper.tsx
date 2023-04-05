import React, { PropsWithChildren } from 'react';

import '../styles/Resume.css';

interface SectionWrapperProps extends PropsWithChildren<{
  title: string;
}> {
  title: string;
}

export const SectionWrapper = ({ children, title }: SectionWrapperProps) => (
  <>
    <div className="sm:text-xl md:text-2xl lg:text-4xl font-bold mt-1">{title}</div>
    <hr className="border-solid border-1" />

    <div className="mt-[0.0825rem] sm:mt-half">{children}</div>
  </>
);