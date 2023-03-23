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
import React, { useState } from 'react';


function JobForm({ index, onDecrementJobs, updateForm }) {
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
    }, index);
  }

  return (
    <div>
      <Flex>
        <Heading size={'md'} alignSelf={'start'} mb={3}>
          Job {index}
        </Heading>
        <Spacer />
        <CloseButton size='sm' colorScheme='contrast' onClick={(idx) => onDecrementJobs(idx)} />
      </Flex>
      <FormControl >
        <Input
          id='title'
          borderRadius={0}
          borderTopRadius={7}
          placeholder='job title'
          value={formValues.title}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <Input
          id='company'
          borderRadius={0}
          placeholder='company'
          value={formValues.company}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <Input
          id='location'
          borderRadius={0}
          placeholder='location'
          value={formValues.location}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <Textarea
          id='description'
          borderRadius={0}
          placeholder='accomplishments, responsibilities, other notes...'
          value={formValues.responsibilities}
        />
      </FormControl>
    </div>
  )
}

export default JobForm;
