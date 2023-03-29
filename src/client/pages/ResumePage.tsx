// @ts-ignore
import React from 'react';
import { match } from "react-router-dom";
import { useQuery } from "@wasp/queries";
import getResume from "@wasp/queries/getResume";
import getJobs from "@wasp/queries/getJobs";
import getSchools from "@wasp/queries/getSchools";
import { Resume, Job, School } from "@wasp/entities";
import Spinner from "../components/Spinner";
import '../styles/Resume.css';

export function ResumePage({ match }: { match: match<{ id: string }> }) {
  const id = match.params.id as string;

  const { data: resume, isLoading: isLoadingResume } = useQuery<{ id: string }, Resume>(getResume, { id });
  const { data: jobs } = useQuery<{ resumeId: string }, Job[]>(getJobs, { resumeId: resume?.id || '' });
  const { data: schools } = useQuery<{ resumeId: string }, School[]>(getSchools, { resumeId: resume?.id || '' });

  function HeaderBar() {
    return (
      <div className="personalInfoHeader">
        <div className="name">{resume?.firstName} {resume?.lastName}</div>
        <p>123 Main Street • City, State ZIP • {resume?.emailAddress || ''} • {"555-555-5555"}</p>
      </div>);
  }

  return (
      <div key="resume">
        {isLoadingResume && <Spinner />}
        {resume && (
        <div className="container box-border border-4 border-50-black rounded-lg p-2 w-full">
          <HeaderBar />
          <div className="content">

            {/* Objective */}
            <div className="sectionTitle">Objective</div>
            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-black"/>
            <div className="pb-2">{resume.objective}</div>

            {/* Education */}
            <div className="sectionTitle">Education</div>
            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-black"/>
            {schools?.map((school) => (
              <div>
                <div className="grid grid-cols-2">
                  <span className="school">{school.name}</span>
                  <span className="city">City, State</span>
                  <span className="degree">{school.major}</span>
                  <span className="date">{school.startDate} - {school.endDate || 'Present'}</span>
                </div>
                <ul className="job-description">
                  {school.accomplishments.map((acc: string) => (
                    <li>{acc}</li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Jobs */}
            <div className="sectionTitle">Experience</div>
            {jobs?.map((job) => (
              <div className="section-content">
                <span className="job-title">{job.title}</span>
                <span className="city">{job.location}</span>
                <span className="employer">{job.company}</span>
                <span className="date">{job.startYear} - {job.endYear || 'Present'}</span>
                <ul className="job-description">
                  {job.responsibilities.map((resp: string) => (
                    <li>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Skills */}
            <div className="sectionTitle">Skills</div>
            <div className="section-content">
              <ul className="skills-list">
                {resume?.skills?.map((skill: string) => (
                  <li>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        )}
    </div>
  );
}
  