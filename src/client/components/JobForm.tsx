import {
  Flex,
  Spacer,
  Heading,
  FormControl,
  Input,
  Textarea,
  CloseButton
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

function JobForm({ index, onDecrementJobs, updateForm }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [responsibilities, setResponsibilities] = useState([]);


  function handleChange(event) {
    switch(event.target.id) {
      case 'title':
        setTitle(event.target.value);
        break;
      case 'company':
        setCompany(event.target.value);
        break;
      case 'location':
        setLocation(event.target.value);
        break;
      case 'responsibilities':
        setResponsibilities([event.target.value as string]);
        break;
      default:
        console.log('Unkown target interaction');
        break;
    }
  }

  useEffect(() => {
    updateForm({
      title,
      location,
      company,
      responsibilities: [responsibilities],
    }, index);
  }, [title, location, company, responsibilities])

  return (
    <>
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
          value={title}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <Input
          id='company'
          borderRadius={0}
          placeholder='company'
          value={company}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <Input
          id='location'
          borderRadius={0}
          placeholder='location'
          value={location}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <Textarea
          id='responsibilities'
          borderRadius={0}
          placeholder='accomplishments, responsibilities, other notes...'
          value={responsibilities}
          onChange={handleChange}
        />
      </FormControl>
    </>
  )
}

export default JobForm;
