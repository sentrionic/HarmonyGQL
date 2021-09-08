import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withApollo } from '../utils/withApollo';
import NextLink from 'next/link';
import { Button, FormLabel } from 'react-bootstrap';
import { Layout } from '../components/Layout';

const Login: React.FC = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Layout>
      <Formik
        initialValues={ { usernameOrEmail: '', password: '' } }
        onSubmit={ async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: 'getStories:{}' });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') {
              await router.push(router.query.next);
            } else {
              // worked
              await router.push('/');
            }
          }
        } }
      >
        { ({ isSubmitting }) => (
          <Form>
            <h3>Login</h3>

            <div className="form-group">
              <FormLabel>Email or Username</FormLabel>
              <Field name="usernameOrEmail" className="form-control" placeholder="Email or Username" />
              <ErrorMessage name="usernameOrEmail" component="div" className="error text-danger" />
            </div>
            <div className="form-group">
              <FormLabel>Password</FormLabel>
              <Field name="password" type="password" className="form-control" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="error text-danger" />
            </div>

            <Button variant={ 'primary' } block type="submit" disabled={ isSubmitting }>Login</Button>
            <NextLink href="/forgot-password">
              <p className="forgot-password text-right">
                Forgot <a href="/forgot-password">Password?</a>
              </p>
            </NextLink>
          </Form>
        ) }
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Login);
