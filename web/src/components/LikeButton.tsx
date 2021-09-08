import React from 'react';
import { LikeMutation, StorySnippetFragment, useLikeMutation } from '../generated/graphql';
import gql from 'graphql-tag';
import { ApolloCache } from '@apollo/client';
import { Button } from 'react-bootstrap';

interface LikeButtonProps {
  story: StorySnippetFragment;
}

const updateAfterVote = (
  value: boolean,
  storyId: number,
  cache: ApolloCache<LikeMutation>,
) => {
  const data = cache.readFragment<{
    id: number;
    likes: number;
    liked: boolean;
  }>({
    id: 'Story:' + storyId,
    fragment: gql`
        fragment _ on Story {
            id
            likes
            liked
        }
    `,
  });

  if (data) {
    const newPoints =
      (data.likes as number) + (!data.liked ? 1 : -1);
    cache.writeFragment({
      id: 'Story:' + storyId,
      fragment: gql`
          fragment __ on Story {
              likes
              liked
          }
      `,
      data: { likes: newPoints, liked: !value },
    });
  }
};

export const LikeButton: React.FC<LikeButtonProps> = ({ story }) => {
  const [like] = useLikeMutation();
  return (
    <div className="text-muted" style={ { marginLeft: '5px' } }>
      <Button variant={ 'default' } type="submit" style={ { outline: 'none', boxShadow: 'none' } }
              onClick={ async () => {
                await like({
                  variables: {
                    storyId: story.id,
                  },
                  update: (cache) => updateAfterVote(story.liked, story.id, cache),
                });
              } }>
        { story.liked ?
          <span className="fas fa-heart" style={ { color: 'red' } } />
          :
          <span className="far fa-heart" />
        }
      </Button>
    </div>
  );
};
