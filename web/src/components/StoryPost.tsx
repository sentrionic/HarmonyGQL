import React from 'react';
import { Card, Container, Image, Row } from 'react-bootstrap';
import { StorySnippetFragment } from '../generated/graphql';
import { LikeButton } from './LikeButton';
import { OptionsMenu } from './OptionsMenu';
import { getDate } from '../utils/getDate';

interface StoryPostProps {
  story: StorySnippetFragment;
  userId: number | undefined;
  detail?: boolean;
}

export const StoryPost: React.FC<StoryPostProps> = ({ story, userId, detail }) => {

  return (
    <Container>
      <Row>
        <Card className="m-auto shadow-sm">
          <Card.Header className="box">
            <Image className="img-fluid d-block" style={ { borderRadius: '50px', marginRight: '15px' } }
                   src={ story.author.image } width="40" height="40" />
            <Card.Title>
              <a className="text-dark" style={ { cursor: 'pointer' } }
                 href={ story.author.username }>{ story.author.username }
              </a>
            </Card.Title>
            { userId && story.author.id == userId && OptionsMenu({ story, detail }) }
          </Card.Header>
          { !detail ?
            <a href={ `s/${ story.slug }` }>
              <Card.Img variant={ 'top' } src={ story.image } />
            </a> : <Card.Img variant={ 'top' } src={ story.image } />
          }
          <LikeButton story={ story } />
          <Card.Body>
            <Card.Text>{ story.likes } { story.likes == 1 ? 'like' : 'likes' }</Card.Text>
            <Card.Text>
              <b>{ story.author.username }</b>{ ' ' }
              { detail ? story.caption : story.textSnippet }
            </Card.Text>
          </Card.Body>
          <Card.Footer className="text-muted">
            Posted { getDate(story.createdAt) }
          </Card.Footer>
        </Card>
      </Row>
    </Container>
  );
};
