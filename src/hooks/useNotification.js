import { useToast } from '@chakra-ui/react';

const useNotification = () => {
  const toast = useToast();

  const showNotification = (title, description, status = 'info') => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return showNotification;
};

export default useNotification;