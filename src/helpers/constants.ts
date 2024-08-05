export const READ_ACCESS = 0b0001;

export const EDIT_ACCESS = 0b0010;

export const WRITE_ACCESS = 0b0100;

export const roleMap = {
  USER: READ_ACCESS,
  ADMIN: READ_ACCESS | EDIT_ACCESS,
  OWNER: READ_ACCESS | EDIT_ACCESS | WRITE_ACCESS,
};
