export function isStrongPassword(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return regex.test(password);
}
// (?=.*[a-z]) ensures there is at least one lowercase letter.
// (?=.*[A-Z]) ensures there is at least one uppercase letter.
// (?=.*\d) ensures there is at least one digit.
// (?=.*[@$!%*?&#]) ensures there is at least one special character.
// [A-Za-z\d@$!%*?&#]{8,} ensures the password is at least 8 characters long.
