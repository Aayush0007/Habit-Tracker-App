import toast from 'react-hot-toast';

export const notifySessionCompleted = (sessionNumber) => {
  toast.success(`✅ Session ${sessionNumber} completed – 2 hours logged!`, {
    duration: 4000,
    position: 'top-center',
  });
};