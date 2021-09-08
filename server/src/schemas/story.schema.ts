import * as yup from 'yup';

export const StorySchema = yup.object().shape({
  caption: yup.string().min(10).max(500).defined(),
  image: yup.mixed().required('An image is required'),
});
