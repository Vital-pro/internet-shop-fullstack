// * Еще отдельно in folder Server -> create folder error. В ней создадим файл ApiError.js, внутри напишем:

class ApiError extends Error {
  constructor(status, message) {
    super();
    this.status = status
    this.message = message
  }

  // статические фу-ции - это фу-кции, которые можно вызывать без создания объекта. Т.е. мы можем обращаться напрямую к классу и вызывать функцию
  static badRequest(message) {
    return new ApiError(404, message)
  }

  static internal(message) {
    return new ApiError(500, message)
  }

  static forbidden(message) {
    return new ApiError(403, message)
  }
}

module.exports = ApiError;

//33,55 middleware