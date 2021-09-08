import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withApollo } from '../utils/withApollo';
import NextLink from 'next/link';
import { RegisterSchema } from '../schemas/user.schema';
import { Button } from 'react-bootstrap';
import { Layout } from '../components/Layout';

const Register: React.FC = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Layout>
      <Formik
        initialValues={ { email: '', username: '', password: '', confirmPassword: '' } }
        validationSchema={RegisterSchema}
        onSubmit={ async (values, { setErrors }) => {
          const response = await register({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.register.user,
                },
              });
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // worked
            await router.push('/');
          }
        } }
      >
        { ({ isSubmitting  }) => (
          <Form>
            <h3>Register User</h3>

            <div className="form-group">
              <label>Username</label>
              <Field name="username"  className="form-control" placeholder="Username" />
              <ErrorMessage name="username" component="div" className="error text-danger" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <Field name="email"  className="form-control" placeholder="Email" autoComplete={'email'}/>
              <ErrorMessage name="email" component="div" className="error text-danger" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <Field name="password" type="password" autoComplete={'new-password'} className="form-control" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="error text-danger" />
              <Field name="confirmPassword" type="password" className="form-control my-1" placeholder="Confirm Password" autoComplete={'new-password'} />
              <ErrorMessage name="confirmPassword" component="div" className="error text-danger" />
            </div>

            <Button variant={'primary'} block type="submit" disabled={isSubmitting}>Submit</Button>
            <NextLink href="/login">
              <p className="forgot-password text-right">
                Already have an account? Click <a href="/login">here!</a>
              </p>
            </NextLink>
          </Form>
        ) }
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Register);
