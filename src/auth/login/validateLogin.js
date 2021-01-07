const loginFieldValidator = {
  validateUsername: (username = '') => {
    username = { value: username };
    if (!username.value) {
      username.error = 'Username is required';
    }
    return { username };
  },
  validatePassword: (password = '') => {
    password = { value: password };
    if (!password.value) password.error = 'Password is required';
    return { password };
  }
};

export const validateForm = form => {
  let hasErrors = false;
  const validatedForm = {
    username: loginFieldValidator.validateUsername(form.username.value)
      .username,
    password: loginFieldValidator.validatePassword(form.password.value).password
  };
  Object.keys(validatedForm).forEach(field => {
    if (validatedForm[field].error) {
      hasErrors = true;
    }
  });
  return { form: validatedForm, hasErrors };
};

export const validateField = (field, value) => {
  return loginFieldValidator[
    `validate${field.charAt(0).toUpperCase()}${field.slice(1)}`
  ](value);
};
