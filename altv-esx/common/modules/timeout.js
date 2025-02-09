let timeoutCount = 0;
const cancelledTimeouts = {};

const setTimeoutESX = (msec, cb) => {
  const id = timeoutCount + 1;

  const timeout = setTimeout(() => {
    if (cancelledTimeouts[id]) {
      delete cancelledTimeouts[id];
      return;
    }
    cb();
  }, msec);

  timeoutCount = id;
  return id;
};

const clearTimeoutESX = (id) => {
  cancelledTimeouts[id] = true;
};

export { setTimeoutESX, clearTimeoutESX };
