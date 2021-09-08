import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useMeQuery, useStoriesQuery } from '../generated/graphql';
import { NavBar } from '../components/NavBar';
import { withApollo } from '../utils/withApollo';
import { Footer } from '../components/Footer';
import { Card, Container, Row, Spinner } from 'react-bootstrap';
import { Wrapper } from '../components/Wrapper';
import { StoryList } from '../components/StoryList';
import { CreateStoryBarContainer } from '../components/CreateStoryBarContainer';

const Index = () => {
  const { data: meData } = useMeQuery();
  const { data, error, loading, fetchMore, variables } = useStoriesQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
  });

  if (!loading && !data) {
    return (
      <Wrapper>
        <div>Something went wrong. Please try again later</div>
        <div>{ error?.message }</div>
      </Wrapper>
    );
  }

  const fetchMoreStories = async () => {
    await fetchMore({
      variables: {
        limit: variables?.limit,
        cursor:
        data?.getStories.stories[data?.getStories.stories.length - 1].createdAt,
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
  } else if (data?.getStories.stories.length == 0) {
    body = (
      <CreateStoryBarContainer>
          <Container className={ 'main' }>
            <Row>
              <Card className="m-auto">
                <Card.Body className="mt-2 mb-2">
                  <Card.Title>Nothing here yet</Card.Title>
                  <Card.Text>There aren't any stories yet. Be the first one!</Card.Text>
                </Card.Body>
              </Card>
            </Row>
          </Container>
      </CreateStoryBarContainer>
    );
  } else {
    body = (
      <InfiniteScroll
        dataLength={ data!!.getStories.stories.length }
        next={ fetchMoreStories }
        hasMore={ data!!.getStories.hasMore }
        loader={ <h4>Loading...</h4> }
      >
        <StoryList stories={ data?.getStories.stories } userId={ meData?.me?.id } />
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

export default withApollo({ ssr: true })(Index);
