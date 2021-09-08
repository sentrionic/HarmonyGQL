import React from 'react';
import { Button, Card, Container, Row, Spinner } from 'react-bootstrap';
import { useProfileStoriesQuery } from '../generated/graphql';
import { AlbumImage } from './AlbumImage';

interface ProfileStoryListProps {
  profileId: number;
}

export const ProfileStoryList: React.FC<ProfileStoryListProps> = ({ profileId }) => {

  const { data, loading, fetchMore, variables } = useProfileStoriesQuery({
    variables: {
      profile: profileId,
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const fetchMoreStories = async () => {
    await fetchMore({
      variables: {
        limit: variables?.limit,
        cursor: data?.getProfileStories?.stories[data?.getProfileStories.stories.length - 1].createdAt,
        profileId,
      },
    });
  };

  let body = null;

  if (!data && loading) {
    body = (
      <Container className={ 'main' }>
        <Row className={ 'm-auto' }>
          <Spinner animation={ 'border' } />
        </Row>
      </Container>
    );
  } else if (data?.getProfileStories.stories.length == 0) {
    body = (
      <Container style={{ height: '100%', minHeight: '40vh' }}>
        <Row>
          <Card className="m-auto">
            <Card.Body className="mt-2 mb-2">
              <Card.Title>Nothing here yet</Card.Title>
              <Card.Text>This user hasn't posted anything yet!</Card.Text>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    );
  } else {
    body = (
        data?.getProfileStories.stories.map((s) =>
          <AlbumImage story={ s } key={ s.id } />,
        )
    );
  }

  return (
    <div className="album py-5">
      <h3 className="mb-3 font-weight-normal container mt-4 p-4">Stories:</h3>
      <Container>
        <Row>
          { body }
          { data?.getProfileStories.hasMore &&
            <Button className={ 'm-auto' } type={ 'submit' } onClick={ fetchMoreStories }>Load More</Button>
          }
        </ Row>
      </ Container>
    </div>
  );
};
