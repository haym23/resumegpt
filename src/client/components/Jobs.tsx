
import { IJobPayload } from '../../shared/types';
import { SectionWrapper } from './SectionWrapper';

interface JobsProps {
  jobs: IJobPayload[]
}

export const Jobs = ({ jobs }: JobsProps) => {
  return (
    <SectionWrapper title="Work Experience">
      <ul className="ml-2">
        {jobs.map((job, i) => (
          <li key={job.company} className={i % 2 ? `mt-1` : `mt-half`}>
            <div className="flex">
              <div className="text-xl">
                {job.company} - {job.location}
              </div>
              <span className="ml-auto text-muted">{job.startDate}</span>
            </div>
            <h4>{job.title}</h4>
            <p>{job.notes}</p>
            <ul className="ml-3">
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