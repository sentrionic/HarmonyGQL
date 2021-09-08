import { createWithApollo } from './createWithApollo';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { PaginatedComments, PaginatedStories } from '../generated/graphql';
import { NextPageContext } from 'next';
import { createUploadLink } from 'apollo-upload-client';

const storyQueryCache = {
  keyArgs: [],
  merge(
    existing: PaginatedStories | undefined,
    incoming: PaginatedStories,
  ): PaginatedStories {
    return {
      ...incoming,
      stories: [...(existing?.stories || []), ...incoming.stories],
    };
  },
};

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    link: createUploadLink({
      credentials: 'include', uri: process.env.NEXT_PUBLIC_API_URL as string,
      headers: {
        cookie:
          (typeof window === 'undefined'
            ? ctx?.req?.headers.cookie
            : undefined) || '',
      },
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getStories: storyQueryCache,
            getFollowedStories: storyQueryCache,
            getLikedStories: storyQueryCache,
            getProfileStories: storyQueryCache,
            getStoryComments: {
              keyArgs: [],
              merge(
                existing: PaginatedComments | undefined,
                incoming: PaginatedComments,
              ): PaginatedComments {
                return {
                  ...incoming,
                  comments: [...(existing?.comments || []), ...incoming.comments],
                };
              },
            }
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
