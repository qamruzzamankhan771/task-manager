function Validators(data) {
  if (
    data.id &&
    data.id > 2 &&
    data.title &&
    data.description &&
    data.status &&
    data.creationDate &&
    data.priorityLevel
  ) {
    return { status: true, data };
  } else {
    return { status: false, data: "Empty Data Passed.." };
  }
}
exports.Validators = Validators;
