// @ts-ignore
import React, { useState, useEffect } from 'react';
// @ts-ignore
import { match, useLocation } from "react-router-dom";
import { useQuery } from "@wasp/queries";
import getResume from "@wasp/queries/getResume";
import getJobs from "@wasp/queries/getJobs";
import getSchools from "@wasp/queries/getSchools";
import { Resume } from "@wasp/entities";
import Spinner from "../components/Spinner";
import { IJobPayload, ISchoolPayload } from '../../shared/types';
import html2pdf from "html2pdf.js";
import { ContactInfo, Summary, Jobs, Schools, Skills} from "../components";
import useAuth from '@wasp/auth/useAuth';


import '../styles/Resume.css';

const MED_SCREEN_WIDTH = 768;

/**
 * Resume Page content
 * @param id Resume ID to display
 * @returns Resume page content
 */
export function ResumePage({ match }: { match: match<{ id: string }> }) {
  const resumeRef = React.useRef<HTMLDivElement | null>(null);
  const { data: user, isLoading: isUserLoading } = useAuth();
  // Load resume data if guest
  // let resumein = null;
  // let jobsin = null;
  // let schoolsin = null;
  // let loadingResume = false;
  // if (user === null && !isUserLoading) {
  //   const location = useLocation();
  //   resumein = location.state?.resumeOut;
  //   console.log('Not a user, got a resume in: ', resumein);
  //   jobsin = resumein.jobs;
  //   schoolsin = resumein.schools;
  //   console.log('Got a resume in: ', resumein);
  // } else {
    console.log('User is not null, loading from DB');
    const id = match.params.id as string;

    const { data: resume, isLoading: isLoadingResume } = useQuery<{ id: string }, Resume>(getResume, { id });
    const { data: jobs } = useQuery<{ resumeId: string }, IJobPayload[]>(getJobs, { resumeId: resume?.id || '' });
    const { data: schools } = useQuery<{ resumeId: string }, ISchoolPayload[]>(getSchools, { resumeId: resume?.id || '' });
  //   jobsin = jobs;
  //   schoolsin = schools;
  //   loadingResume = isLoadingResume;
  // }

  const [showAlert, setShowAlert] = useState(false);
  const [ackAlert, setAckAlert] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MED_SCREEN_WIDTH) {
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSaveAsPDF = async () => {
    const element = resumeRef.current;

    if (element) {
      const opt = {
        margin: 0,
        filename: 'my_component.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    }
  };

  if (showAlert && !ackAlert) {
    return (
      <div className="bg-yellow-200 border-yellow-500 border-4 p-4">
        <p className="font-bold">Warning</p>
        <p>This page may not display properly on small screens.</p>
        <button onClick={() => setAckAlert(true)}>OK</button>
      </div>
    )
  }

  return (
    <div className="m-2">
    <div className="container" ref={resumeRef}>
      {isLoadingResume && <Spinner />}
      {resume && jobs && schools && (
        <div key="resume">
          <div>
            <ContactInfo 
              firstName={resume.firstName} 
              lastName={resume.lastName} 
              email='{resume.email}'
              phone={resume.phone}/>
            <Summary summary={resume.objective || 'Fill summary here'}/>
            <Schools schools={schools}/>
            <Jobs jobs={jobs} />
            <Skills skills={resume.skills}/>
          </div>
        </div>
      )}
    </div>
            <div className="flex justify-center items-center">
            <button
              className="submitButton bg-slate-800" 
              onClick={handleSaveAsPDF}>
              Download as PDF
            </button>
          </div>
          </div>
  );    
}
  
