export const isValidProjectName = (name) => {
  return /^[a-z0-9-_]{3,40}$/i.test(name);
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
