import React from 'react';
import { RegularCommentFragment } from '../generated/graphql';
import { getDate } from '../utils/getDate';

interface CommentProps {
  comment: RegularCommentFragment;
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {

  return (
    <li className="media" key={comment.id}>
      <a href={ `/${ comment.author.username }`} className="pull-left">
        <img src={ comment.author.image } alt="" className="img-circle" />
      </a>
      <div className="media-body">
        <span className="text-muted pull-right">
            <small className="text-muted">{ getDate(comment.createdAt) }</small>
        </span>
        <strong>
          <a href={ `/${ comment.author.username }` }>
            { comment.author.username }
          </a>
        </strong>
        <p>
          { comment.text }
        </p>
      </div>
    </li>
  );
};
