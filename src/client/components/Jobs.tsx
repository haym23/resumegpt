
import { IJobPayload } from '../../shared/types';
import { SectionWrapper } from './SectionWrapper';

interface JobsProps {
  jobs: IJobPayload[]
}

export const Jobs = ({ jobs }: JobsProps) => {
  return (
    <SectionWrapper title="Work Experience">
      <ul className="ml-1 sm:ml-2 leading-5">
        {jobs.map((job, i) => (
          <li key={job.company} className={i % 2 ? `mt-1` : `mt-half`}>
            <div className="flex">
              <div className="text-sm sm:text-xl md:text-2xl lg:text-4xl">
                {job.company} - {job.location}
              </div>
              <span className="ml-auto text-muted text-2xs sm:text-xs md:text-sm lg:text-base">{job.startDate}</span>
            </div>
            <div className="text-xs sm:text-l md:text-xl lg:text-2xl">{job.title}</div>
            <p>{job.notes}</p>
            <ul className="leading-4 text-xs ml-1 sm:ml-3">
              {job.responsibilities.map((resp) => (
                <li key={resp}>{resp}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
};