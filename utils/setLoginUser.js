exports.loginUser = (user, accessToken, refreshToken) => {
  return {
    user,
    token: { accessToken, refreshToken },
  };
};
