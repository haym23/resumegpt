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
      <div className="text-4xl font-bold">{props.firstName} {props.lastName}</div>

      <h2>contactInfo.title</h2>

      <a href={`mailto:${props.email}`}>{props.email}</a>

      {true && (
        <>
          <span className="mx-1">•</span>
          <a href="{config.contactInfo.firstLink}">{cleanLink("config.contactInfo.firstLink")}</a>
        </>
      )}

      {true && (
        <>
          <span className="mx-1">•</span>
          <a href={"config.contactInfo.secondLink"}>{cleanLink("config.contactInfo.secondLink")}</a>
        </>
      )}
    </div>
  );
};