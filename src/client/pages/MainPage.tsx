// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import { useHistory } from 'react-router-dom';
import generateResume from '@wasp/actions/generateResume';
import useAuth from '@wasp/auth/useAuth';
import Spinner from '../components/Spinner';
import { ISchoolPayload, IJobPayload } from '../../shared/types';

import '../styles/Main.css';

function MainPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [schools, setSchools] = useState<Array<ISchoolPayload>>(new Array<ISchoolPayload>());
  const [jobs, setJobs] = useState<Array<IJobPayload>>(new Array<IJobPayload>());
  const [waitingForResume, setWaitingForResume] = useState(false);

  const history = useHistory();

  const { data: user, isLoading: isUserLoading } = useAuth();

  const formatPhoneNumber = (): string => {
    // Remove all non-digit characters from the input
    const digitsOnly = phoneNumber.replace(/\D/g, '');

    // Format the phone number
    let formattedNumber = '';
    if (digitsOnly.length >= 3) {
      formattedNumber += `(${digitsOnly.slice(0, 3)})`;
    }
    if (digitsOnly.length >= 6) {
      formattedNumber += ` ${digitsOnly.slice(3, 6)}`;
    }
    if (digitsOnly.length > 6) {
      formattedNumber += `-${digitsOnly.slice(6)}`;
    }

    return formattedNumber;
  };

  async function handleSubmit(): Promise<void> {
    try {
      setWaitingForResume(true);
      const payload = {
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        schools,
        jobs,
      }

      console.log(payload);

      const resumeOut = (await generateResume({...payload}));
      history.push(`/resume/${resumeOut.id}`);      
      setWaitingForResume(false);
    } catch (error) {
      alert('Something went wrong, please try again');
      console.error(error);
      setWaitingForResume(false);
    }
  }

  const addSchool = () => {
    const newSchool: ISchoolPayload = {
      name: '',
      location: '',
      degree: '',
      notes: '',
      gpa: 0,
      major: '',
      accomplishments: [], 
    }
    setSchools([...schools, newSchool]);
  }

  const deleteSchool = (index: number) => {
    let data = [...schools];
    data.splice(index, 1);
    setSchools(data);
  }

  const handleSchoolsChange = (index: number, event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const data = [...schools];
    const keyName: string = event.target.id.substr('school'.length).match(/[a-zA-Z]+/g)?.at(0) || '';

    switch(keyName) {
      case 'name':
        data[index].name = event.target.value;
        break;
      case 'location':
          data[index].location = event.target.value;
          break;
      case 'degree':
        data[index].degree = event.target.value;
        break;
      case 'gpa':
        data[index].gpa = parseFloat(event.target.value);
        break;
      case 'major':
        data[index].major = event.target.value;
        break;
      case 'notes':
        data[index].notes = event.target.value;
        break;
      default:
        console.log(`Error: Invalid keyName: ${keyName}`);
        break;
    }

    setSchools(data);
  }

  const addJob = () => {
    let newJob: IJobPayload = {
      title: '',
      company: '',
      location: '',
      notes: '',
      responsibilities: [],
    };
    setJobs([...jobs, newJob]);
  }

  const deleteJob = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    let data = [...jobs];
    data.splice(index, 1);
    setJobs(data);
  }

  const handleJobsChange = (index: number, event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    let data = [...jobs];
    const keyName = event.target.id.substr('job'.length).match(/[a-zA-Z]+/g)?.at(0) || '';

    switch(keyName) {
      case 'title':
        data[index].title = event.target.value;
        break;
      case 'company':
        data[index].company = event.target.value;
        break;
      case 'location':
        data[index].location = event.target.value;
        break;
      case 'startDate':
        data[index].startDate = event.target.value;
        break;
      case 'endDate':
        data[index].endDate = event.target.value;
        break;
      case 'notes':
        data[index].notes = event.target.value;
        break;
      default:
        console.log(`Error: Invalid keyName: ${keyName}`);
        break;
    }

    setJobs(data);
  }

  if (waitingForResume) {
    return (
      <Spinner />
    );
  } else {
    return (
      <div key="Main" className="flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit} action="/">

        {/* Contact Box */}
        <div className="w-96 max-w-md mx-auto md:max-w-2xl mb-6">
          <label className="formLabel">Name</label>
          <input
            id="firstName"
            className="formStyle"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)}
            required
          />
          <input
            id="lastName"
            className="formStyle"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)}
            required
          />
          <label className="formLabel">Email</label>
          <input
            id="emailAddress"
            className="formStyle"
            type="email"
            value={emailAddress}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmailAddress(event.target.value)}
            required
          />
          <label className="formLabel">Phone</label>
          <input
            id="phoneNumber"
            className="formStyle"
            type="text"
            value={phoneNumber}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(event.target.value)}
            required
          />
        </div>

        {/* School Box */}
        <div className="border rounded-md border-gray-500 p-5 w-96 mb-6">
          <div className="whitespace-nowrap flex justify-between">
            <div className="formHeader">School Info</div>
            <button type="button" className="addButton bg-slate-800" onClick={addSchool}>Add School</button>
          </div>
          {schools.map((school: ISchoolPayload, index: number) => (
            <div key={index} className="mt-6">
              <div className="mb-6">
                <label htmlFor={`schoolname${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">School Name</label>
                <input 
                  type="text" 
                  id={`schoolname${index}`}
                  className="formStyle" 
                  placeholder="Harvard University" 
                  value={school.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSchoolsChange(index, event)}
                  required />
              </div>
              <div className="mb-6">
                <label htmlFor={`schoollocation${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                <input 
                  type="text"
                  id={`schoollocation${index}`}
                  className="formStyle"
                  placeholder="Raleigh, NC"
                  value={school.location}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSchoolsChange(index, event)}
                  required />
              </div> 
              <div className="mb-6">
                <label htmlFor={`schoolmajor${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Major</label>
                <input 
                  type="text"
                  id={`schoolmajor${index}`}
                  className="formStyle"
                  placeholder="Business Administration"
                  value={school.major}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSchoolsChange(index, event)}
                  required />
              </div> 
              <div className="mb-6">
                <label htmlFor={`schooldegree${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Degree Earned/Working Towards</label>
                <select id={`schooldegree${index}`} className="formStyle" onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleSchoolsChange(index, event)}>
                  <option >High School Diploma</option>
                  <option>Bachelor of Science</option>
                  <option>Bachelor of Arts</option>
                  <option>Masters Degree</option>
                  <option>Doctorate</option>
                </select>
              </div>
              <div className="my-6">
                <label htmlFor={`schoolnotes${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
                <textarea 
                  id={`schoolnotes${index}`}
                  className="formStyle"
                  placeholder="Math club, passed organic chemistry, etc."
                  value={school.notes}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleSchoolsChange(index, event)}
                  required />
              </div>
              <button type="button" id={`${index}`} className="removeButton bg-slate-800" onClick={() => deleteSchool(index)}>Remove School</button>
            </div>
          ))}
        </div>

        {/* Job Box */}
        <div className="whitespace-nowrap border rounded-md border-gray-500 p-4 w-96">
          <div className="flex justify-between">
            <div className="formHeader">Job Info</div>
            <button type="button" className="addButton bg-slate-800" onClick={addJob}>Add Job</button>
          </div>
          {jobs.map((job: IJobPayload, index: number) => job && (
          <>
            <div className="my-6">
              <label htmlFor={`jobtitle${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Title</label>
              <input 
                type="text"
                id={`jobtitle${index}`}
                className="formStyle"
                placeholder="System Administrator"
                value={job.title}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleJobsChange(index, event)}
                required />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
              <input 
                type="text" 
                id={`jobcompany${index}`}
                className="formStyle"
                placeholder="JP Morgan Chase"
                value={job.company}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleJobsChange(index, event)}
                required />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
              <input 
                type="text" 
                id={`joblocation${index}`}
                className="formStyle" 
                placeholder="Raleigh, NC"
                value={job.location}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleJobsChange(index, event)}
                required />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400">Start Date</label>
                <input
                  type="date" 
                  id={`jobstartDate${index}`}
                  className="formStyle"
                  value={job.startDate}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleJobsChange(index, event)}
                  required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400">End Date</label>
                <input 
                  type="date" 
                  id={`jobendDate${index}`}
                  className="formStyle" 
                  value={job.endDate}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleJobsChange(index, event)}
                  required />
              </div>
            </div>
            <div className="my-6">
              <label htmlFor={`jobnotes${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
              <textarea 
                id={`jobnotes${index}`}
                className="formStyle"
                placeholder="Leader on team, project development, etc."
                value={job?.notes}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleJobsChange(index, event)}
                required />
            </div>
            <button type="button" className="removeButton bg-slate-800" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => deleteJob(e, index)}>Remove Job</button>
          </>
        ))}
        </div>

        {/* Generate button */}
        <div className="flex justify-center items-center">
          <button type="submit" className="submitButton bg-slate-800">
            Generate Resume
          </button>
        </div>
        </form>
      </div>
    );
  }
}

export default MainPage;
