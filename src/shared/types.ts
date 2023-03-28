export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export const defaultJob: Job = {
  id: '',
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
}

export interface School {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  degree: string;
  description: string;
}

export const defaultSchool: School = {
  id: '',
  name: '',
  location: '',
  startDate: '',
  endDate: '',
  degree: '',
  description: '',
}