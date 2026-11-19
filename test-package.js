const {
  success,
  error,
  paginate
} = require("./src");

console.log("\n===== SUCCESS TEST =====");

console.log(success({
  message: "User fetched successfully",
  data: {
    id: 1,
    name: "Rahul"
  }
}));

console.log("\n===== ERROR TEST =====");

console.log(error({
  message: "User not found",
  statusCode: 404
}));

console.log("\n===== PAGINATION TEST =====");

console.log(paginate({
  page: 2,
  limit: 10,
  total: 50
}));

console.log("\n===== TEST COMPLETED =====");