import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const getDate = (createdAt: string): string => {
  const now = dayjs();
  const created = dayjs(new Date(+createdAt));
  if (now.diff(created, 'month') > 1) {
    return dayjs(created).format('MMMM D, YYYY');
  } else {
    return dayjs(created).startOf('hour').fromNow();
  }
};
