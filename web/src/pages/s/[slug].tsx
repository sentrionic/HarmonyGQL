import React from 'react';
import { withApollo } from '../../utils/withApollo';
import { Layout } from '../../components/Layout';
import { useGetStoryFromUrl } from '../../utils/useGetStoryFromUrl';
import { useMeQuery } from '../../generated/graphql';
import { NavBar } from '../../components/NavBar';
import {  Container,  Row } from 'react-bootstrap';
import { CommentBox } from '../../components/CommentBox';
import { StoryPost } from '../../components/StoryPost';
import { Footer } from '../../components/Footer';

const Story = ({}) => {
  const { data, error, loading } = useGetStoryFromUrl();
  const { data: meData } = useMeQuery();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{ error.message }</div>;
  }

  if (!data?.getStoryBySlug) {
    return (
      <Layout>
        <div>could not find story</div>
      </Layout>
    );
  }

  const story = data.getStoryBySlug;
  const userId = meData?.me?.id;

  return (
    <div className={'main'}>
      <NavBar />
      <StoryPost story={story} userId={userId} detail={true} />

      <br />

      <Container>
        <Row>
          <div className="card m-auto" style={ { width: '700px' } }>
            <div className="card-footer box">
              <CommentBox storyId={story.id} userId={userId} />
            </div>
          </div>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default withApollo({ ssr: true })(Story);
