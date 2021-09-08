import React from 'react';
import { StorySnippetFragment } from '../generated/graphql';

interface AlbumImageProps {
  story: StorySnippetFragment;
}

export const AlbumImage: React.FC<AlbumImageProps> = ({ story }) => {

  return (
    <div className="col-md-4">
      <div className="card mb-4 box-shadow">
        <a href={ `/s/${ story.slug }` }>
          <img className="card-img-top crop" src={ story.image } alt={ story.slug } />
        </a>
      </div>
    </div>
  );
};
