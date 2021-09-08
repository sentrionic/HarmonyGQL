import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { CreateStoryBar } from './CreateStoryBar';

export const CreateStoryBarContainer: React.FC = ({ children }) => {
  return (
    <>
      <Container className={ 'main' }>
        <Row>
          <div className="left-column col-lg-7 offset-lg-1">
            <div className="d-lg-none mb-3">
              <div className="card m-auto d-flex flex-column p-3">
                <CreateStoryBar />
              </div>
            </div>
            { children }
          </div>

          <div className="right-column col-lg-3 d-lg-flex d-none flex-column">
            <div className="card create-post-bar d-flex flex-column p-3">
              <CreateStoryBar />
            </div>
          </div>

        </Row>
      </Container>
    </>
  );
};
