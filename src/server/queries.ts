import { GetCoverLetter, GetJobs, GetJob } from '@wasp/queries/types';
import { CoverLetter, Job } from '@wasp/entities';
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

export const getJobs: GetJobs<Job[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.findMany({
    where: {
      resume: { id: String(context.user.id) },
    },
    orderBy: {
      createdAt: 'desc',
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
