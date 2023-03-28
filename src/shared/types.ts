export interface Job {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export const defaultJob: Job = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
}

export interface School {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  degree: string;
  description: string;
}