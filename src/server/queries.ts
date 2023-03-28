import { GetResume, GetUser, GetJobs, GetSchools } from '@wasp/queries/types';
import { Resume, User, Job, School } from '@wasp/entities';

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

// export const getJob: GetJob<Job> = async ({ id }, context) => {
//   if (!context.user) {
//     throw new HttpError(401);
//   }

//   return context.entities.Job.findFirst({
//     where: { 
//       id,
//   }});
// };

export const getUser: GetUser<User> = async ({ id }, context) => {
  return context.entities.User.findFirst({
    where: {
      id,
    },
  });
};