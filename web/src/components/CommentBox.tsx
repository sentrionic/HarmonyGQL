import React from 'react';
import { Button, Container, Spinner } from 'react-bootstrap';
import { RegularCommentFragmentDoc, useCommentsQuery, usePostCommentMutation } from '../generated/graphql';
import { Comment } from './Comment';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toErrorMap } from '../utils/toErrorMap';
import { CommentSchema } from '../schemas/comment.schema';
import InfiniteScroll from 'react-infinite-scroll-component';

interface CommentBoxProps {
  storyId: number;
  userId: number | undefined;
}

export const CommentBox: React.FC<CommentBoxProps> = ({ storyId, userId }) => {

  const { data, loading, error, fetchMore, variables } = useCommentsQuery(
    {
      variables: {
        storyId,
        limit: 15,
        cursor: null,
      },
      notifyOnNetworkStatusChange: true,
    });
  const [postComment] = usePostCommentMutation();

  if (loading) {
    return (
      <Container className={ 'main' }>
        <Spinner animation={ 'border' } />
      </Container>
    );
  }

  if (!loading && !data) {
    return (
      <div>
        <div>Query Failed</div>
        <div>{ error?.message }</div>
      </div>
    );
  }

  const fetchMoreComments = async () => {
    await fetchMore({
      variables: {
        storyId,
        limit: variables?.limit,
        cursor: data?.getStoryComments?.comments[data?.getStoryComments.comments.length - 1].createdAt,
      },
    });
  };

  return (
    <div className="row bootstrap snippets container" style={ { marginTop: '10px' } }>
      <div className="col-md-12 col-md-offset-2 col-sm-12">
        <div className="comment-wrapper">
          <div className="panel panel-info">
            <div className="panel-heading">
              <h4 className="card-title">
                Comments
              </h4>
            </div>
            <div className="panel-body">
              <Formik
                initialValues={ { text: '', storyId: storyId } }
                validationSchema={ CommentSchema }
                onSubmit={ async (values, { setErrors, resetForm }) => {
                  const response = await postComment({
                    variables: values,
                    update(cache, { data }) {
                      cache.modify({
                        fields: {
                          getStoryComments(existingCommentRefs = []) {
                            const newCommentRef = cache.writeFragment({
                              data: data?.postComment.comment,
                              fragment: RegularCommentFragmentDoc,
                            });

                            return {
                              comments: [...existingCommentRefs.comments, newCommentRef],
                              hasMore: existingCommentRefs.hasMore,
                            };
                          },
                        },
                      });
                    },
                  });
                  if (response.data?.postComment.errors) {
                    setErrors(toErrorMap(response.data.postComment.errors));
                  } else if (response.data?.postComment.comment) {
                    resetForm();
                  }
                } }>
                { ({ isSubmitting }) => (
                  <Form>
                    <Field as={ 'textarea' } className="form-control" name="text"
                           placeholder={ userId ? 'Write a comment...' : 'Please sign in to comment' }
                           rows={ 3 } disabled={ !userId } />
                    <ErrorMessage name="text" component="div" className="error text-danger" />
                    <br />
                    <Button type="submit" variant={ 'info' } className="pull-right"
                            disabled={ isSubmitting || !userId }>Post</Button>
                  </Form>
                ) }
              </Formik>
              <div className="clearfix" />
              <hr />
              <ul className="media-list comment-ul">
                { data?.getStoryComments && data?.getStoryComments?.comments.length > 0 ? (
                    <InfiniteScroll
                      dataLength={ data!!.getStoryComments?.comments.length || 0 }
                      next={ fetchMoreComments }
                      hasMore={ data!!.getStoryComments?.hasMore || false }
                      loader={ <h4>Loading...</h4> }
                    >
                      { data.getStoryComments.comments.map((c) =>
                        <Comment comment={ c } key={ c.id } />,
                      ) }
                    </InfiniteScroll>
                  ) :
                  <p>There are no comments yet.</p> }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
