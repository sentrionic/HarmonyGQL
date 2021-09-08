import React from 'react';
import { useLikedStoriesQuery, useMeQuery } from '../generated/graphql';
import { NavBar } from '../components/NavBar';
import { withApollo } from '../utils/withApollo';
import { Footer } from '../components/Footer';
import { Card, Container, Row, Spinner } from 'react-bootstrap';
import { Wrapper } from '../components/Wrapper';
import { useIsAuth } from '../utils/useIsAuth';
import { StoryList } from '../components/StoryList';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CreateStoryBarContainer } from '../components/CreateStoryBarContainer';

const Liked = () => {
  useIsAuth();
  const { data: meData } = useMeQuery();
  const { data, error, loading, fetchMore, variables } = useLikedStoriesQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <Wrapper>
        <div>Query Failed</div>
        <div>{ error?.message }</div>
      </Wrapper>
    );
  }

  const fetchMoreStories = async () => {
    await fetchMore({
      variables: {
        limit: variables?.limit,
        cursor:
        data?.getLikedStories.stories[data?.getLikedStories.stories.length - 1].createdAt,
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
  } else if (data?.getLikedStories.stories.length == 0) {
    body = (
      <CreateStoryBarContainer>
        <Container className={ 'main' }>
          <Row>
            <Card className="m-auto">
              <Card.Body className="mt-2 mb-2">
                <Card.Title>Nothing here yet</Card.Title>
                <Card.Text>You haven't liked anything yet</Card.Text>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </CreateStoryBarContainer>
    );
  } else {
    body = (
      <InfiniteScroll
        dataLength={ data!!.getLikedStories.stories.length }
        next={ fetchMoreStories }
        hasMore={ data!!.getLikedStories.hasMore }
        loader={ <h4>Loading...</h4> }
      >
        <StoryList stories={ data?.getLikedStories.stories } userId={ meData?.me?.id } />
      </InfiniteScroll>
    );
  }

  return (
    <div>
      <NavBar />
      { body }
      <Footer />
    </div>
  );
};

export default withApollo({ ssr: false })(Liked);
