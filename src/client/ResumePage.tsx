import {
  Tooltip,
  Button,
  Textarea,
  useClipboard,
  Spinner
} from "@chakra-ui/react";
import { match } from "react-router-dom";
import { useQuery } from "@wasp/queries";
import getResume from "@wasp/queries/getResume";
import getUser from "@wasp/queries/getUser";
import getJobs from "@wasp/queries/getJobs";
import getSchools from "@wasp/queries/getSchools";
import { Resume, User, Job, School } from "@wasp/entities";
import BorderBox from "./components/BorderBox";
import './styles/Resume.css';

export function ResumePage({ match }: { match: match<{ id: string }> }) {
  const id = match.params.id as string;

  const { data: resume, isLoading: isLoadingResume } = useQuery<{ id: string }, Resume>(getResume, { id: id, refetchOnWindowFocus: false });
  const { data: user, isLoading: isLoadingUsers } = useQuery<{ id: number | undefined }, User>(getUser, { id: (resume?.userId || 0), refetchOnWindowFocus: false });
  const { data: jobs, isLoading: isLoadingJobs } = useQuery<{ resumeId: string }, Job[]>(getJobs, { resumeId: resume?.id || '', refetchOnWindowFocus: false });
  const { data: schools, isLoading: isLoadingSchools } = useQuery<{ resumeId: string }, School[]>(getSchools, { resumeId: resume?.id || '', refetchOnWindowFocus: false });

  return (
      <BorderBox>
          {isLoadingResume && <Spinner />}
          {(resume) && (
            <div class="container">
              <div class="header">
                <h1 class="name">{user?.firstName} {user?.lastName}</h1>
                <hr />
                <p class="address email">123 Main Street • City, State ZIP • {user?.emailAddress || ''} • {"555-555-5555"}</p>
              </div>
              <div class="content">
              <h2 class="section-title">Objective</h2>
              <div class="objective">{resume.objective}</div>
              <h2 class="section-title">Education</h2>
              {schools?.map((school, _) => (
                <div>
                  <span class="school">{school.schoolName}</span>
                  <span class="city">City, State</span><br/>
                  <span class="degree">{school.major}</span>
                  <span class="date">{school.startDate} - {school.endDate || 'Present'}</span><br/>
                  <ul class="job-description">
                    {school.accomplishments.map((acc, i) => (
                      <li>{acc}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <h2 class="section-title">Experience</h2>

              {jobs?.map((job, _) => (
                <div class="section-content">
                  <span class="job-title">{job.title}</span>
                  <span class="city">{job.location}</span><br/>
                  <span class="employer">{job.company}</span>
                  <span class="date">Start Date - {job.endDate || 'Present'}</span><br/>
                  <ul class="job-description">
                    {job.responsibilities.map((resp, _) => (
                      <li>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <h2 class="section-title">Skills</h2>
              <div class="section-content">
                  <ul class="skills-list">
                    <li>Skill 1</li>
                    <li>Skill 2</li>
                    <li>Skill 3</li>
                    <li>Skill 4</li>
                  </ul>
              </div>
            </div>
          </div>
        )}
      </BorderBox>
  );
}
