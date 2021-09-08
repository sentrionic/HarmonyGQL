import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useCreateStoryMutation } from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';
import { Button, Container, Form as BForm, Image, Row } from 'react-bootstrap';
import { NavBar } from '../components/NavBar';
import { toErrorMap } from '../utils/toErrorMap';
import { StorySchema } from '../schemas/story.schema';

const CreateStory: React.FC = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreateStoryMutation();
  const [file, setFile] = useState('');
  return (
    <div>
      <NavBar />
      <Container>
        <Row>
          <div className="col-lg-7 offset-lg-1">
            <Formik
              initialValues={ { caption: '', image: null } }
              validationSchema={StorySchema}
              onSubmit={ async (values, { setErrors }) => {
                const response = await createPost({
                  variables: { input: values },
                  update: (cache) => {
                    cache.evict({ fieldName: 'stories:{}' });
                  },
                });
                if (response.data?.createStory.errors) {
                  setErrors(toErrorMap(response.data.createStory.errors));
                } else if (response.data?.createStory.story) {
                  // worked
                  await router.push('/');
                }
              } }
            >
              { ({ isSubmitting, setFieldValue }) => (
                <Form className={ 'create-form' }>
                  <BForm.Group className="image-group">
                    { file && <Image className="img-fluid image" src={ file } /> }
                  </BForm.Group>
                  <input type="file" className="form-control-file" name="image" accept="image/*" onChange={ (e) => {
                    if (!e.currentTarget.files) return;
                    setFieldValue('image', e.currentTarget.files[0]);
                    setFile(URL.createObjectURL(e.currentTarget.files[0]));
                  } } />

                  <BForm.Group style={ { marginTop: '20px' } }>
                    <BForm.Label>Content</BForm.Label>
                    <Field as={ 'textarea' } className="form-control" rows={ 8 }
                           name={ 'caption' }
                           placeholder="Caption..." required />
                    <ErrorMessage name="caption" component="div" className="error text-danger" />
                  </BForm.Group>

                  <Button variant={'primary'} size={'lg'} block type="submit"
                          disabled={ isSubmitting }>Create Story
                  </Button>
                </Form>
              ) }
            </Formik>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default withApollo({ ssr: false })(CreateStory);
