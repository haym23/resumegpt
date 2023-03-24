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
import React, { useState, useEffect, useRef } from 'react';
import { Job, User } from '@wasp/entities';
import BorderBox from './components/BorderBox';
import JobForm from './components/JobForm';
import ContactBox from './components/ContactBox';
import generateResume from '@wasp/actions/generateResume';

function MainPage() {
  const [jobToFetch, setJobToFetch] = useState<string | null>(null);
  const [isCoverLetterUpdate, setIsCoverLetterUpdate] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [user, setUser] = useState<User>();

  const { data: job, isLoading: _ } = useQuery<{ id: string | null }, Job>(
    getJob,
    { id: jobToFetch },
    { enabled: !!jobToFetch }
  );

  const {
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm();

  const history = useHistory();

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
        location: job.location
      });
    }
  }

  async function onClick(values: any): Promise<void> {
    try {
      const payload = {
        jobs,
        user
      }
      const resumeOut = (await generateResume({...payload}));

      history.push(`/resume/${resumeOut.id}`);
    } catch (error) {
      alert('Something went wrong, please try again');
      console.error(error);
    }
  }

  function handleAddJob() {
    let job: Job;
    setJobs([...jobs, job]);
  }

  function handleDeleteJob(index) {
    const list = [...jobs];
    list.splice(index, 1);
    setJobs(list);
  }

  function updateContact(data) {
    setUser({ ...data })
  }

  function updateJob(data, index) {
    if (jobs.length === 0) {
      setJobs([Object.assign({}, jobs[index], data),]);
    } else if (jobs.length === 1){
      setJobs([
          ...jobs.slice(0, index),
          Object.assign({}, jobs[index], data),]
      );
    } else {
      setJobs([
          ...jobs.slice(0,index),
          Object.assign({}, jobs[index], data),
          ...jobs.slice(index+1)
        ]);
    }
  }

  return (
    <div>
      <ContactBox 
        key="testKey"
        updateForm={(data) => updateContact(data)}/>
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
