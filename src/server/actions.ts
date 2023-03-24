import HttpError from '@wasp/core/HttpError.js';
import type { Job, CoverLetter } from '@wasp/entities';
import type { GenerateResume, CreateJob, UpdateJob, UpdateResume, UpdateCoverLetter, GenerateCoverLetter } from '@wasp/actions/types';

import Resume from "./types";

import { ChatGPTAPI } from 'chatgpt';

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

const getPrompt = (resume: Resume) => {
  const prompt = `
  Can you extract key information from my resume and return it in a structured format?
  Here is the resume in JSON format: 
  ${JSON.stringify(resume)}
  
  \n
  In jobs, the responsibilities field shall contain 2 or 3 full sentences in an array format, comprising of responsibilities an employee might have.
  In jobs, if a job title is recognized, use the full name of that job title in the value of the JSON output.
  In jobs, if a company is recognized, use the full name of that company in the value of the JSON output.
  In addition, based on the information provided, create an "objective" statement relating to the jobs and education given. Include this in the JSON response.
  In addition, based on the information provided, create a "skills" array that includes the skills gained through the education and work experience provided. Include this in the JSON response.
  Your reseponse can only by in JSON format, with no other characters.`
  ;

  console.log(prompt);

  return prompt;
}


export const generateCoverLetter: GenerateCoverLetter<CoverLetter> = async (
  { content },
  context
) => {
}

export const generateResume: GenerateResume<Resume> = async (
  resume,
  context
) => {
  try {
    const response = await api.sendMessage(getPrompt(resume));
    let resumeWithResponse;
    if (response.text.charAt(0) === '`') {
      resumeWithResponse = JSON.parse(response.text.charAt(0).replace('`', '').substring(4))
    } else {
      resumeWithResponse = JSON.parse(response.text);
    }
    
    const resumeOut = Object.assign(resume, resumeWithResponse);
    const result = await context.entities.Resume.create({
      data: {
        objective: resumeOut.objective,
        jobs: {create: resumeOut.jobs},
        education: {create: resumeOut.education},
        user: {create: resumeOut.user},
        skills: resumeOut.skills,
      }
    });

    return result;
  } catch (e) {
    console.log(e);
    throw(e);
  }
};

export type JobPayload = Pick<Job, 'title' | 'company' | 'location'>;

export const createJob: CreateJob<JobPayload, Job> = ({ title, company, location }, context) => {
  if (!context.user) {
    return context.entities.Job.create({
      data: {
        title,
        location,
        company,
      },
    });
  }

  return context.entities.Job.create({
    data: {
      title,
      location,
      company,
    },
  });
};

export type UpdateJobPayload = Pick<Job, 'id' | 'title' | 'company' | 'location'>;

export const updateJob: UpdateJob<UpdateJobPayload, Job> = (
  { id, title, company, location },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.update({
    where: {
      id,
    },
    data: {
      title,
      location,
      company,
    },
  });
};


export const updateCoverLetter: UpdateCoverLetter<CoverLetter> = async (
  { content },
  context
) => {
}

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
