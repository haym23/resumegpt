import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import generateResume from '@wasp/actions/generateResume';

import '../styles/Main.css';

function MainPage() {
  const [formValues, setFormValues] = useState({});
  const [numSchools, setNumSchools] = useState(0);
  const [numJobs, setNumJobs] = useState(0);

  function handleInputChange(event) {
    const { id, value } = event.target;
    setFormValues({...formValues, [id]: value});
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

  async function handleSubmit(): Promise<void> {
    try {
      const jobs = convertToArray('job');
      const schools =  convertToArray('school');
      const payload = {
        firstName: formValues['firstName'],
        lastName: formValues['lastName'],
        emailAddress: formValues['emailAddress'],
        address: formValues['address'],
        schoolCount: numSchools,
        schools,
        jobCount: numJobs,
        jobs,
      }

      const resumeOut = (await generateResume({...payload}));
      console.log(resumeOut);
      history.push(`/resume/${resumeOut.id}`);
    } catch (error) {
      alert('Something went wrong, please try again');
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit}>

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
          <button className="object-right-top bg-purple-200 top-0 left-0 p-4" onClick={handleAddSchool}>Add School</button>
        </div>
      {[...Array(numSchools).keys()].map((index) => (
        <div className="mt-6">
          <div class="mb-6">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">School Name</label>
            <input 
              type="text" 
              id={`schoolname${index}`} 
              class="formStyle" 
              placeholder="Harvard University" 
              value={formValues[`schoolname${index}`]}
              onChange={handleInputChange}
              required />
          </div> 
          <div class="mb-6">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Major</label>
            <input 
              type="text"
              id={`schoolmajor${index}`}
              class="formStyle"
              placeholder="Business Administration"
              value={formValues[`schoolmajor${index}`]}
              onChange={handleInputChange}
              required />
          </div> 
          <div class="mb-6">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Degree Earned/Working Towards</label>
            <select id={`schooldegree${index}`} class="formStyle" onChange={handleInputChange}>
              <option>High School Diploma</option>
              <option>Bachelor's of Science</option>
              <option>Bachelor's of Arts</option>
              <option>Masters Degree</option>
              <option>Doctorate</option>
              <option>Orange</option>
            </select>
          </div>
          <button class="removeButton" onClick={handleDeleteSchool}>Remove School</button>
        </div>
      ))}
      </div>

      {/* Job Box */}
      <div className="whitespace-nowrap border rounded-sm border-gray-500 p-4 w-96">
        <div className="flex justify-between">
          <div className="formHeader">Job Info</div>
          <button className="object-right-top bg-purple-200 top-0 left-0 p-4" onClick={handleAddJob}>Add Job</button>
        </div>
        {[...Array(numJobs).keys()].map((index) => (
        <>
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
              <input type="text" id="first_name" class="formStyle" placeholder="John" required />
            </div>
            <div>
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
              <input type="text" id="last_name" class="formStyle" placeholder="Doe" required />
            </div>
            <div>
              <label for="company" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company</label>
              <input type="text" id="company" class="formStyle" placeholder="Flowbite" required />
            </div>
            <div>
              <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
              <input type="tel" id="phone" class="formStyle" placeholder="123-456-7890" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required />
            </div>
            <div>
              <label for="website" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website URL</label>
              <input type="url" id="website" class="formStyle" placeholder="flowbite.com" required />
            </div>
            <div>
              <label for="visitors" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unique visitors (per month)</label>
              <input type="number" id="visitors" class="formStyle" placeholder="" required />
            </div>
          </div>
          <div class="mb-6">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
            <input type="email" id="email" class="formStyle" placeholder="john.doe@company.com" required />
          </div>
          <div class="mb-6">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input type="password" id="password" class="formStyle" placeholder="•••••••••" required />
          </div> 
          <div class="mb-6">
            <label for="confirm_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
            <input type="password" id="confirm_password" class="formStyle" placeholder="•••••••••" required />
          </div> 
          <button class="removeButton" onClick={handleDeleteJob}>Remove Job</button>
        </>
      ))}
      </div>

      {/* Generate button */}
      <div className="flex justify-center items-center">
        <button type="submit" className="bg-blue-200 m-10 h-12 w-36">
          Generate Resume
        </button>
      </div>
      </form>
    </div>
  );
}

export default MainPage;
