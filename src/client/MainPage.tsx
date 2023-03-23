import {
  Heading,
  Button,
  Code,
  Spacer,
  Flex
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getJob from '@wasp/queries/getJob';
import updateCoverLetter from '@wasp/actions/updateCoverLetter';
import React, { useState, useEffect, useRef } from 'react';
import { CoverLetter, Job, Resume } from '@wasp/entities';
import BorderBox from './components/BorderBox';
import { convertToSliderValue, convertToSliderLabel } from './components/CreativitySlider';
import JobForm from './components/JobForm';
import ContactBox from './components/ContactBox';
import generateResume from '@wasp/actions/generateResume';

function MainPage() {
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [jobToFetch, setJobToFetch] = useState<string | null>(null);
  const [isCoverLetterUpdate, setIsCoverLetterUpdate] = useState<boolean>(false);
  const [isCompleteCoverLetter, setIsCompleteCoverLetter] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState(30);
  const [showTooltip, setShowTooltip] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resume, setResume] = useState<Resume>({
    jobs: [{}],

  });

  const { data: job, isLoading: isJobLoading } = useQuery<{ id: string | null }, Job>(
    getJob,
    { id: jobToFetch },
    { enabled: !!jobToFetch }
  );

  const {
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm();

  const history = useHistory();
  const loadingTextRef = useRef<HTMLDivElement>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const jobIdParam = urlParams.get('job');

  useEffect(() => {
    if (jobIdParam) {
      setJobToFetch(jobIdParam);
      setIsCoverLetterUpdate(true);
      resetJob();
    } else {
      setIsCoverLetterUpdate(false);
      reset({
        title: '',
        company: '',
        location: '',
        description: '',
      });
    }
  }, [jobIdParam, job]);

  useEffect(() => {
    resetJob();
  }, [job]);

  function resetJob() {
    if (job) {
      reset({
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
      });
    }
  }

  async function onClick(values: any): Promise<void> {
    console.log(resume);

    try {
      let payload: Resume = resume;
      const resumeOut = (await generateResume({...resume}));
      console.log(resumeOut);
      
      setLoadingText();
      history.push(`/resume/${resumeOut.id}`);
    } catch (error) {
      alert('Something went wrong, please try again');
      console.error(error);
    }
  }

  async function setLoadingText() {
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = 'patience, my friend...');
    }, 1000);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = 'almost done...');
    }, 8000);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = '🧘...');
    }, 12000);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = '');
    }, 35000);
  }

  function handleAddJob() {
    setJobs([...jobs, {}]);
  }

  function handleDeleteJob(index) {
    const list = [...jobs];
    list.splice(index, 1);
    setJobs(list);
  }

  function updateContact(data) {
    setResume({
      ...resume,
      user: { ...data.formValues }
    })
  }

  function updateJob(data, index) {
    const jobOut = data.formValues;

    if (resume.jobs.length === 0) {
      setResume({
        ...resume,
        jobs: [Object.assign({}, resume.jobs[index], jobOut),]
      });
    } else if (resume.jobs.length === 1){
      setResume({
        ...resume,
        jobs: [
          ...resume.jobs.slice(0, index),
          Object.assign({}, resume.jobs[index], jobOut),
        ]
      });
    } else {
      setResume({
        ...resume,
        jobs: [
          ...resume.jobs.slice(0,index),
          Object.assign({}, resume.jobs[index], jobOut),
          ...resume.jobs.slice(index+1)
        ]
      });
    }
  }

  return (
    <div>
      <ContactBox 
        key="testKey"
        updateForm={(data) => updateContact(data)}/>
      {/* <JobBox jobs={jobs} onAddJob={handleAddJob} onDeleteJob={handleDeleteJob}/> */}
      <BorderBox >
      <Flex style={{ width: '100%' }}>
        <Heading size={'md'} alignSelf={'start'} mb={3}>
          Job Info {isCoverLetterUpdate && <Code ml={1}>Editing...</Code>}
        </Heading>
        <Spacer />
        <Button size='sm' colorScheme='contrast' onClick={handleAddJob}>
            <label htmlFor='addJob'>Add Job</label>
        </Button>
      </Flex>
        {jobs.map((x, i) => {
        return (<JobForm 
          index={i}
          updateForm={(data, index) => updateJob(data, index)}
          onDecrementJobs={(jobIdx) => handleDeleteJob(jobIdx)}/>)
      })}
      </BorderBox>
      <Button colorScheme='purple' mt={3} size='sm' isLoading={isSubmitting} onClick={onClick}>
        Generate Resume
      </Button>
    </div>
  );
}

export default MainPage;
