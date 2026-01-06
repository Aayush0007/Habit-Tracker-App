import toast from 'react-hot-toast';

export const showToast = (message, type = 'success') => {
  toast[type](message);
};