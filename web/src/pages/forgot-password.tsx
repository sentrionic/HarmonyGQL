import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';
import { Button, FormLabel } from 'react-bootstrap';
import { Layout } from '../components/Layout';

const ForgotPassword: React.FC = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Layout>
      <Formik
        initialValues={ { email: '' } }
        onSubmit={ async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
        } }
      >
        { ({ isSubmitting }) =>
          complete ? (
            <div>
              If an account with that email already exists, we sent you an email
            </div>
          ) : (
            <Form>
              <h3>Forgot Password</h3>

              <div className="form-group">
                <FormLabel>Email</FormLabel>
                <Field name="email" className="form-control" placeholder="Email" />
              </div>

              <Button variant={'primary'} block type="submit" disabled={isSubmitting}>Submit</Button>
            </Form>
          )
        }
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
