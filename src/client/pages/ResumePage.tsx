import React from 'react';
import { match } from "react-router-dom";
import { useQuery } from "@wasp/queries";
import getResume from "@wasp/queries/getResume";
import getUser from "@wasp/queries/getUser";
import getJobs from "@wasp/queries/getJobs";
import getSchools from "@wasp/queries/getSchools";
import { Resume, User, Job, School } from "@wasp/entities";
import Spinner from "../components/Spinner";
import '../styles/Resume.css';

export function ResumePage({ match }: { match: match<{ id: string }> }) {
  const id = match.params.id as string;

  const { data: resume, isLoading: isLoadingResume } = useQuery<{ id: string }, Resume>(getResume, { id });
  const { data: jobs, isLoading: isLoadingJobs } = useQuery<{ resumeId: string }, Job[]>(getJobs, { resumeId: resume?.id || '' });
  const { data: schools, isLoading: isLoadingSchools } = useQuery<{ resumeId: string }, School[]>(getSchools, { resumeId: resume?.id || '' });

  function HeaderBar() {
    return (
      <div className="header">
        <div className="name">{resume.firstName} {resume.lastName}</div>
        <p className="address email">123 Main Street • City, State ZIP • {resume.emailAddress || ''} • {"555-555-5555"}</p>
      </div>);
  }

  return (
      <div className="box-border">
        {isLoadingResume && <Spinner />}
        {(resume) && (
        <div className="container">
          <HeaderBar />
          <div className="content">
            <h2 className="section-title">Objective</h2>
            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-black"/>
            <div className="objective">{resume.objective}</div>
            <h2 className="section-title">Education</h2>
            {schools?.map((school) => (
              <div>
                <span className="school">{school.schoolName}</span>
                <span className="city">City, State</span><br/>
                <span className="degree">{school.major}</span>
                <span className="date">{school.startYear} - {school.endYear || 'Present'}</span><br/>
                <ul className="job-description">
                  {school.accomplishments.map((acc) => (
                    <li>{acc}</li>
                  ))}
                </ul>
              </div>
            ))}
            <h2 className="section-title">Experience</h2>
            {jobs.map((job) => (
              <div className="section-content">
                <span className="job-title">{job.title}</span>
                <span className="city">{job.location}</span><br/>
                <span className="employer">{job.company}</span>
                <span className="date">{job.startYear} - {job.endYear || 'Present'}</span><br/>
                <ul className="job-description">
                  {job.responsibilities.map((resp) => (
                    <li>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
            <h2 className="section-title">Skills</h2>
            <div className="section-content">
              <ul className="skills-list">
                {resume?.skills?.map((skill) => (
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
  