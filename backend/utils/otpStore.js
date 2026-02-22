const otpStore = new Map();

exports.saveOTP = (email, otp) => {
  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  });
};

exports.verifyOTP = (email, otp) => {
  const data = otpStore.get(email);

  if (!data) return false;
  if (Date.now() > data.expires) return false;

  return data.otp === otp;
};

exports.deleteOTP = email => otpStore.delete(email);