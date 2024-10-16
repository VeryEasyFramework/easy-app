function now() {
  return new Date();
}

function nowTimestamp() {
  return now().getTime();
}

export const dateUtils = {
  now,
  nowTimestamp,
};
