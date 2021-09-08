import React from 'react';
import { FollowMutation, RegularUserFragment, useFollowMutation } from '../generated/graphql';
import gql from 'graphql-tag';
import { ApolloCache } from '@apollo/client';
import { Button } from 'react-bootstrap';

interface FollowButtonProps {
  profile: RegularUserFragment;
}

const updateAfterFollow = (
  value: boolean,
  profileId: number,
  cache: ApolloCache<FollowMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    followers: number;
    followed: boolean;
  }>({
    id: "User:" + profileId,
    fragment: gql`
        fragment _ on User {
            id
            followers
            followed
        }
    `,
  });

  if (data) {
    const newFollowers =
      (data.followers as number) + (!data.followed ? 1 : -1);
    cache.writeFragment({
      id: "User:" + profileId,
      fragment: gql`
          fragment __ on User {
              followers
              followed
          }
      `,
      data: { followers: newFollowers, followed: !value },
    });
  }
};

export const FollowButton: React.FC<FollowButtonProps> = ({ profile }) => {
  const [follow] = useFollowMutation();
  return (
    <Button
      type={ 'submit' }
      size={'lg'}
      style={ {
        width: 'auto',
        height: 'auto',
        fontSize: '12px',
        marginLeft: '10px',
        backgroundColor: profile.followed ? 'red' : ''
      } }
      onClick={ async () => {
        await follow({
          variables: {
            profileId: profile.id,
          },
          update: (cache) => updateAfterFollow(profile.followed, profile.id, cache),
        });
      } }>
      { profile.followed ? 'Unfollow' : 'Follow' }
    </Button>
  );
};
