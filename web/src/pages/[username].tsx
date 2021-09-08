import React from 'react';
import { withApollo } from '../utils/withApollo';
import { useGetProfileFromUrl } from '../utils/useGetProfileFromUrl';
import { Layout } from '../components/Layout';
import { Container, Row, Button } from 'react-bootstrap';
import {
  useMeQuery,
} from '../generated/graphql';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { FollowButton } from '../components/FollowButton';
import { ProfileStoryList } from '../components/ProfileStoryList';

const Profile = ({}) => {
  const { data, error, loading } = useGetProfileFromUrl();
  const { data: meData } = useMeQuery();

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{ error.message }</div>;
  }

  if (!data?.getProfileByUsername) {
    return (
      <Layout>
        <div>Could not find User</div>
      </Layout>
    );
  }

  const profile = data?.getProfileByUsername;

  return (
    <div>
      <NavBar />
      <Container style={ { paddingTop: '30px' } }>
        <Row>
          <div className=" col-sm-5 text-right" style={ { marginRight: '20px' } }>
            <figure>
              <img src={ profile.image } alt={ profile.image } className="img-circle img-responsive"
                   style={ { width: '150px', borderRadius: '50%' } } />
            </figure>
          </div>
          <div className="col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6" style={ { paddingTop: '10px' } }>
            <div className="well profile">
              <div className="col-sm-12">
                <div className="col-xs-12 col-sm-12">
                  <h2>{ profile.username }
                  { profile.id === meData?.me?.id ?
                      <a href="/account">
                        <Button size={'lg'}
                          style={ { width: 'auto', height: 'auto', fontSize: '12px', marginLeft: '10px' } }>Edit
                        </Button>
                      </a>
                    : (
                      <FollowButton profile={profile} />
                    )
                  }
                  </h2>
                  <span>
                    <ul className={'profile-ul'}>
                      <li className={'profile-li'}><strong>{ profile.posts } </strong> Posts</li>
                      <li className={'profile-li'}><strong>{ profile.followers }</strong> Followers</li>
                      <li className={'profile-li'}><strong>{ profile.following }</strong> Following</li>
                    </ul>
                  </span>
                  <p className={'profile-p'}><strong>{ profile.displayName }</strong></p>
                  <p className={'profile-p'}>{ profile.description } </p>
                  <p className={'profile-p'}>{ profile.website }</p>
                </div>
              </div>
            </div>
          </div>
        </Row>
      </Container>
      <ProfileStoryList profileId={profile.id} />
      <Footer />
    </div>
  );
};

export default withApollo({ ssr: true })(Profile);
