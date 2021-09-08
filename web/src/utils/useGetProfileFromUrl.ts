import { useProfileNameQuery } from '../generated/graphql';
import { useGetUsername } from './useGetUsername';

export const useGetProfileFromUrl = () => {
  const username = useGetUsername();
  return useProfileNameQuery({
    variables: {
      username: username,
    },
  });
};
