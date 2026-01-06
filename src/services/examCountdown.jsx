import { formatDistanceToNow } from 'date-fns';

export const getCountdown = (examDate) => formatDistanceToNow(new Date(examDate));