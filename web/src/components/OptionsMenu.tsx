import React, { useState } from 'react';
import { StorySnippetFragment, useDeletePostMutation } from '../generated/graphql';
import { Button, Modal } from 'react-bootstrap';
import { useRouter } from 'next/router';

interface OptionsMenuProps {
  story: StorySnippetFragment;
  detail?: boolean;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({ story, detail }) => {

  const [deleteStory] = useDeletePostMutation();
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="navbar-nav dropdown d-xl-flex d-lg-flex d-md-flex d-sm-none d-none ml-auto">
        <a className="nav-link text-dark" style={ { cursor: 'pointer' } }
           id="navbarDropdownMenuLink"
           data-toggle="dropdown" aria-haspopup="true"
           aria-expanded="false">
          <i className="fa fa-ellipsis-v ml-auto" />
        </a>
        <div className="dropdown-menu dropdown-primary mr-lg-5 mr-md-5"
             aria-labelledby="navbarDropdownMenuLink">
          <p className="dropdown-item" style={ { cursor: 'pointer' } } onClick={ () => handleShow() }>Delete</p>
        </div>
      </div>

      <Modal show={ show } onHide={ handleClose }>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this story?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ handleClose }>Cancel</Button>
          <Button variant="primary" style={ { backgroundColor: 'red' } }
            onClick={ async () => {
              const response = await deleteStory({
                variables: { id: story.id },
                update: (cache) => {
                  cache.evict({ id: 'Story:' + story.id });
                },
              });
              if (response && detail) {
                await router.push('/');
              }
            } }>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
