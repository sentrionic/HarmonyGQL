import * as yup from 'yup';

export const CommentSchema = yup.object().shape({
  text: yup.string().min(3).max(500).defined(),
  storyId: yup.number().defined(),
  userId: yup.number().defined(),
});
