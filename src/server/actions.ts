import HttpError from '@wasp/core/HttpError.js';
import type { Job, Resume, CoverLetter, School, User } from '@wasp/entities';
import type { GenerateResume, CreateJob, UpdateJob, UpdateResume, UpdateCoverLetter, GenerateCoverLetter } from '@wasp/actions/types';

import { ChatGPTAPI } from 'chatgpt';

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

const gptConfig = `You are a resume generator.
You shall be given a personal information about someone including their job history, education and skills.
You shall generate responses that can be used on a resume.
You shall write in a modern, professional style.
Your response shall only contain json code, no other text, as to translate easily to a javascript object.
The json response shall contain fields for the following: jobs, education, objective, additionalInformation.
All fields shall be strings unless otherwise specified

The jobs field shall contain an array of objects with the following fields: title, location, company, responsibilities.
The responsibilities field shall contain full sentences in an array format.

The education field shall contain an array of objects with the following fields: level, schoolName, startYear (number), endYear (number), major, gpa (number), accomplishments.
The accomplishments field shall contain full sentences in an array format.

The education field shall contain an array of objects with the following fields: level, schoolName, startYear, endYear, major, gpa, accomplishments.
The accomplishments field shall contain full sentences in an array format.

The additionalInformation field shall contain full sentences in an array format.

The objective field shall be a string written by you based on the information above and the information to be provided.

You shall use the following data to generate the json responses for the resume:`;

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
    const response = await api.sendMessage(gptConfig);
    const resumeWithResponse = JSON.parse(response.text);
    const resumeOut = Object.assign(resume, resumeWithResponse);
    const result = context.entities.Resume.create({
      data: {
        objective: resumeOut.objective,
        jobs: {create: resumeOut.jobs},
        education: {create: resumeOut.education},
        user: resumeOut.user,
      }
    });

    console.log('Logging result type');
    console.log(result);
    console.log(typeof(result));

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
