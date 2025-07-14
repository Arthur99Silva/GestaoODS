const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '..'), // sobe para raiz do projeto
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testRegex: 'test/.*\\.e2e-spec\\.ts$',  // regex que bate com seus testes dentro da pasta test
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
