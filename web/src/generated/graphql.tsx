import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['Float'];
  text: Scalars['String'];
  createdAt: Scalars['String'];
  author: User;
  liked: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  email: Scalars['String'];
  image: Scalars['String'];
  displayName: Scalars['String'];
  description: Scalars['String'];
  website: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  followers: Scalars['Float'];
  following: Scalars['Float'];
  posts: Scalars['Float'];
  followed: Scalars['Boolean'];
};

export type Story = {
  __typename?: 'Story';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  slug: Scalars['String'];
  image: Scalars['String'];
  caption: Scalars['String'];
  likes: Scalars['Float'];
  tags: Array<Scalars['String']>;
  commentsCount: Scalars['Float'];
  authorId: Scalars['Float'];
  liked: Scalars['Boolean'];
  author: User;
  textSnippet: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type StoryResponse = {
  __typename?: 'StoryResponse';
  errors?: Maybe<Array<FieldError>>;
  story?: Maybe<Story>;
};

export type PaginatedStories = {
  __typename?: 'PaginatedStories';
  stories: Array<Story>;
  hasMore: Scalars['Boolean'];
};

export type CommentResponse = {
  __typename?: 'CommentResponse';
  errors?: Maybe<Array<FieldError>>;
  comment?: Maybe<Comment>;
};

export type PaginatedComments = {
  __typename?: 'PaginatedComments';
  comments: Array<Comment>;
  hasMore: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  getStories: PaginatedStories;
  getProfileStories: PaginatedStories;
  getFollowedStories: PaginatedStories;
  getLikedStories: PaginatedStories;
  getStoryById?: Maybe<Story>;
  getStoryBySlug?: Maybe<Story>;
  me?: Maybe<User>;
  getProfileById?: Maybe<User>;
  getProfileByUsername?: Maybe<User>;
  searchProfiles?: Maybe<Array<User>>;
  getStoryComments?: Maybe<PaginatedComments>;
};


export type QueryGetStoriesArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryGetProfileStoriesArgs = {
  profile: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryGetFollowedStoriesArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryGetLikedStoriesArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryGetStoryByIdArgs = {
  id: Scalars['Int'];
};


export type QueryGetStoryBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetProfileByIdArgs = {
  profileId: Scalars['Int'];
};


export type QueryGetProfileByUsernameArgs = {
  username: Scalars['String'];
};


export type QuerySearchProfilesArgs = {
  name: Scalars['String'];
};


export type QueryGetStoryCommentsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  storyId: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createStory: StoryResponse;
  updateStory?: Maybe<Story>;
  deleteStory: Scalars['Boolean'];
  likeStory: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  resetPassword: UserResponse;
  changePassword: UserResponse;
  updateUser: UserResponse;
  updateProfileImage: UserResponse;
  followUser: Scalars['Boolean'];
  postComment: CommentResponse;
};


export type MutationCreateStoryArgs = {
  input: StoryInput;
};


export type MutationUpdateStoryArgs = {
  caption: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationDeleteStoryArgs = {
  id: Scalars['Int'];
};


export type MutationLikeStoryArgs = {
  storyId: Scalars['Int'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationUpdateUserArgs = {
  input: UserInput;
};


export type MutationUpdateProfileImageArgs = {
  image: Scalars['Upload'];
};


export type MutationFollowUserArgs = {
  profileId: Scalars['Int'];
};


export type MutationPostCommentArgs = {
  text: Scalars['String'];
  storyId: Scalars['Int'];
};

export type StoryInput = {
  caption: Scalars['String'];
  image: Scalars['Upload'];
};


export type UsernamePasswordInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  confirmPassword: Scalars['String'];
};

export type ResetPasswordInput = {
  token: Scalars['String'];
  newPassword: Scalars['String'];
  confirmNewPassword: Scalars['String'];
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
  confirmNewPassword: Scalars['String'];
};

export type UserInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type RegularCommentFragment = (
  { __typename?: 'Comment' }
  & Pick<Comment, 'id' | 'createdAt' | 'text' | 'liked'>
  & { author: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'image'>
  ) }
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'username' | 'image' | 'posts' | 'followers' | 'following' | 'website' | 'description' | 'displayName' | 'followed'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type StorySnippetFragment = (
  { __typename?: 'Story' }
  & Pick<Story, 'id' | 'createdAt' | 'caption' | 'image' | 'likes' | 'textSnippet' | 'liked' | 'commentsCount' | 'slug'>
  & { author: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'image'>
  ) }
);

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type CreateStoryMutationVariables = Exact<{
  input: StoryInput;
}>;


export type CreateStoryMutation = (
  { __typename?: 'Mutation' }
  & { createStory: (
    { __typename?: 'StoryResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, story?: Maybe<(
      { __typename?: 'Story' }
      & StorySnippetFragment
    )> }
  ) }
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteStory'>
);

export type FollowMutationVariables = Exact<{
  profileId: Scalars['Int'];
}>;


export type FollowMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'followUser'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LikeMutationVariables = Exact<{
  storyId: Scalars['Int'];
}>;


export type LikeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'likeStory'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type PostCommentMutationVariables = Exact<{
  storyId: Scalars['Int'];
  text: Scalars['String'];
}>;


export type PostCommentMutation = (
  { __typename?: 'Mutation' }
  & { postComment: (
    { __typename?: 'CommentResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, comment?: Maybe<(
      { __typename?: 'Comment' }
      & RegularCommentFragment
    )> }
  ) }
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type UpdateProfileImageMutationVariables = Exact<{
  image: Scalars['Upload'];
}>;


export type UpdateProfileImageMutation = (
  { __typename?: 'Mutation' }
  & { updateProfileImage: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  caption: Scalars['String'];
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updateStory?: Maybe<(
    { __typename?: 'Story' }
    & Pick<Story, 'id' | 'caption' | 'tags' | 'textSnippet'>
  )> }
);

export type UpdateUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type CommentsQueryVariables = Exact<{
  storyId: Scalars['Int'];
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type CommentsQuery = (
  { __typename?: 'Query' }
  & { getStoryComments?: Maybe<(
    { __typename?: 'PaginatedComments' }
    & Pick<PaginatedComments, 'hasMore'>
    & { comments: Array<(
      { __typename?: 'Comment' }
      & RegularCommentFragment
    )> }
  )> }
);

export type FollowedStoriesQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type FollowedStoriesQuery = (
  { __typename?: 'Query' }
  & { getFollowedStories: (
    { __typename?: 'PaginatedStories' }
    & Pick<PaginatedStories, 'hasMore'>
    & { stories: Array<(
      { __typename?: 'Story' }
      & StorySnippetFragment
    )> }
  ) }
);

export type LikedStoriesQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type LikedStoriesQuery = (
  { __typename?: 'Query' }
  & { getLikedStories: (
    { __typename?: 'PaginatedStories' }
    & Pick<PaginatedStories, 'hasMore'>
    & { stories: Array<(
      { __typename?: 'Story' }
      & StorySnippetFragment
    )> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ProfileIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ProfileIdQuery = (
  { __typename?: 'Query' }
  & { getProfileById?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ProfileNameQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type ProfileNameQuery = (
  { __typename?: 'Query' }
  & { getProfileByUsername?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ProfileStoriesQueryVariables = Exact<{
  profile: Scalars['Int'];
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type ProfileStoriesQuery = (
  { __typename?: 'Query' }
  & { getProfileStories: (
    { __typename?: 'PaginatedStories' }
    & Pick<PaginatedStories, 'hasMore'>
    & { stories: Array<(
      { __typename?: 'Story' }
      & StorySnippetFragment
    )> }
  ) }
);

export type SearchProfilesQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type SearchProfilesQuery = (
  { __typename?: 'Query' }
  & { searchProfiles?: Maybe<Array<(
    { __typename?: 'User' }
    & RegularUserFragment
  )>> }
);

export type StoriesQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type StoriesQuery = (
  { __typename?: 'Query' }
  & { getStories: (
    { __typename?: 'PaginatedStories' }
    & Pick<PaginatedStories, 'hasMore'>
    & { stories: Array<(
      { __typename?: 'Story' }
      & StorySnippetFragment
    )> }
  ) }
);

export type StoryIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type StoryIdQuery = (
  { __typename?: 'Query' }
  & { getStoryById?: Maybe<(
    { __typename?: 'Story' }
    & StorySnippetFragment
  )> }
);

export type StorySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type StorySlugQuery = (
  { __typename?: 'Query' }
  & { getStoryBySlug?: Maybe<(
    { __typename?: 'Story' }
    & StorySnippetFragment
  )> }
);

export const RegularCommentFragmentDoc = gql`
    fragment RegularComment on Comment {
  id
  createdAt
  text
  liked
  author {
    id
    username
    image
  }
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  email
  username
  image
  posts
  followers
  following
  website
  description
  displayName
  followed
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const StorySnippetFragmentDoc = gql`
    fragment StorySnippet on Story {
  id
  createdAt
  caption
  image
  likes
  textSnippet
  liked
  commentsCount
  slug
  author {
    id
    username
    image
  }
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($input: ChangePasswordInput!) {
  changePassword(input: $input) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, baseOptions);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateStoryDocument = gql`
    mutation CreateStory($input: StoryInput!) {
  createStory(input: $input) {
    errors {
      ...RegularError
    }
    story {
      ...StorySnippet
    }
  }
}
    ${RegularErrorFragmentDoc}
${StorySnippetFragmentDoc}`;
export type CreateStoryMutationFn = Apollo.MutationFunction<CreateStoryMutation, CreateStoryMutationVariables>;

/**
 * __useCreateStoryMutation__
 *
 * To run a mutation, you first call `useCreateStoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStoryMutation, { data, loading, error }] = useCreateStoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateStoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateStoryMutation, CreateStoryMutationVariables>) {
        return Apollo.useMutation<CreateStoryMutation, CreateStoryMutationVariables>(CreateStoryDocument, baseOptions);
      }
export type CreateStoryMutationHookResult = ReturnType<typeof useCreateStoryMutation>;
export type CreateStoryMutationResult = Apollo.MutationResult<CreateStoryMutation>;
export type CreateStoryMutationOptions = Apollo.BaseMutationOptions<CreateStoryMutation, CreateStoryMutationVariables>;
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
  deleteStory(id: $id)
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, baseOptions);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const FollowDocument = gql`
    mutation Follow($profileId: Int!) {
  followUser(profileId: $profileId)
}
    `;
export type FollowMutationFn = Apollo.MutationFunction<FollowMutation, FollowMutationVariables>;

/**
 * __useFollowMutation__
 *
 * To run a mutation, you first call `useFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followMutation, { data, loading, error }] = useFollowMutation({
 *   variables: {
 *      profileId: // value for 'profileId'
 *   },
 * });
 */
export function useFollowMutation(baseOptions?: Apollo.MutationHookOptions<FollowMutation, FollowMutationVariables>) {
        return Apollo.useMutation<FollowMutation, FollowMutationVariables>(FollowDocument, baseOptions);
      }
export type FollowMutationHookResult = ReturnType<typeof useFollowMutation>;
export type FollowMutationResult = Apollo.MutationResult<FollowMutation>;
export type FollowMutationOptions = Apollo.BaseMutationOptions<FollowMutation, FollowMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, baseOptions);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LikeDocument = gql`
    mutation Like($storyId: Int!) {
  likeStory(storyId: $storyId)
}
    `;
export type LikeMutationFn = Apollo.MutationFunction<LikeMutation, LikeMutationVariables>;

/**
 * __useLikeMutation__
 *
 * To run a mutation, you first call `useLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeMutation, { data, loading, error }] = useLikeMutation({
 *   variables: {
 *      storyId: // value for 'storyId'
 *   },
 * });
 */
export function useLikeMutation(baseOptions?: Apollo.MutationHookOptions<LikeMutation, LikeMutationVariables>) {
        return Apollo.useMutation<LikeMutation, LikeMutationVariables>(LikeDocument, baseOptions);
      }
export type LikeMutationHookResult = ReturnType<typeof useLikeMutation>;
export type LikeMutationResult = Apollo.MutationResult<LikeMutation>;
export type LikeMutationOptions = Apollo.BaseMutationOptions<LikeMutation, LikeMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const PostCommentDocument = gql`
    mutation PostComment($storyId: Int!, $text: String!) {
  postComment(text: $text, storyId: $storyId) {
    errors {
      ...RegularError
    }
    comment {
      ...RegularComment
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularCommentFragmentDoc}`;
export type PostCommentMutationFn = Apollo.MutationFunction<PostCommentMutation, PostCommentMutationVariables>;

/**
 * __usePostCommentMutation__
 *
 * To run a mutation, you first call `usePostCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postCommentMutation, { data, loading, error }] = usePostCommentMutation({
 *   variables: {
 *      storyId: // value for 'storyId'
 *      text: // value for 'text'
 *   },
 * });
 */
export function usePostCommentMutation(baseOptions?: Apollo.MutationHookOptions<PostCommentMutation, PostCommentMutationVariables>) {
        return Apollo.useMutation<PostCommentMutation, PostCommentMutationVariables>(PostCommentDocument, baseOptions);
      }
export type PostCommentMutationHookResult = ReturnType<typeof usePostCommentMutation>;
export type PostCommentMutationResult = Apollo.MutationResult<PostCommentMutation>;
export type PostCommentMutationOptions = Apollo.BaseMutationOptions<PostCommentMutation, PostCommentMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, baseOptions);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdateProfileImageDocument = gql`
    mutation UpdateProfileImage($image: Upload!) {
  updateProfileImage(image: $image) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type UpdateProfileImageMutationFn = Apollo.MutationFunction<UpdateProfileImageMutation, UpdateProfileImageMutationVariables>;

/**
 * __useUpdateProfileImageMutation__
 *
 * To run a mutation, you first call `useUpdateProfileImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileImageMutation, { data, loading, error }] = useUpdateProfileImageMutation({
 *   variables: {
 *      image: // value for 'image'
 *   },
 * });
 */
export function useUpdateProfileImageMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileImageMutation, UpdateProfileImageMutationVariables>) {
        return Apollo.useMutation<UpdateProfileImageMutation, UpdateProfileImageMutationVariables>(UpdateProfileImageDocument, baseOptions);
      }
export type UpdateProfileImageMutationHookResult = ReturnType<typeof useUpdateProfileImageMutation>;
export type UpdateProfileImageMutationResult = Apollo.MutationResult<UpdateProfileImageMutation>;
export type UpdateProfileImageMutationOptions = Apollo.BaseMutationOptions<UpdateProfileImageMutation, UpdateProfileImageMutationVariables>;
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $caption: String!) {
  updateStory(id: $id, caption: $caption) {
    id
    caption
    tags
    textSnippet
  }
}
    `;
export type UpdatePostMutationFn = Apollo.MutationFunction<UpdatePostMutation, UpdatePostMutationVariables>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *      caption: // value for 'caption'
 *   },
 * });
 */
export function useUpdatePostMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePostMutation, UpdatePostMutationVariables>) {
        return Apollo.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, baseOptions);
      }
export type UpdatePostMutationHookResult = ReturnType<typeof useUpdatePostMutation>;
export type UpdatePostMutationResult = Apollo.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<UpdatePostMutation, UpdatePostMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UserInput!) {
  updateUser(input: $input) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const CommentsDocument = gql`
    query Comments($storyId: Int!, $limit: Int!, $cursor: String) {
  getStoryComments(storyId: $storyId, limit: $limit, cursor: $cursor) {
    hasMore
    comments {
      ...RegularComment
    }
  }
}
    ${RegularCommentFragmentDoc}`;

/**
 * __useCommentsQuery__
 *
 * To run a query within a React component, call `useCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsQuery({
 *   variables: {
 *      storyId: // value for 'storyId'
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useCommentsQuery(baseOptions?: Apollo.QueryHookOptions<CommentsQuery, CommentsQueryVariables>) {
        return Apollo.useQuery<CommentsQuery, CommentsQueryVariables>(CommentsDocument, baseOptions);
      }
export function useCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentsQuery, CommentsQueryVariables>) {
          return Apollo.useLazyQuery<CommentsQuery, CommentsQueryVariables>(CommentsDocument, baseOptions);
        }
export type CommentsQueryHookResult = ReturnType<typeof useCommentsQuery>;
export type CommentsLazyQueryHookResult = ReturnType<typeof useCommentsLazyQuery>;
export type CommentsQueryResult = Apollo.QueryResult<CommentsQuery, CommentsQueryVariables>;
export const FollowedStoriesDocument = gql`
    query FollowedStories($limit: Int!, $cursor: String) {
  getFollowedStories(limit: $limit, cursor: $cursor) {
    hasMore
    stories {
      ...StorySnippet
    }
  }
}
    ${StorySnippetFragmentDoc}`;

/**
 * __useFollowedStoriesQuery__
 *
 * To run a query within a React component, call `useFollowedStoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFollowedStoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFollowedStoriesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useFollowedStoriesQuery(baseOptions?: Apollo.QueryHookOptions<FollowedStoriesQuery, FollowedStoriesQueryVariables>) {
        return Apollo.useQuery<FollowedStoriesQuery, FollowedStoriesQueryVariables>(FollowedStoriesDocument, baseOptions);
      }
export function useFollowedStoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FollowedStoriesQuery, FollowedStoriesQueryVariables>) {
          return Apollo.useLazyQuery<FollowedStoriesQuery, FollowedStoriesQueryVariables>(FollowedStoriesDocument, baseOptions);
        }
export type FollowedStoriesQueryHookResult = ReturnType<typeof useFollowedStoriesQuery>;
export type FollowedStoriesLazyQueryHookResult = ReturnType<typeof useFollowedStoriesLazyQuery>;
export type FollowedStoriesQueryResult = Apollo.QueryResult<FollowedStoriesQuery, FollowedStoriesQueryVariables>;
export const LikedStoriesDocument = gql`
    query LikedStories($limit: Int!, $cursor: String) {
  getLikedStories(limit: $limit, cursor: $cursor) {
    hasMore
    stories {
      ...StorySnippet
    }
  }
}
    ${StorySnippetFragmentDoc}`;

/**
 * __useLikedStoriesQuery__
 *
 * To run a query within a React component, call `useLikedStoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLikedStoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLikedStoriesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useLikedStoriesQuery(baseOptions?: Apollo.QueryHookOptions<LikedStoriesQuery, LikedStoriesQueryVariables>) {
        return Apollo.useQuery<LikedStoriesQuery, LikedStoriesQueryVariables>(LikedStoriesDocument, baseOptions);
      }
export function useLikedStoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LikedStoriesQuery, LikedStoriesQueryVariables>) {
          return Apollo.useLazyQuery<LikedStoriesQuery, LikedStoriesQueryVariables>(LikedStoriesDocument, baseOptions);
        }
export type LikedStoriesQueryHookResult = ReturnType<typeof useLikedStoriesQuery>;
export type LikedStoriesLazyQueryHookResult = ReturnType<typeof useLikedStoriesLazyQuery>;
export type LikedStoriesQueryResult = Apollo.QueryResult<LikedStoriesQuery, LikedStoriesQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const ProfileIdDocument = gql`
    query ProfileId($id: Int!) {
  getProfileById(profileId: $id) {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useProfileIdQuery__
 *
 * To run a query within a React component, call `useProfileIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProfileIdQuery(baseOptions?: Apollo.QueryHookOptions<ProfileIdQuery, ProfileIdQueryVariables>) {
        return Apollo.useQuery<ProfileIdQuery, ProfileIdQueryVariables>(ProfileIdDocument, baseOptions);
      }
export function useProfileIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileIdQuery, ProfileIdQueryVariables>) {
          return Apollo.useLazyQuery<ProfileIdQuery, ProfileIdQueryVariables>(ProfileIdDocument, baseOptions);
        }
export type ProfileIdQueryHookResult = ReturnType<typeof useProfileIdQuery>;
export type ProfileIdLazyQueryHookResult = ReturnType<typeof useProfileIdLazyQuery>;
export type ProfileIdQueryResult = Apollo.QueryResult<ProfileIdQuery, ProfileIdQueryVariables>;
export const ProfileNameDocument = gql`
    query ProfileName($username: String!) {
  getProfileByUsername(username: $username) {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useProfileNameQuery__
 *
 * To run a query within a React component, call `useProfileNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileNameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useProfileNameQuery(baseOptions?: Apollo.QueryHookOptions<ProfileNameQuery, ProfileNameQueryVariables>) {
        return Apollo.useQuery<ProfileNameQuery, ProfileNameQueryVariables>(ProfileNameDocument, baseOptions);
      }
export function useProfileNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileNameQuery, ProfileNameQueryVariables>) {
          return Apollo.useLazyQuery<ProfileNameQuery, ProfileNameQueryVariables>(ProfileNameDocument, baseOptions);
        }
export type ProfileNameQueryHookResult = ReturnType<typeof useProfileNameQuery>;
export type ProfileNameLazyQueryHookResult = ReturnType<typeof useProfileNameLazyQuery>;
export type ProfileNameQueryResult = Apollo.QueryResult<ProfileNameQuery, ProfileNameQueryVariables>;
export const ProfileStoriesDocument = gql`
    query ProfileStories($profile: Int!, $limit: Int!, $cursor: String) {
  getProfileStories(profile: $profile, limit: $limit, cursor: $cursor) {
    hasMore
    stories {
      ...StorySnippet
    }
  }
}
    ${StorySnippetFragmentDoc}`;

/**
 * __useProfileStoriesQuery__
 *
 * To run a query within a React component, call `useProfileStoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileStoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileStoriesQuery({
 *   variables: {
 *      profile: // value for 'profile'
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useProfileStoriesQuery(baseOptions?: Apollo.QueryHookOptions<ProfileStoriesQuery, ProfileStoriesQueryVariables>) {
        return Apollo.useQuery<ProfileStoriesQuery, ProfileStoriesQueryVariables>(ProfileStoriesDocument, baseOptions);
      }
export function useProfileStoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileStoriesQuery, ProfileStoriesQueryVariables>) {
          return Apollo.useLazyQuery<ProfileStoriesQuery, ProfileStoriesQueryVariables>(ProfileStoriesDocument, baseOptions);
        }
export type ProfileStoriesQueryHookResult = ReturnType<typeof useProfileStoriesQuery>;
export type ProfileStoriesLazyQueryHookResult = ReturnType<typeof useProfileStoriesLazyQuery>;
export type ProfileStoriesQueryResult = Apollo.QueryResult<ProfileStoriesQuery, ProfileStoriesQueryVariables>;
export const SearchProfilesDocument = gql`
    query SearchProfiles($name: String!) {
  searchProfiles(name: $name) {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useSearchProfilesQuery__
 *
 * To run a query within a React component, call `useSearchProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProfilesQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSearchProfilesQuery(baseOptions?: Apollo.QueryHookOptions<SearchProfilesQuery, SearchProfilesQueryVariables>) {
        return Apollo.useQuery<SearchProfilesQuery, SearchProfilesQueryVariables>(SearchProfilesDocument, baseOptions);
      }
export function useSearchProfilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchProfilesQuery, SearchProfilesQueryVariables>) {
          return Apollo.useLazyQuery<SearchProfilesQuery, SearchProfilesQueryVariables>(SearchProfilesDocument, baseOptions);
        }
export type SearchProfilesQueryHookResult = ReturnType<typeof useSearchProfilesQuery>;
export type SearchProfilesLazyQueryHookResult = ReturnType<typeof useSearchProfilesLazyQuery>;
export type SearchProfilesQueryResult = Apollo.QueryResult<SearchProfilesQuery, SearchProfilesQueryVariables>;
export const StoriesDocument = gql`
    query Stories($limit: Int!, $cursor: String) {
  getStories(limit: $limit, cursor: $cursor) {
    hasMore
    stories {
      ...StorySnippet
    }
  }
}
    ${StorySnippetFragmentDoc}`;

/**
 * __useStoriesQuery__
 *
 * To run a query within a React component, call `useStoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useStoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStoriesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useStoriesQuery(baseOptions?: Apollo.QueryHookOptions<StoriesQuery, StoriesQueryVariables>) {
        return Apollo.useQuery<StoriesQuery, StoriesQueryVariables>(StoriesDocument, baseOptions);
      }
export function useStoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StoriesQuery, StoriesQueryVariables>) {
          return Apollo.useLazyQuery<StoriesQuery, StoriesQueryVariables>(StoriesDocument, baseOptions);
        }
export type StoriesQueryHookResult = ReturnType<typeof useStoriesQuery>;
export type StoriesLazyQueryHookResult = ReturnType<typeof useStoriesLazyQuery>;
export type StoriesQueryResult = Apollo.QueryResult<StoriesQuery, StoriesQueryVariables>;
export const StoryIdDocument = gql`
    query StoryId($id: Int!) {
  getStoryById(id: $id) {
    ...StorySnippet
  }
}
    ${StorySnippetFragmentDoc}`;

/**
 * __useStoryIdQuery__
 *
 * To run a query within a React component, call `useStoryIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useStoryIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStoryIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStoryIdQuery(baseOptions?: Apollo.QueryHookOptions<StoryIdQuery, StoryIdQueryVariables>) {
        return Apollo.useQuery<StoryIdQuery, StoryIdQueryVariables>(StoryIdDocument, baseOptions);
      }
export function useStoryIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StoryIdQuery, StoryIdQueryVariables>) {
          return Apollo.useLazyQuery<StoryIdQuery, StoryIdQueryVariables>(StoryIdDocument, baseOptions);
        }
export type StoryIdQueryHookResult = ReturnType<typeof useStoryIdQuery>;
export type StoryIdLazyQueryHookResult = ReturnType<typeof useStoryIdLazyQuery>;
export type StoryIdQueryResult = Apollo.QueryResult<StoryIdQuery, StoryIdQueryVariables>;
export const StorySlugDocument = gql`
    query StorySlug($slug: String!) {
  getStoryBySlug(slug: $slug) {
    ...StorySnippet
  }
}
    ${StorySnippetFragmentDoc}`;

/**
 * __useStorySlugQuery__
 *
 * To run a query within a React component, call `useStorySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useStorySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStorySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useStorySlugQuery(baseOptions?: Apollo.QueryHookOptions<StorySlugQuery, StorySlugQueryVariables>) {
        return Apollo.useQuery<StorySlugQuery, StorySlugQueryVariables>(StorySlugDocument, baseOptions);
      }
export function useStorySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StorySlugQuery, StorySlugQueryVariables>) {
          return Apollo.useLazyQuery<StorySlugQuery, StorySlugQueryVariables>(StorySlugDocument, baseOptions);
        }
export type StorySlugQueryHookResult = ReturnType<typeof useStorySlugQuery>;
export type StorySlugLazyQueryHookResult = ReturnType<typeof useStorySlugLazyQuery>;
export type StorySlugQueryResult = Apollo.QueryResult<StorySlugQuery, StorySlugQueryVariables>;