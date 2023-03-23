import {
  HStack,
  VStack,
  Heading,
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

function ContactBox({ updateForm }) {
  const [formValues, setFormValues] = useState({});

  function handleChange(event) {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [event.target.id]: event.target.value,
    }));

    updateForm({
      formValues: {
        ...formValues,
      }
    });
  }

  return (
    <div>
      <BorderBox>
        <Heading size={'md'} alignSelf={'start'} mb={3}>
          Personal Info
        </Heading>
          <div>
            <FormControl>
              <Input
                id='firstName'
                borderRadius={0}
                borderTopRadius={7}
                placeholder='first name'
                value={formValues.firstName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <Input
                id='lastName'
                borderRadius={0}
                placeholder='last name'
                value={formValues.lastName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <Input
                id='emailAddress'
                borderRadius={0}
                placeholder='email address'
                value={formValues.emailAddress}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <Input
                id='phoneNumber'
                borderRadius={0}
                placeholder='phone number'
                value={formValues.phoneNumber}
                onChange={handleChange}
              />
            </FormControl>
          </div>
      </BorderBox>
    </div>
  );
}

export default ContactBox;
