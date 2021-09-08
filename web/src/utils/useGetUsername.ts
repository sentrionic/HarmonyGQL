import { useRouter } from 'next/router';

export const useGetUsername = (): string => {
  const router = useRouter();
  if (router.query.username === undefined) return '';
  return router.query.username.toString();
};
