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

  const { data: resume, isLoading: isLoadingResume } = useQuery<{ id: string }, Resume>(getResume, { id: id });
  const { data: user, isLoading: isLoadingUsers } = useQuery<{ id: number | undefined }, User>(getUser, { id: (resume?.userId || 0) });
  const { data: jobs, isLoading: isLoadingJobs } = useQuery<{ resumeId: string }, Job[]>(getJobs, { resumeId: resume?.id || '' });
  const { data: schools, isLoading: isLoadingSchools } = useQuery<{ resumeId: string }, School[]>(getSchools, { resumeId: resume?.id || '' });

  console.log(resume);

  function HeaderBar({ firstName, lastName, emailAddress }) {
    return (
      <div className="header">
        <h1 className="name">{firstName} {lastName}</h1>
        <hr />
        <p className="address email">123 Main Street • City, State ZIP • {emailAddress || ''} • {"555-555-5555"}</p>
      </div>);
  }

  return (
      <div className="box-border">
          {isLoadingResume && <Spinner />}
          {(resume) && (
            <div className="container">
            <HeaderBar firstName={user?.firstName} lastName={user?.lastName} emailAddress={user?.emailAddress}  />
            <div className="content">
              <h2 className="section-title">Objective</h2>
              <div className="objective">{resume.objective}</div>
              <h2 className="section-title">Education</h2>
              {schools?.map((school, _) => (
                <div>
                  <span className="school">{school.schoolName}</span>
                  <span className="city">City, State</span><br/>
                  <span className="degree">{school.major}</span>
                  <span className="date">{school.startYear} - {school.endYear || 'Present'}</span><br/>
                  <ul className="job-description">
                    {school.accomplishments.map((acc, _) => (
                      <li>{acc}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <h2 className="section-title">Experience</h2>

              {jobs?.map((job, _) => (
                <div className="section-content">
                  <span className="job-title">{job.title}</span>
                  <span className="city">{job.location}</span><br/>
                  <span className="employer">{job.company}</span>
                  <span className="date">{job.startYear} - {job.endYear || 'Present'}</span><br/>
                  <ul className="job-description">
                    {job.responsibilities.map((resp, _) => (
                      <li>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <h2 className="section-title">Skills</h2>
              <div className="section-content">
                  <ul className="skills-list">
                    {resume?.skills?.map((skill, _) => (
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
  