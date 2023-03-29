import HttpError from '@wasp/core/HttpError.js';
import type { GenerateResume, UpdateResume } from '@wasp/actions/types';
import type { Resume, Job, School } from '@wasp/entities';

import { ChatGPTAPI } from 'chatgpt';

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

type ResumePayload = Resume & {
  jobs: Pick<Job, 'title' | 'company' | 'location'>[];
  schools: Pick<School, 'name' | 'degree' | 'major' | 'gpa' | 'startDate' | 'endDate' | 'notes'>[];
};

const getPrompt = (resume: ResumePayload) => {
  const prompt = `
  Can you extract key information from my resume and return it in a structured format?
  Your reseponse can only by in JSON format, with no other characters or plain text (no notes).
  Here is the resume in JSON format: 
  ${JSON.stringify(resume)}
  
  \n
  In jobs, the responsibilities field shall contain 2 or 3 full sentences in an array format, comprising of responsibilities an employee might have.
  In jobs, if a job title is recognized, use the full name of that job title in the value of the JSON output.
  In jobs, if a company is recognized, use the full name of that company in the value of the JSON output.
  In addition, based on the information provided, create an "objective" statement relating to the jobs and education given. Include this in the JSON response.
  In addition, based on the information provided, create a "skills" array that includes the skills gained through the education and work experience provided. Include this in the JSON response.
  If the resume provided is blank, provide a generic JSON template based on the keys in the input.`
  ;

  return prompt;
}

export const generateResume: GenerateResume<ResumePayload, Resume> = async (
  resume,
  context
) => {
  let response;
  try {
    response = await api.sendMessage(getPrompt(resume));

    // Find the starting and ending positions of the JSON code
    const start = response.text.indexOf('{');
    const end = response.text.lastIndexOf('}');

    let resumeWithResponse: ResumePayload;
    if (start !== -1 && end !== -1) {
      const jsonStr = response.text.substring(start, end + 1)
      resumeWithResponse = JSON.parse(jsonStr);
    } else {
      throw new Error('Could not parse JSON response');
    }

    const resumeOut = Object.assign(resume, resumeWithResponse);

    console.log('Got resume', resumeOut);

    const result = await context.entities.Resume.create({
      data: {
        ...resumeOut,
        jobs: {createMany: {data: resumeOut.jobs as Job[]}},
        schools: {createMany: {data: resumeOut.schools as School[]}},
      }
    });

    console.log('Got result', result);

    return result;
  } catch (e) {
    console.log(e);
    throw(e);
  }
};

// export type JobPayload = Pick<Job, 'title' | 'company' | 'location'>;

// export const createJob: CreateJob<JobPayload, Job> = ({ title, company, location }, context) => {
//   if (!context.user) {
//     return context.entities.Job.create({
//       data: {
//         title,
//         location,
//         company,
//       },
//     });
//   }

//   return context.entities.Job.create({
//     data: {
//       title,
//       location,
//       company,
//     },
//   });
// };

// export type UpdateJobPayload = Pick<Job, 'id' | 'title' | 'company' | 'location'>;

// export const updateJob: UpdateJob<UpdateJobPayload, Job> = (
//   { id, title, company, location },
//   context
// ) => {
//   if (!context.user) {
//     throw new HttpError(401);
//   }

//   return context.entities.Job.update({
//     where: {
//       id,
//     },
//     data: {
//       title,
//       location,
//       company,
//     },
//   });
// };

export const updateResume: UpdateResume<Resume> = async (
  { id },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const foundResume = await context.entities.Resume.findFirst({
    where: {
      id: id,
    },
  });

  if (!foundResume) {
    throw new HttpError(404);
  }
};
