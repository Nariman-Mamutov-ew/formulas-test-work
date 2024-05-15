import {
  QueryClient,
} from '@tanstack/react-query';

const queryClient = new QueryClient()


export * from './getSuggestions';
export {
	queryClient,
};
