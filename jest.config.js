// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["<rootDir>/testing/unit/**/*.test.[jt]s?(x)"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/$1",
  },
};
