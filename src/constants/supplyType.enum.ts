export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  UNKNOWN: 'unknown',
  TEST: 'test',
};

export const STATUS_LABELS = {
  [STATUS.ACTIVE]: 'Hoạt động',
  [STATUS.INACTIVE]: 'Ngừng hoạt động',
  [STATUS.UNKNOWN]: 'Không rõ', 
  [STATUS.TEST]: 'Thử nghiệm',
};

export const STATUS_COLORS = {
  [STATUS.ACTIVE]: 'green',
  [STATUS.INACTIVE]: 'red',
  [STATUS.UNKNOWN]: 'gray',
  [STATUS.TEST]: 'yellow',  
};