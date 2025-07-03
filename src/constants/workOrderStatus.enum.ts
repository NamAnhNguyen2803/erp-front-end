export const WORK_ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PAUSED: 'paused',
};

export const WORK_ORDER_STATUS_COLORS = {
  [WORK_ORDER_STATUS.PENDING]: 'blue',
  [WORK_ORDER_STATUS.IN_PROGRESS]: 'cyan',
  [WORK_ORDER_STATUS.COMPLETED]: 'green',
  [WORK_ORDER_STATUS.CANCELLED]: 'red',
  [WORK_ORDER_STATUS.PAUSED]: 'orange',
};

export const WORK_ORDER_STATUS_LABELS = {
  [WORK_ORDER_STATUS.PENDING]: 'Chờ thực hiện',
  [WORK_ORDER_STATUS.IN_PROGRESS]: 'Đang thực hiện',
  [WORK_ORDER_STATUS.COMPLETED]: 'Hoàn thành',
  [WORK_ORDER_STATUS.CANCELLED]: 'Đã hủy',
  [WORK_ORDER_STATUS.PAUSED]: 'Tạm dừng',
};

export const WORK_ORDER_PRIORITY_COLORS = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

export const WORK_ORDER_PRIORITY_LABELS = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};
