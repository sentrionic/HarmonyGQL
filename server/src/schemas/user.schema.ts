import * as yup from 'yup';

export const RegisterSchema = yup.object().shape({
  username: yup
    .string()
    .min(3)
    .max(30)
    .trim()
    .matches(/^[a-z0-9]+$/i, 'Username must be alphanumeric')
    .defined(),
  email: yup.string().email().lowercase().defined(),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(150)
    .defined(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords do not match')
    .defined(),
});

export const ResetPasswordSchema = yup.object().shape({
  token: yup.string().defined(),
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(150)
    .defined(),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], 'Passwords do not match')
    .defined(),
});

export const ChangePasswordSchema = yup.object().shape({
  currentPassword: yup.string().defined(),
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(150)
    .defined(),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], 'Passwords do not match')
    .defined(),
});

export const UserSchema = yup.object().shape({
  username: yup
    .string()
    .min(3)
    .max(30)
    .trim()
    .matches(/^[a-z0-9]+$/i, 'Username must be alphanumeric')
    .defined(),
  email: yup.string().email().lowercase().defined(),
  displayName: yup.string().min(3).max(50).trim(),
  description: yup.string().max(250),
  website: yup
    .string()
    .max(50)
    .matches(
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
    ),
});
