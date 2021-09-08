import React from 'react';
import { StorySnippetFragment } from '../generated/graphql';
import { StoryPost } from './StoryPost';
import { CreateStoryBarContainer } from './CreateStoryBarContainer';

interface StoryListProps {
  stories: StorySnippetFragment[] | undefined;
  userId: number | undefined;
}

export const StoryList: React.FC<StoryListProps> = ({ stories, userId }) => {

  return (
    <CreateStoryBarContainer>
      { stories?.map((s) => (
        <div className="blog-post-container" key={ s.id }>
          <StoryPost story={ s } userId={ userId } />
        </div>
      )) }
    </CreateStoryBarContainer>
  );
};
