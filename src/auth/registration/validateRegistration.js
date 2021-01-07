// import isUsername from 'validator/lib/isUsername';
import passwordStrengthTest from 'owasp-password-strength-test';

const registrationFieldValidator = {
  validateUsername: (username = '') => {
    username = { value: username };
    // if (username.value && !isUsername(username.value)) {
    //   username.error = 'Must be a valid username address';
    // }
    if (!username.value) {
      username.error = 'Username is required';
    }
    return { username };
  },
  validatePassword: (password = '') => {
    password = { value: password };
    if (password.value) {
      passwordStrengthTest.config({
        allowPassphrases: true,
        maxLength: 128,
        minLength: 10,
        minPhraseLength: 20,
        minOptionalTestsToPass: 4
      });
      const passwordTestResults = passwordStrengthTest.test(password.value);
      if (passwordTestResults.optionalTestErrors.length > 0) {
        password.error = passwordTestResults.optionalTestErrors[0];
      }
      if (passwordTestResults.requiredTestErrors.length > 0) {
        password.error = passwordTestResults.requiredTestErrors[0];
      }
    } else password.error = 'Password is required';
    return { password };
  },
  validateConfirmPassword: (confirmPassword = '', password) => {
    confirmPassword = { value: confirmPassword };
    if (password.value !== confirmPassword.value)
      confirmPassword.error = 'Passwords do not match';
    if (!confirmPassword.value)
      confirmPassword.error = 'Password confirmation required';
    return { confirmPassword };
  },
  validatePassphrase: passphrase => {
    passphrase = { value: passphrase };
    if (!passphrase.value) {
      passphrase.error = 'Passphrase is required';
    }
    return { passphrase };
  }
};

export const validateForm = form => {
  let hasErrors = false;
  const validatedForm = {
    username: registrationFieldValidator.validateUsername(form.username.value)
      .username,
    password: registrationFieldValidator.validatePassword(form.password.value)
      .password,
    confirmPassword: registrationFieldValidator.validateConfirmPassword(
      form.confirmPassword.value,
      form.password
    ).confirmPassword
  };
  Object.keys(validatedForm).forEach(field => {
    if (validatedForm[field].error) {
      hasErrors = true;
    }
  });
  return { form: validatedForm, hasErrors };
};

export const validateField = (field, value, confirmValue) => {
  return registrationFieldValidator[
    `validate${field.charAt(0).toUpperCase()}${field.slice(1)}`
  ](value, confirmValue);
};
