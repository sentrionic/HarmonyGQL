import React from 'react';
import { Image } from 'react-bootstrap';

export const CreateStoryBar: React.FC = () =>
  <>
    <Image className="img-fluid d-block m-auto pb-2" src="/icon.png" width="72" height="72" />
    <p className="lead">Harmony <br /> A Place to post your Stories</p>
    <p className="m-auto">
      <a className="btn btn-primary" href="/create-story">Create Story</a>
    </p>
  </>;
