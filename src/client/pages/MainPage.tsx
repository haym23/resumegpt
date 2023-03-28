import React, { useState } from 'react';
import generateResume from '@wasp/actions/generateResume';
import { useHistory } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { Job, defaultJob, School, defaultSchool } from '../../shared/types';


import '../styles/Main.css';

function MainPage() {
  const [formValues, setFormValues] = useState(new Map<string, any>());
  const [schools, setSchools] = useState<Array<School>>(new Array<School>([defaultSchool]));
  const [jobs, setJobs] = useState<Array<Job>>(new Array<Job>([defaultJob]));
  const [waitingForResume, setWaitingForResume] = useState(false);

  function handleInputChange(event) {
    const { id, value } = event.target;
    setFormValues(new Map(formValues.set(id, value)));
  }

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


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    try {
      setWaitingForResume(true);
      const schools =  convertToArray('school');
      const payload = {
        firstName: formValues['firstName'],
        lastName: formValues['lastName'],
        emailAddress: formValues['emailAddress'],
        address: formValues['address'],
        schools,
        jobs,
      }

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
    let newSchool: School = defaultSchool;
    setSchools([...schools, newSchool])
  }

  const deleteSchool = (index) => {
    let data = [...schools];
    data.splice(index, 1);
    setSchools(data);
  }

  const handleSchoolsChange = (index, event) => {
    let data = [...schools];
    data[index][event.target.name] = event.target.value;
    setSchools(data);
  }

  const addJob = () => {
    let newJob: Job = defaultJob;
    setJobs([...jobs, newJob])
  }

  const deleteJob = (index) => {
    let data = [...jobs];
    data.splice(index, 1);
    setJobs(data);
  }

  const handleJobsChange = (index, event) => {
    let data = [...jobs];
    data[index][event.target.name] = event.target.value;
    setJobs(data);
  }

  if (waitingForResume) {
    return (
      <Spinner />
    );
  } else {
    return (
      <div className="flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit} action="/">

        {/* Contact Box */}
        <div className="w-96 max-w-md mx-auto md:max-w-2xl mb-6">
          <label className="formLabel">Name</label>
          <input
            id={`firstName`}
            className="formStyle"
            type="text"
            placeholder="First Name"
            value={formValues['firstName']}
            onChange={handleInputChange}
            required
          />
          <input
            id={`lastName`}
            className="formStyle"
            type="text"
            placeholder="Last Name"
            value={formValues['lastName']}
            onChange={handleInputChange}
            required
          />
          <label className="formLabel">Email</label>
          <input
            id={'emailAddress'}
            className="formStyle"
            type="email"
            value={formValues['emailAddress']}
            onChange={handleInputChange}
            required
          />
          <label className="formLabel">Address</label>
          <input
            id={'address'}
            className="formStyle"
            type="text"
            value={formValues['address']}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* School Box */}
        <div className="border rounded-md border-gray-500 p-5 w-96 mb-6">
          <div className="whitespace-nowrap flex justify-between">
            <div className="formHeader">School Info</div>
            <button type="button" className="addButton" onClick={addSchool}>Add School</button>
          </div>
        {schools.map((school, index) => (
          <div key={index} className="mt-6">
            <div className="mb-6">
              <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">School Name</label>
              <input 
                type="text" 
                id={school.name}
                className="formStyle" 
                placeholder="Harvard University" 
                value={school.name}
                onChange={handleSchoolsChange}
                required />
            </div> 
            <div className="mb-6">
              <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Major</label>
              <input 
                type="text"
                id={`schoolmajor${index}`}
                className="formStyle"
                placeholder="Business Administration"
                value={formValues[`schoolmajor${index}`]}
                onChange={handleSchoolsChange}
                required />
            </div> 
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Degree Earned/Working Towards</label>
              <select id={`schooldegree${index}`} className="formStyle" onChange={handleSchoolsChange}>
                <option>High School Diploma</option>
                <option>Bachelor's of Science</option>
                <option>Bachelor's of Arts</option>
                <option>Masters Degree</option>
                <option>Doctorate</option>
                <option>Orange</option>
              </select>
            </div>
            <button type="button" id={index} className="removeButton" onClick={(event) => deleteSchool(event)}>Remove School</button>
          </div>
        ))}
        </div>

        {/* Job Box */}
        <div className="whitespace-nowrap border rounded-md border-gray-500 p-4 w-96">
          <div className="flex justify-between">
            <div className="formHeader">Job Info</div>
            <button type="button" className="addButton" onClick={addJob}>Add Job</button>
          </div>
          {jobs.map((job, index) => job && (
          <>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
                <input 
                  type="text"
                  id="title"
                  className="formStyle"
                  placeholder="John"
                  value={job?.title}
                  onChange={(event) => handleJobsChange(index, event)}
                  required />
              </div>

              <div>
                <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company</label>
                <input 
                  type="text" 
                  id="company" 
                  className="formStyle" 
                  placeholder="Flowbite"
                  value={job.firstName}
                  onChange={(event) => handleJobsChange(index, event)}
                  required />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                <input type="tel" id="phone" className="formStyle" placeholder="123-456-7890" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required />
              </div>
              <div>
                <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website URL</label>
                <input type="url" id="website" className="formStyle" placeholder="flowbite.com" required />
              </div>
              <div>
                <label htmlFor="visitors" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unique visitors (per month)</label>
                <input type="number" id="visitors" className="formStyle" placeholder="" required />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
              <input type="email" id="email" className="formStyle" placeholder="john.doe@company.com" required />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input type="password" id="password" className="formStyle" placeholder="•••••••••" required />
            </div> 
            <div className="mb-6">
              <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
              <input type="password" id="confirm_password" className="formStyle" placeholder="•••••••••" required />
            </div> 
            <button type="button" className="removeButton" onClick={deleteJob}>Remove Job</button>
          </>
        ))}
        </div>

        {/* Generate button */}
        <div className="flex justify-center items-center">
          <button type="submit" className="submitButton">
            Generate Resume
          </button>
        </div>
        </form>
      </div>
    );
  }
}

export default MainPage;
