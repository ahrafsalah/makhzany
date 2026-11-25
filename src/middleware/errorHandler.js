export function notFound(req, res, next) {
  res.status(404).json({
    status: "fail",
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}`
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      status: "fail",
      message: messages.join(", ")
    });
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(", ");
    return res.status(409).json({
      status: "fail",
      message: `Duplicate value for field(s): ${fields}`
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message: err.message || "Internal Server Error"
  });
}
