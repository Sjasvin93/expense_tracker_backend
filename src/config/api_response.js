function sendApiResponse(res, ...args) {
    let response = { success: true };
    let status_code = 200;
  
    args.forEach((arg) => {
      if (typeof arg === "string") {
        if (!response.message) response.message = arg;
      }
      if (arg && Array.isArray(arg)) {
        (response.success = false), (response.errors = arg);
      }
      if (arg && arg.data) {
        response.data = arg.data;
      }
      if (arg && arg.error) {
        response.success = false;
        status_code = 500;
        response.message = "Internal server error";
        response.errors = [{ field: "General error", error: arg.error }];
      }
      if (typeof arg === "boolean") {
        response.success = arg;
      }
      if (typeof arg === "number") {
        response. errors = [];
        status_code = arg;
      }
    });
  
    console.log("Response:", JSON.stringify(response, null, 2));
  
    if (status_code === 400 && (!response.errors || response.errors.length === 0)) {
      response.errors = [{ field: "General error", error: response.message || "Bad Request" }];
    }
  
    return res.status(status_code).json(response);
  }
  
  module.exports = { sendApiResponse };
  