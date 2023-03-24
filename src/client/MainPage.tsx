import {
  Heading,
  Button,
  Code,
  Spacer,
  Flex,
  CloseButton,
  Input
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

import './styles/Main.css';

function MainPage() {
  const [jobToFetch, setJobToFetch] = useState<string | null>(null);
  const [isCoverLetterUpdate, setIsCoverLetterUpdate] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [schoolNames, setSchoolNames] = useState<string[]>([]);
  const [user, setUser] = useState<User>();

  const [formValues, setFormValues] = useState({});
  const [numSchools, setNumSchools] = useState(0);
  const [numJobs, setNumJobs] = useState(0);

  function handleInputChange(event) {
    const { id, value } = event.target;
    setFormValues({...formValues, [id]: value});
  }

  const {
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm();

  const history = useHistory();

  function convertToArray(keyPrefix: string) {
    const vals: any = [];
    for (const key in formValues) {
      if (key.includes(keyPrefix)) {
        const index = Number(key.match('/\+/g'));
        const field = key.substring(keyPrefix.length).replace(/\d+$/, "")

        vals[index] = {
          ...vals[index],
          [field]: formValues[key]
        };
      }
    }

    return vals;
  }

  async function onClick(values: any): Promise<void> {
    try {
      const payload = {
        user,
        jobs: convertToArray('job'),
        education: convertToArray('school')        
      }

      console.log(payload);

      const resumeOut = (await generateResume({...payload}));

      history.push(`/resume/${resumeOut.id}`);
    } catch (error) {
      alert('Something went wrong, please try again');
      console.error(error);
    }
  }

  function handleAddJob() {
    setNumJobs(numJobs + 1);
  }

  function handleDeleteJob(index) {
    const formCopy = formValues;
    delete formCopy[`job${index}`]
    setFormValues(formCopy);
    setNumJobs(numJobs - 1);
  }

  function handleAddSchool() {
    setNumSchools(numSchools + 1);
  }


  function handleDeleteSchool(index) {
    const formCopy = formValues;
    delete formCopy[`schoolName${index}`]
    setFormValues(formCopy);
    setNumSchools(numSchools - 1);
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
    <>
    <ContactBox 
      key="testKey"
      updateForm={(data) => updateContact(data)}/>

    <BorderBox>
      <Flex style={{ width: '100%' }}>
        <Heading size={'md'} alignSelf={'start'} mb={3}>School Info</Heading>
        <Spacer />
        <Button size='sm' colorScheme='contrast' onClick={handleAddSchool}>
            <label htmlFor='addJob'>Add School</label>
        </Button>
      </Flex>
      {[...Array(numSchools).keys()].map((index) => (
      <>
      <div className="schoolContainer">
        <h2 className="heading">School {index + 1}</h2>
        <CloseButton className="close" size='sm' colorScheme='contrast' onClick={(idx) => handleDeleteSchool(idx)} />
      </div>
      <Input
        id={`schoolname${index}`}
        borderRadius={0}
        borderTopRadius={7}
        placeholder='school name'
        value={formValues[`schoolname${index}`]}
        onChange={handleInputChange}
      />
      <Input
        id={`schooldegree${index}`}
        borderRadius={0}
        borderTopRadius={7}
        placeholder='degree'
        value={formValues[`schooldegree${index}`]}
        onChange={handleInputChange}
      />
      </>
      )) || ''}
      </BorderBox>



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
        {[...Array(numJobs).keys()].map((index) => {
        return (<JobForm 
          index={index}
          updateForm={(data, index) => updateJob(data, index)}
          onDecrementJobs={(jobIdx) => handleDeleteJob(jobIdx)}/>)
      })}
      </BorderBox>
      <Button colorScheme='purple' mt={3} size='sm' isLoading={isSubmitting} onClick={onClick}>
        Generate Resume
      </Button>
    </>
  );
}

export default MainPage;


{/* <input
id='company'
borderRadius={0}
placeholder='company'
value={company}
onChange={handleChange}
/>
<input
id='location'
borderRadius={0}
placeholder='location'
value={location}
onChange={handleChange}
/>
<Textarea
id='responsibilities'
borderRadius={0}
placeholder='accomplishments, responsibilities, other notes...'
value={responsibilities}
onChange={handleChange}
/> */}