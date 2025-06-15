const axios = require("axios");

const validateEmail = async (email) => {
  try {
    const response = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_KEY}&email=${email}`
    );

    return {
      isValid:
        response.data.is_valid_format.value &&
        response.data.is_mx_found.value &&
        response.data.is_smtp_valid.value,
      data: response.data,
    };
  } catch (error) {
    console.error("Email validation error:", error);
    throw new Error("Failed to validate email");
  }
};

module.exports = validateEmail;
