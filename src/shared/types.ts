export interface ISchoolPayload {
  name: string;
  location: string;
  degree: string;
  major?: string;
  gpa: number;
  startDate?: string;
  endDate?: string;
  notes?: string;
  accomplishments: string[];
}

export interface IJobPayload {
  title: string;
  company: string;
  location: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  responsibilities: string[];
}

export interface IResumePayload {
  name: string;
  emailAddress: string;
  phone: string;
  address: string;
  schools: ISchoolPayload[];
  jobs: IJobPayload[];
}