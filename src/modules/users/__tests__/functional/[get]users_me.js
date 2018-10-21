const axiosApiDocGenerator = require('axios-api-doc-generator');

const {
  API: { withoutAuthentication: API },
  closeWebserver,
  startWebserver,
} = require('../../../../helpers/functional-tests-helper');
const { signupAnUser, removeAllUsersFromDatabase } = require('./helper');

beforeAll(() => startWebserver());

afterAll(async () => {
  // await axiosApiDocGenerator.createApiDocsForTests();
  return closeWebserver();
});

const ENDPOINT = '/api/users/me';
describe(`[GET] ${ENDPOINT}`, () => {
  beforeAll(async () => {
    await removeAllUsersFromDatabase();

    const token = await signupAnUser();
    API.defaults.headers.common['Authorization'] = token;
  });

  // TODO
  it('(200) when receiving a valid authorization token', async () => {
    expect(1).toBe(1);
  });
});