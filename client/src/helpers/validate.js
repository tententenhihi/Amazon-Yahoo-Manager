import {extend} from 'vee-validate'

extend('same_value', {
  params: ['target'],
  validate (value, {target}) {
    return {
      valid: value === target,
    };
  },
});
