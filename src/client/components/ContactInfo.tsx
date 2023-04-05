import React, { useCallback } from 'react';
import "../styles/Resume.css";

interface ContactInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  address: string
}

export const ContactInfo = (props: ContactInfoProps) => {
  const cleanLink = useCallback((link: string) => {
    return link.replace(/^https?:\/\//, '').replace(/^www\./, '');
  }, []);

  return (
    <div className="text-center">
      <div className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold">{props.firstName} {props.lastName}</div>

      <h2>contactInfo.title</h2>

      <div className="text-xs sm:text-sm md:text-base lg:text-lg">
        <a href={`mailto:${props.email}`}>{props.email}</a>
        {true && (
          <>
            <span className="text-2xs sm:text-sm mx-0.5 sm:mx-1">•</span>
            <a href="{config.contactInfo.firstLink}">{cleanLink("config.contactInfo.firstLink")}</a>
          </>
        )}

        {true && (
          <>
            <span className="text-2xs sm:text-sm mx-0.5 sm:mx-1">•</span>
            <a href={"config.contactInfo.secondLink"}>{cleanLink("config.contactInfo.secondLink")}</a>
          </>
        )}
      </div>
    </div>
  );
};