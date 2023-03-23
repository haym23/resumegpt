import { GetCoverLetter, GetJobs, GetJob, GetResume, GetUser, GetSchools } from '@wasp/queries/types';
import { CoverLetter, Job, Resume, User, School } from '@wasp/entities';
import HttpError from '@wasp/core/HttpError.js';

/**
 * @function getCoverLetter
 * 
 * @description Get the cover letter
 * 
 * @param {CoverLetter} id - The ID of the cover letter
 * 
 * @return {CoverLetter}
 */
export const getCoverLetter: GetCoverLetter<CoverLetter> = async ({ id }, context) => {
  if (!context.user) {
      return context.entities.CoverLetter.findFirst({
        where: {
          id,
        },
      });
  }

  return context.entities.CoverLetter.findFirst({
    where: {
      id,
      user: { id: context.user.id },
    },
  });
};

/**
 * @function getResume
 * 
 * @description Get the cover letter
 * 
 * @param {string} id - The ID of the cover letter
 * 
 * @return {Resume}
 */
export const getResume: GetResume<Resume> = async ({ id }, context) => {
  if (!context.user) {
      return context.entities.Resume.findFirst({
        where: {
          id,
        },
      });
  }

  return context.entities.Resume.findFirst({
    where: {
      id,
      user: { id: context.user.id },
    },
  });
};

type GetCoverLetterArgs = {
  id: string;
};

export const getCoverLetters: GetCoverLetter<GetCoverLetterArgs, CoverLetter[]> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.CoverLetter.findMany({
    where: {
      user: { id: context.user.id },
    },
  });
};

type GetJobsArgs = {
  resumeId: string;
};

export const getJobs: GetJobs<GetJobsArgs, Job[]> = async ({ resumeId }, context) => {
  return context.entities.Job.findMany({
    where: {
      resumeId,
    },
  });
};

type GetSchoolsArgs = {
  resumeId: string;
};

export const getSchools: GetSchools<GetSchoolsArgs, School[]> = async ({ resumeId }, context) => {
  return context.entities.School.findMany({
    where: {
      resumeId,
    },
  });
};

export const getJob: GetJob<Job> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.findFirst({
    where: {
      id,
      resume: { id: String(context.user.id) },
    },
  });
};

export const getUser: GetUser<User> = async ({ id }, context) => {
  return context.entities.User.findFirst({
    where: {
      id,
    },
  });
};