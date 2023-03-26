import { Button, Divider, HStack, Link, Text, VStack } from "@chakra-ui/react";
import api from "@wasp/api";
import { FaCoffee, FaGithub, FaTwitter } from "react-icons/fa";

export function CallToAction() {

    const clickHandler = async() => {
      const location = await api.get('/getLocation');
      if (location.data) {
        window.open(location.data, '_blank')
      } else {
        alert("Sorry, something went wrong. Please try again.")
      }
    }

    return (
      <VStack width={['sm', 'lg', 'xl']} mt={10} textAlign='center' gap={4}>
        <Divider />
        <HStack>
          <Text color='text-contrast-sm' fontSize='sm'>
            This Project is Open-Source! Check Out the Code on
          </Text>
          <Link
            href='https://github.com/haym23/resumegpt'
            color='purple.300'
            target='_blank'
            display='grid'
            gridTemplateColumns='auto 1fr'
            gridGap={2}
          >
            <FaGithub />
            GitHub
          </Link>
        </HStack>
        <HStack>
          <Button onClick={clickHandler} leftIcon={<FaCoffee />} size='sm'>
            Buy Me a Coffee
          </Button>
          <a href='https://twitter.com/haym23' target='_blank'>
            <Button colorScheme='twitter' leftIcon={<FaTwitter />} size='sm'>
              Follow me @haym23
            </Button>
          </a>
        </HStack>
      </VStack>
    );
}
