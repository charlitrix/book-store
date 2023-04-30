const defaultErrorMessage = "Field is required";

export function textRequired(value, errorMessage = defaultErrorMessage) {
  if (value === null || value.trim() === "") {
    return errorMessage;
  }
}

export function numberRequired(value, errorMessage = defaultErrorMessage) {
  if (value === null || value === "") {
    return errorMessage;
  }
}

export function equalToRequired(
  value1,
  value2,
  errorMessage = "Fields do not match"
) {
  if (value1.trim() !== value2.trim()) {
    return errorMessage;
  }
}

export function lengthRequired(
  value,
  length,
  errorMessage = defaultErrorMessage
) {
  if (value === null || value === "" || value.length !== length) {
    return errorMessage;
  }
}

export function greaterThanRequired(
  value,
  length,
  errorMessage = defaultErrorMessage
) {
  if (value === null || value === "" || value.length < length) {
    return errorMessage;
  }
}
