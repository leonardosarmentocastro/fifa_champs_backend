# fifa_champs_backend

## Roadmap

1. "authenticationService":
  * encryption
    * Add unit tests.
  * compare
    * Add unit tests.
2. Finish user "Sign up":
  * receive "email", "username" and "password"
    * validation "email": is empty?
    * validation "email": is valid email?
    * validation "email": is already in use?
    * validation "username": is empty?
    * validation "username": has more than 16 characters?
    * validation "username": is already in use?
  * Changes on schema:
    * Add "email"
    * Add "username"
    * Remove "slack" properties
      * Update functional tests
  * Generate authorization token:
    * Send it back as "Authorization" header
  * Add functional tests.
3. Sign in
  * receive "email", "username" and "password"
    * if receives "email"
      * validation "email": is empty?
      * validation "email": is valid email?
      * validation "email": is already in use?
    * if receives "username"
      * validation "username": is empty?
      * validation "username": has more than 16 characters?
      * validation "username": is already in use?
    * if receives both "email" or "username"
      * error
    * if receives neither "email" nor "username"
      * error
    * validation "password": matches encrypted value?
  * returns status (200) and a jwt token on the "Authorization" header
4. Add a match
  * TBD
...
* Add docker so we can run e2e tests on frontend's CI with Cypress

## Schema definitions

> If you are not going to use mongoose Schema attributes/validations, there is no need to use "mongoose.Schema" to create a schema.

### USER SCHEMA

```js
const user = {
  _id: '123',

  // [SCHEMA] ("public" schema) will be copied into other schemas that relies on user data;
  slack: {
    displayName: 'gil',
    icon: 'spechless-gil'
  },

  // [SCHEMA] ("private" schema) this one will NOT be copied into another schemas
  privateFields: {
    password: '',
  },
};
```

### SEASON SCHEMA

```js
const season = {
  'jun/2018': {
    matches: [
      // [SCHEMA] match
      {
        // [SCHEMA] ChosenTeam
        awayTeam: {
          players: [
            { id, ...user.public }, // @baiano
            { id, ...user.public } // @rborcat
          ],
          score: 0,
          team: {
            name: 'Barcelona',
            league: 'La liga'
          },
        },

        date: '', // ISO FORMAT (the front-end is in charge of displaying it the way it prefers)

        // [SCHEMA] ChosenTeam
        homeTeam: {
          players: [
            { id, ...user.public }, // @gil
            { id, ...user.public } // @rborcat
          ],
          score: 3,
          team: {
            name: 'Real Madrid',
            league: 'La liga'
          },
        },

        isSeasonFinalMatch: true,

        summaryByPlayer: [
          {
            user: { id, ...user.public },
            teammate: { id, } // [SCHEMA] user (will be used for statics, e.g. "@gil wins 70% of matches played with @baiano")
            hasPlayedAsHomeTeam: true,
            hasWonTheMatch: true,
            goalsScored: 3,
          },
        ],
      }
    ],

    // [SCHEMA] StatsByPlayer
    statsByPlayer: [
      {
        id,
        stats: {
          wins: 0,
          draws: 0,
          losses: 0,
          played: 0,
          points: 0,
          goalsAgainst: 0,
          goalsFor: 0,
          goalsDifference: 0
        },

        // [SCHEMA] user
        user: { id, ...user.public },
      }
    ],
  }
};
```
