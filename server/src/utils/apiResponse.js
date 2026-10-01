/**
 * Standardized API Response Helper
 * Exactly conforms to Problem Statement 06 (Page 8)
 * Success shape: { success: true, data: ..., message?: string }
 * Error shape: { success: false, error: { code: '...', message: '...', details?: [...] } }
 */

export class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    const response = {
      success: true,
      data
    };
    if (message) {
      response.message = message;
    }
    return res.status(statusCode).json(response);
  }

  static error(res, message = 'Internal Server Error', statusCode = 500, code = 'SERVER_ERROR', details = null) {
    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        details: details || []
      }
    });
  }
}
