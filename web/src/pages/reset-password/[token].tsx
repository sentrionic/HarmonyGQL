import React, { useState } from 'react';
import { NextPage } from 'next';
import { Wrapper } from '../../components/Wrapper';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toErrorMap } from '../../utils/toErrorMap';
import { MeDocument, MeQuery, useResetPasswordMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { withApollo } from '../../utils/withApollo';
import { Button, FormLabel } from 'react-bootstrap';
import { ResetPasswordSchema } from '../../schemas/user.schema';

const ResetPassword: NextPage = () => {
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();
  const [tokenError, setTokenError] = useState('');
  return (
    <Wrapper>
      <Formik
        initialValues={ { newPassword: '', confirmNewPassword: '' } }
        validationSchema={ ResetPasswordSchema }
        onSubmit={ async (values, { setErrors }) => {
          const response = await resetPassword({
            variables: {
              input: {
                newPassword: values.newPassword,
                confirmNewPassword: values.confirmNewPassword,
                token:
                  typeof router.query.token === 'string'
                    ? router.query.token
                    : '',
              },
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.resetPassword.user,
                },
              });
            },
          });
          if (response.data?.resetPassword.errors) {
            const errorMap = toErrorMap(response.data.resetPassword.errors);
            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.resetPassword.user) {
            // worked
            await router.push('/');
          }
        } }
      >
        { ({ isSubmitting }) => (
          <Form>
            <h3>Reset Password</h3>

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
            { tokenError ? (
              <NextLink href="/forgot-password">
                <p className="forgot-password text-right">
                  Go <a href="/forgot-password">here</a> to get a new token.
                </p>
              </NextLink>
            ) : null }
          </Form>
        ) }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ResetPassword);
