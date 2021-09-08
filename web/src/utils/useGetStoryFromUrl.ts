import { useStorySlugQuery } from '../generated/graphql';
import { useGetSlug } from './useGetSlug';

export const useGetStoryFromUrl = () => {
  const slug = useGetSlug();
  return useStorySlugQuery({
    variables: {
      slug,
    },
  });
};
