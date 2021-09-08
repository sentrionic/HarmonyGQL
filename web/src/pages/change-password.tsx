import React from 'react';
import { NextPage } from 'next';
import { Wrapper } from '../components/Wrapper';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { Button, FormLabel } from 'react-bootstrap';
import { MeDocument, MeQuery, useChangePasswordMutation } from '../generated/graphql';
import { ChangePasswordSchema } from '../schemas/user.schema';
import { withApollo } from '../utils/withApollo';
import { toErrorMap } from '../utils/toErrorMap';
import { useIsAuth } from '../utils/useIsAuth';

const ChangePassword: NextPage = () => {
  useIsAuth();
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();

  return (
    <Wrapper>
      <Formik
        initialValues={ { newPassword: '', confirmNewPassword: '', currentPassword: '' } }
        validationSchema={ ChangePasswordSchema }
        onSubmit={ async (values, { setErrors }) => {
          const response = await changePassword({
            variables: { input: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.changePassword.user,
                },
              });
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            // worked
            await router.push('/account');
          }
        } }
      >
        { ({ isSubmitting }) => (
          <Form>
            <h3>Change Password</h3>

            <div className="form-group">
              <FormLabel>Current Password</FormLabel>
              <Field name="currentPassword" type="password" className="form-control" placeholder="Current Password" />
              <ErrorMessage name="currentPassword" component="div" className="error text-danger" />
            </div>

            <div className="form-group">
              <FormLabel>New Password</FormLabel>
              <Field name="newPassword" type="password" className="form-control" placeholder="New Password" />
              <ErrorMessage name="newPassword" component="div" className="error text-danger" />
            </div>
            <div className="form-group">
              <FormLabel>Confirm New Password</FormLabel>
              <Field name="confirmNewPassword" type="password" className="form-control"
                     placeholder="Confirm New Password" />
              <ErrorMessage name="confirmNewPassword" component="div" className="error text-danger" />
            </div>
            <Button variant={ 'primary' } block type="submit" disabled={ isSubmitting }>Submit</Button>
          </Form>
        ) }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
