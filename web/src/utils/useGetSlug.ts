import { useRouter } from 'next/router';

export const useGetSlug = (): string => {
  const router = useRouter();
  if (router.query.slug === undefined) return '';
  return router.query.slug.toString();
};
