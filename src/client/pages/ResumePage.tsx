import React from 'react';
import { match } from "react-router-dom";
import { useQuery } from "@wasp/queries";
import getResume from "@wasp/queries/getResume";
import getJobs from "@wasp/queries/getJobs";
import getSchools from "@wasp/queries/getSchools";
import { Resume } from "@wasp/entities";
import Spinner from "../components/Spinner";
import { ContactInfo, Summary, Jobs, Schools, Skills} from "../components";
import { IJobPayload, ISchoolPayload } from '../../shared/types';

import '../styles/Resume.css';

export function ResumePage({ match }: { match: match<{ id: string }> }) {
  const id = match.params.id as string;

  const { data: resume, isLoading: isLoadingResume } = useQuery<{ id: string }, Resume>(getResume, { id });
  const { data: jobs } = useQuery<{ resumeId: string }, IJobPayload[]>(getJobs, { resumeId: resume?.id || '' });
  const { data: schools } = useQuery<{ resumeId: string }, ISchoolPayload[]>(getSchools, { resumeId: resume?.id || '' });

  return (
      <div key="resume" className="object-contain max-h-full flex justify-center ">
        {isLoadingResume && <Spinner />}
        {resume && jobs && schools && (
        <div className="resume aspect-[3/4] container box-border border-4 border-50-black rounded-lg bg-white mx-auto p-1.5 sm:p-3 my-4">
          <ContactInfo firstName={resume.firstName} lastName={resume.lastName} email={resume.emailAddress} address={resume.address}/>
          <Summary summary={resume.objective || 'Fill summary here'}/>
          <Schools schools={schools}/>
          <Jobs jobs={jobs} />
          <Skills skills={resume.skills}/>
        </div>
        )}
    </div>
  );
}
  
