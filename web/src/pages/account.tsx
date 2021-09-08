import React, { useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import {
  MeDocument,
  MeQuery,
  useMeQuery,
  useUpdateProfileImageMutation,
  useUpdateUserMutation,
} from '../generated/graphql';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toErrorMap } from '../utils/toErrorMap';
import { withApollo } from '../utils/withApollo';
import { UserSchema } from '../schemas/user.schema';
import { Button } from 'react-bootstrap';
import { useIsAuth } from '../utils/useIsAuth';

const Account = ({}) => {
  useIsAuth();
  const { data, error, loading } = useMeQuery();
  const [updateAccount] = useUpdateUserMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const inputFile = useRef(null);

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

  if (!data?.me) {
    return (
      <Layout>
        <div>There was an error fetching your account info</div>
      </Layout>
    );
  }

  const { me } = data;

  return (
    <Layout>
      <div className={ 'form-signin' }>
        <Formik
          initialValues={ {
            displayName: me?.displayName,
            website: me?.website,
            description: me?.description,
            username: me?.username,
            email: me?.email,
          } }
          validationSchema={ UserSchema }
          onSubmit={ async (values, { setErrors }) => {
            const response = await updateAccount({
              variables: { input: values },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: 'Query',
                    me: data?.updateUser.user,
                  },
                });
              },
            });
            if (response.data?.updateUser.errors) {
              setErrors(toErrorMap(response.data.updateUser.errors));
            } else if (response.data?.updateUser.user) {
              setShowSuccess(true);
            }
          } }
        >
          { ({ isSubmitting }) => (
            <Form>
              { showSuccess && <p id="update-response">Successfully updated your profile!</p> }
              <h1 className="h3 mb-3 font-weight-normal" style={ { textAlign: 'center' } }>Account</h1>

              <Formik initialValues={ { image: me?.image } }
                      onSubmit={ async (values, { setErrors, setFieldValue }) => {
                        const response = await updateProfileImage({
                          variables: values,
                          update: (cache, { data }) => {
                            cache.writeQuery<MeQuery>({
                              query: MeDocument,
                              data: {
                                __typename: 'Query',
                                me: data?.updateProfileImage.user,
                              },
                            });
                          },
                        });
                        if (response.data?.updateProfileImage.errors) {
                          setErrors(toErrorMap(response.data.updateProfileImage.errors));
                        } else if (response.data?.updateProfileImage.user) {
                          setShowSuccess(true);
                          setFieldValue('image', response.data.updateProfileImage.user.image);
                        }
                      } }
              >
                { ({ values, setFieldValue, submitForm, isSubmitting }) => (
                  <div>
                    <div className="form-group image-group" id="id_image_group">

                      <img className="img-fluid image" style={ { width: '120px', borderRadius: '50px' } } alt="Avatar"
                           src={ values.image } onClick={ () => {
                        //@ts-ignore
                        inputFile.current.click();
                      } } hidden={ isSubmitting } />
                    </div>
                    <input type="file" name="image" accept="image/*" ref={ inputFile }
                           hidden
                           onChange={ async (e) => {
                             if (!e.currentTarget.files) return;
                             setFieldValue('image', e.currentTarget.files[0]);
                             await submitForm();
                           } } />
                  </div>
                ) }
              </Formik>

              <div className="form-group row">
                <div className="col-12">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-address-card" />
                      </div>
                    </div>
                    <Field type="text" name="displayName" className="form-control"
                           placeholder="Display Name" />
                    <ErrorMessage name="displayName" component="div" className="error text-danger" />
                  </div>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-12">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-cloud" />
                      </div>
                    </div>
                    <Field type="text" name="website" className="form-control" placeholder="Website" />
                    <ErrorMessage name="website" component="div" className="error text-danger" />
                  </div>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-12">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-info-circle" />
                      </div>
                    </div>
                    <Field type="text" name="description" className="form-control"
                           placeholder="Biography" />
                    <ErrorMessage name="description" component="div" className="error text-danger" />
                  </div>
                </div>
              </div>

              <br />

              <h1 className="h3 mb-3 font-weight-normal">Personal Information</h1>

              <div className="form-group row">
                <div className="col-12">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-envelope" />
                      </div>
                    </div>
                    <Field type="email" name="email" className="form-control"
                           placeholder="Email address"
                           required />
                    <ErrorMessage name="email" component="div" className="error text-danger" />
                  </div>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-12">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-user" />
                      </div>
                    </div>
                    <Field type="text" id="inputUsername" name="username" className="form-control"
                           placeholder="Username"
                           required />
                    <ErrorMessage name="email" component="div" className="error text-danger" />
                  </div>
                </div>
              </div>

              <br />

              <div className="d-flex flex-column">
                <a className="m-auto" href="/change-password">Change Password</a>
              </div>

              <br />

              <Button variant={ 'primary' } block size={ 'lg' } type="submit" disabled={ isSubmitting }>Save
                Changes</Button>
            </Form>
          ) }
        </Formik>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Account);
