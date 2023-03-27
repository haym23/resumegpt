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
import { useState, useEffect } from 'react';
import BorderBox from './BorderBox';

function ContactBox({ updateForm }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');

  function handleChange(event) {
    switch(event.target.id) {
      case 'firstName':
        setFirstName(event.target.value);
        break;
      case 'lastName':
        setLastName(event.target.value);
        break;
      case 'address':
        setAddress(event.target.value);
        break;
      case 'phone':
        setPhone(Number(event.target.value));
        break;
      case 'emailAddress':
        setEmailAddress(event.target.value);
        break;
      default:
        console.log('Unkown target interaction');
        break;
    }
  }

  useEffect(() => {
    updateForm({
      firstName,
      lastName,
      address,
      phone,
      emailAddress
    });
  }, [firstName, lastName, address, phone, emailAddress]);

  return (
    <>
      <BorderBox>
        <Heading size={'md'} alignSelf={'start'} mb={3}>
          Personal Info
        </Heading>
          <>
            <FormControl>
              <Input
                id='firstName'
                borderRadius={0}
                borderTopRadius={7}
                placeholder='first name'
                value={firstName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <Input
                id='lastName'
                borderRadius={0}
                placeholder='last name'
                value={lastName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <Input
                id='emailAddress'
                borderRadius={0}
                placeholder='email address'
                value={emailAddress}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <Input
                id='phone'
                borderRadius={0}
                placeholder='phone number'
                value={phone}
                onChange={handleChange}
              />
            </FormControl>
          </>
      </BorderBox>
    </>
  );
}

export default ContactBox;
