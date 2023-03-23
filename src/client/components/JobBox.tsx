import {
  Flex,
  Spacer,
  Heading,
  Text,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  FormHelperText,
  Code,
  Checkbox,
  Spinner,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  CloseButton
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getJob from '@wasp/queries/getJob';
import generateCoverLetter from '@wasp/actions/generateCoverLetter';
import createJob from '@wasp/actions/createJob';
import updateCoverLetter from '@wasp/actions/updateCoverLetter';
import * as pdfjsLib from 'pdfjs-dist';
import { useState, useEffect, useRef } from 'react';
import { CoverLetter, Job } from '@wasp/entities';
import BorderBox from './BorderBox';
import { convertToSliderValue, convertToSliderLabel } from './CreativitySlider';
import type { CoverLetterPayload } from './types';

function JobBox( { jobs, onAddJob, onDeleteJob } ) {
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [jobToFetch, setJobToFetch] = useState<string | null>(null);
  const [isCoverLetterUpdate, setIsCoverLetterUpdate] = useState<boolean>(false);
  const [isCompleteCoverLetter, setIsCompleteCoverLetter] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState(30);

  const { data: job, isLoading: isJobLoading } = useQuery<{ id: string | null }, Job>(
    getJob,
    { id: jobToFetch },
    { enabled: !!jobToFetch }
  );

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm();

  const history = useHistory();
  const loadingTextRef = useRef<HTMLDivElement>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const jobIdParam = urlParams.get('job');

  useEffect(() => {
    if (jobIdParam) {
      setJobToFetch(jobIdParam);
      setIsCoverLetterUpdate(true);
      resetJob();
    } else {
      setIsCoverLetterUpdate(false);
      reset({
        title: '',
        company: '',
        location: '',
        description: '',
      });
    }
  }, [jobIdParam, job]);

  useEffect(() => {
    resetJob();
  }, [job]);

  useEffect(() => {
    buildJobForms();
  }, [jobs]);

  function resetJob() {
    if (job) {
      reset({
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
      });
    }
  }

  // pdf to text parser
  async function onFileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files == null) {
      return;
    }

    setPdfText(null);
    const pdfFile = event.target.files[0];

    // Read the file using file reader
    const fileReader = new FileReader();

    fileReader.onload = function () {
      // turn array buffer into typed array
      if (this.result == null || !(this.result instanceof ArrayBuffer)) {
        return;
      }
      const typedarray = new Uint8Array(this.result);

      // pdfjs should be able to read this
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
      const loadingTask = pdfjsLib.getDocument(typedarray);
      let textBuilder: string = '';
      loadingTask.promise.then(async (pdf) => {
        // Loop through each page in the PDF file
        for (let i = 1; i <= pdf.numPages; i++) {
          // Get the text content for the page
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const text = content.items
            .map((item: any) => {
              if (item.str) {
                return item.str;
              }
              return '';
            })
            .join(' ');
          textBuilder += text;
        }
        setPdfText(textBuilder);
      });
    };
    // Read the file as ArrayBuffer
    fileReader.readAsArrayBuffer(pdfFile);
  }

  async function onSubmit(values: any): Promise<void> {
    try {
      const job = (await createJob(values)) as Job;
      let payload: CoverLetterPayload;

      const creativityValue = convertToSliderValue(sliderValue);

      if (!pdfText) {
        alert('Please upload a pdf file');
        throw new Error('Please upload a pdf file');
      } else {
        payload = {
          jobId: job.id,
          title: job.title,
          content: pdfText,
          description: job.description,
          isCompleteCoverLetter,
          includeWittyRemark: values.includeWittyRemark,
          temperature: creativityValue,
        };
      }
      setLoadingText();
      const coverLetter = (await generateCoverLetter(payload)) as CoverLetter;
      history.push(`/cover-letter/${coverLetter.id}`);
    } catch (error) {
      alert('Something went wrong, please try again');
      console.error(error);
    }
  }

  async function onUpdate(values: any): Promise<(Job & { coverLetter: CoverLetter[] }) | undefined> {
    try {
      if (!job) {
        throw new Error('Job not found');
      }

      const creativityValue = convertToSliderValue(sliderValue);

      const payload = {
        id: job.id,
        description: values.description,
        content: pdfText,
        isCompleteCoverLetter,
        temperature: creativityValue,
      };

      setLoadingText();

      const updatedJob = (await updateCoverLetter(payload)) as Job & { coverLetter: CoverLetter[] };

      if (updatedJob.coverLetter.length === 0) {
        throw new Error('Cover letter not found');
      }
      history.push(`/cover-letter/${updatedJob.coverLetter[updatedJob.coverLetter.length - 1].id}`);

      return updatedJob;
    } catch (error) {
      alert('Something went wrong, please try again');
      console.error(error);
    }
  }

  async function setLoadingText() {
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = 'patience, my friend...');
    }, 1000);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = 'almost done...');
    }, 8000);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = '🧘...');
    }, 12000);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = '');
    }, 35000);
  }

  const incrementJobs = () => {
    onAddJob();
  }

  const decrementJobs = (index) => {
    onDeleteJob(index);
  }

  const buildJobForms = () => {
    console.log('Building job forms...');
    let forms = [];
    for (let i = 0; i < jobs; ++i) {
      forms.push(<JobForm index={i}/>);
    }

    return forms;
  }

  // TODO is this needed?
  const showForm = true;

  // TODO come back to this for loading screen
  const showSpinner = false;

  function JobForm({ index }) {
    return (
      <div>
        <Flex>
          <Heading size={'md'} alignSelf={'start'} mb={3}>
            Job {index}
          </Heading>
          <Spacer />
          <CloseButton size='sm' colorScheme='contrast' onClick={() => decrementJobs(index)} />
        </Flex>
        <FormControl isInvalid={!!formErrors.title}>
          <Input
            id='title'
            borderRadius={0}
            borderTopRadius={7}
            placeholder='job title'
            {...register('title', {
              required: 'This is required',
              minLength: {
                value: 2,
                message: 'Minimum length should be 2',
              },
            })}
          />
          <FormErrorMessage>{formErrors.title && formErrors.title.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!formErrors.company}>
          <Input
            id='company'
            borderRadius={0}
            placeholder='company'
            {...register('company', {
              required: 'This is required',
              minLength: {
                value: 1,
                message: 'Minimum length should be 1',
              },
            })}
          />
          <FormErrorMessage>{formErrors.company && formErrors.company.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!formErrors.location}>
          <Input
            id='location'
            borderRadius={0}
            placeholder='location'
            {...register('location', {
              required: 'This is required',
              minLength: {
                value: 2,
                message: 'Minimum length should be 2',
              },
            })}
            disabled={isCoverLetterUpdate}
          />
          <FormErrorMessage>{formErrors.location && formErrors.location.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!formErrors.description}>
          <Textarea
            id='description'
            borderRadius={0}
            placeholder='accomplishments, responsibilities, other notes...'
            {...register('description', {
              required: 'This is required',
            })}
          />
          <FormErrorMessage>{formErrors.description && formErrors.description.message}</FormErrorMessage>
        </FormControl>
      </div>
    )
  }

  return ( 
    <div>
      <BorderBox>
      <Flex style={{ width: '100%' }}>
        <Heading size={'md'} alignSelf={'start'} mb={3}>
          Job Info {isCoverLetterUpdate && <Code ml={1}>Editing...</Code>}
        </Heading>
        <Spacer />
        <Button size='sm' colorScheme='contrast' onClick={incrementJobs}>
            <label htmlFor='addJob'>Add Job</label>
        </Button>
      </Flex>
        {showSpinner && <Spinner />}
        {jobs.map((val, i) => {
          return (
            <JobForm index={i}/>
          )
        })}
      </BorderBox>
    </div>
  );
}

export default JobBox;
