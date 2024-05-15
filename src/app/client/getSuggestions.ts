import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

//todo move to dto files
export type Tag = {
  name: string;
  category: string;
  value: number;
  id: string;
};

const useGetSuggestions = () => {
  return useQuery({
    queryKey: ['formula', 'suggestions'],
    queryFn: async () => {
      const response = await axios.get<Array<Tag>>(
        //todo move to const
        'https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete'
      );
      return response.data;
    },
  });
};

export { useGetSuggestions };
