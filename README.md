![IntroImage](/docs/app-intro.png "HappyApp")


## Contents
 1. [About](#introduction)
    * [Introduction](#introduction)
    * [Demo](#demo)
    * [Screenshots](#screen-shots)
 2. [User Documentation](#user-documentation)
    * [Initial Configuration](#initial-configuration)
    * [Adding Results](#adding-results)
    * [Displaying Results](#displaying-results)
    * [Mobile](#mobile)
 3. [Technical Documentation](#technical-documentation)
    * [Development Setup](#development-setup)
    * [Production Setup](#production-setup)
    * [App Customisation](#app-customisation)
    * [Data Structures](#data)
    * [API Reference](#api)
    * [File Structure](#file-structure)
    * [Test Environment](#test-environment)
    * [Error Handling](#error-handling)
    * [Analytics and Tracking](#analytics-and-tracking)
    * [Mobile App](#mobile-app)
    * [Offline Functionality](#offline-functionality)
    * [Server-side Rendering](#server-side-rendering)
    * [AOT](#aot)
    * [Translations and Text Changes](#translations-and-text-changes)
    * [D3 Charts Info](#chart-documentation)
    * [Tech Stack](#tech-stack)
 4. [Project Planning](#project-planning)
    * [User Flow](#high-level-flow-chart)
    * [Wireframes](#wireframes)
    * [Functional Requirements](#high-level-functional-requirements)
 5. Research
 6. Legal
    * License
    * Accessibility
    * Contributing


## Introduction

Happy App finds out how team members are feeling about their project, and visually displays results.

Scheduled emails are sent out to every member at a given time, containing an embedded poll,
making submitting responses effortless. All responses are anonymised, encouraging team member to be honest.
The dashboard displays a summary of results in a series of data visualisations, showing:

 - Overall team sentiment for today
 - Sentiment change over time
 - Sentiment by team


### Demo

Live demo at: [happy-app-demo.as93.net](http://happy-app-demo.as93.net/)

The demo uses automatically generated sample data (where teams have been given random city names), and scores are totally random.



### Screen Shots

![Homepage](/docs/screen-shot-1.png "Homepage")

<details>
<summary>Team Page Screenshots (click to show)</summary>
<p>


![TeamPage](/docs/screen-shot-2.png "TeamPage")
</p>
</details>



<details>
<summary>Mobile View Screenshots (click to show)</summary>
<p>


![Mobile](/docs/screen-shot-mobile.png "Mobile")
</p>
</details>




## User Documentation


### Initial Configuration

// todo


### Adding Results

// todo


### Displaying Results

// todo


### Mobile

//todo



## Technical Documentation


### Development Setup
Setting up the project for development is done in the standard way.

The steps are as follows:
 1. Clone the repo, and `cd` into it
 2. `yarn install` the npm node dependencies, and frontend dependencies
 3. Connect to mongo, `mongod`. See the [Getting Started page on MongoDB documentation][2].
 4. Populate the database with some sample data (optional). `gulp populate-sample-data` (*See [Data](#data) section for more info*)
 5. Start the development server, `npm run dev`. This watches, compiles and refreshes appropriate server and client components.


### Production Setup
 1. Clone or upload the files to your server directory
 2. Run `yarn`, to install the npm and frontend modules
 3. Create a `.env` file in the project root, and populate it like the example below
 4. Setup and start a mongo instance, and configure the port appropriately in the .env
 5. Build the produciton version, with `npm run buil:prod`
 6. Run `npm run test` to verify that everything is working as expected
 7. Start the app (using a `forever` or `pm2` to keep it alive), `forever start node server`
 8. Set up a cron job or similar to start the app on server reboot    

Example `.env` file. Will need populating with valid API keys.
```
NODE_ENV=production
PORT=3001
ROLLBAR_KEY=123abc
NEW_RELIC_APP_NAME=happy-app
NEW_RELIC_LICENSE_KEY=123abc
```


### App Customisation


### Test Environment

Read more about the [test strategy](https://github.com/Lissy93/twitter-sentiment-visualisation/blob/dev/docs/test-strategy.md)

### Data

All data is anonymised, a one-way hash is created from the users email address,
which is used by the system to uniquely identify them, but this is not displayed
to users/ admins.


User data is represented in the [following JSON format](/docs/example-json-struct.png):
```
teamName: (String)
data: (Array)
---date: (Timestamp)
---userResults: (Object)
------userHash: (StringHash)
------score: (String)
------comment: (String)
```


<details>
<summary>For example (click to expand)</summary>
<p>

Example JSON:

```json
[
  {
    "teamName": "team-name",
    "data": [
      {
        "date": 1495273151191,
        "userResults": [
          { "userHash": "USR28JD83H3DKDS", "score": "good", "comment": "" },
          { "userHash": "USRCJD93JD93JD9", "score": "good", "comment": "fun team lunch" },
          { "userHash": "USRNC983JD93JSM", "score": "average", "comment": "" },
          { "userHash": "USRJCI3NDX923JC", "score": "bad", "comment": "too many meetings" },
          { "userHash": "USRNZZK1SD251CS", "score": "average", "comment": "" }
        ]
      },
      {
        "date": 1495273223108,
        "userResults": [
          { "userHash": "USR28JD83H3DKDS", "score": "bad", "comment": "" },
          { "userHash": "USRCJD93JD93JD9", "score": "good", "comment": "" },
          { "userHash": "USRNC983JD93JSM", "score": "good", "comment": "fast progress" }
        ]
      }
    ]
  }
]

```
*[see more...][sample-data]*


For development, a random set of data can be generated (using a tool such as [json-generator][1]), with a definition similar to the one below:

```javascript
[
  {
    'repeat(4,6)': {
    teamName: 'team-{{city()}}',
    data: [
      {     
       'repeat(45,90)': {
        date: function (tags, parent, index) {
           var d = new Date();
           return d.setDate(d.getDate()-index);
		},
            userResults: [
                {
                'repeat(6,30)': {
                userHash:function(t,p,i){ return parseInt((i+1*i)*75+10, 16); },
                score: '{{random("good", "average", "bad")}}',
                comment:''
                }
              }
           ]
        }
      }
    ]
  }
  }
]
```

</p>
</details>


To populate the database with either randomly generated data, or exported JSON, run:
```
gulp populate-sample-data
```
By default this generates a set of random, but reasonably realistic sample data,
the parameters of which were defined in the [populate-demo-db.js](/tasks/setup/populate-demo-db.js) file.
Alternativley, the path of previously generated or exported data can be specified,
and the database will be populated the that data.
An example filename parameter may look something like this:  [`/tasks/setup/sample-data.json`][sample-data].


### API

The frontend accesses it's data through the set of functions exposed by the backend.
There are **GET** routes for just returning data, and **POST** routes which update/
add new data, and require authentication.

All API calls are made from `BASE_URL/api/`, where `BASE_URL` is the URI of the app
root *(e.g. 'localhost', IP address or the domain pointing to main app)*

#### /teams
Returns an array of all teams referenced to in the datasets

- **URL:** `/teams/`
- **Method:** `GET`
- **URL Params:** none
- **Success Response:**
  - **Code:** `200`
  - **Content:** `['team-name1', 'team2', 'three', 'forth-team']`
- **Error Response:**
  - **Code:** `200`
  - **Content:** `[]`


#### /team-sentiment
Returns all recorded sentiment for all teams

- **URL:** `/team-sentiment/`
- **Method:** `GET`
- **URL Params:** _none_
- **Success Response:**
  - **Code:** `200`
  - **Content:** `{teamName: '', data: { [.....] }}` (See the above section on [data](#data) format)
- **Error Response:**
  - **Code:** `200`
  - **Content:** `{}`


#### /team-sentiment/:team-name
Returns all recorded sentiment data for any given team

- **URL:** `/team-sentiment/:team-name`
- **Method:** `GET`
- **URL Params:** `teamName` (the name of the team, as a String)
- **Success Response:**
  - **Code:** `200`
  - **Content:** `{teamName: '', data: { [.....] }}` (See the above section on [data](#data) format)
- **Error Response:**
  - **Code:** `200`
  - **Content:** `{}`


### File Structure

```
happy-app
│   README.md
│   package.json    
│
└───client
│   └───dev
│       │───components
│       │───pages
│       │───services
│       │───styles
│       │───graphics
|       |   app.module.js
|       |   app.ts
|       |   config.js
|       |   index.html
|       |   main-jit.ts
|       |   main-aot.ts
|    ___|   manifest.json
|   |   
│   └───dist
│       │─── ...     
│   
└───server
|   │───api
|   │───auth
|   │───commons
|   │───config
|   │───constants
|   │───routes
|   │   error-tracking.js
|   │   index.js
|   |   server.js
|
└───tasks
|
└───tests

```

### Error Handling

Errors are tracked, monitored and handled using [Rollbar](https://rollbar.com).
An API key is required, and needs to be added into the [`.env`] file, as `ROLLBAR_KEY`.
If no key is specified, all Rollbar events will just be skipped.

The error tracking code is in [/server/commons/tracking/error-tracking.js](/server/commons/tracking/error-tracking.js).
So to swap Rollbar out with something else, such as TrackJS  or ErrLytics,
this Should be the only file which needs modifying.

To use, first include the above file:
`const rollbar = require("../../commons/tracking/error-tracking");`
Then either log a message, like:
`rollbar.logMessage("Team List returned", teamNames);`
Or in an error catch block, log the error, like:
`rollbar.logWarning("Unable to fetch team list", err);`

Rollbar also catches and manages client side errors, and is initialised in
[client/app.module.ts](/client/dev/app.module.ts).


### Analytics and Tracking

[angulartics2](https://github.com/angulartics/angulartics2) is ued to implement
[Google Analytics](https://analytics.google.com) and
[Google Tag Manager](https://www.google.com/analytics/tag-manager/).
The tracking is managed in
[analytics-tracking.service.ts](/client/dev/services/analytics-tracking.service.ts).
A function similar to the one below can be used to track events:

```
trackAnalyticEvents(action, properties = {}){
  this.angulartics2.eventTrack.next({ action: action, properties: properties});
}
```
As well as ths, the standard GA / GTAG code snipped it in the
['client/index.html'](client/dev/index.html).


### Mobile App

There is no mobile app companion for happy-app.

Though it was built following Google's Progressive Web App guidelines.
It aims to be reliable, fast and engaging. And this is achieved through
making use of service workers for basic offline Functionality, and the Google
[`manifest.json`](/client/dev/manifest.json), to allow for custom splash screens,
icons and colours once it to be added to the users home screen. It is, of course
fully responsive, and every effort has been made to support all modern browsers and
devices, as best as possible.


### Offline Functionality


### Server-side Rendering


### AOT


### D3 Charts Info

Each [D3.js](http://d3js.org) is in it's own component, so should be able to be
implemented anywhere in the application, and managed centrally. See
[overview-chart.component.ts](/client/dev/components/overview-chart/overview-chart.component.ts)
for an example. Team data is managed centrally in  
[team.service.ts](/client/dev/services/team.service.ts) and each chart listens
for changes in this service and updates accordingly. All the D3 chart components
follow the same structure. There are (currently) six charts:

 * [`calendar-chart`](/client/dev/components/calendar-chart) - Detailed calendar breakdown for a given team
 * [`day-breakdown-chart`](/client/dev/components/day-breakdown-chart) - Breakdown of sentiment results between teams for a given day
 * [`grid-chart`](/client/dev/components/grid-chart) - High-level overvier of average sentiment for all teams
 * [`message-chart`](/client/dev/components/message-chart) - Visual display of annomised team-member comments for each team
 * [`overview-chart`](/client/dev/components/overview-chart) - Donut chart showing proportions of sentiment for a given team
 * [`time-chart`](/client/dev/components/time-chart) - Shows sentiment over time, for a given team



 ### Tech Stack


 ![TechStack](/docs/tech-stack.png "TechStack")

 The app uses a fairly standard [MEAN] ([Mongo], [Express], [Angular 4], Node) stack, with [D3.js] for the charts,
 and isomorphic rendering with [Angular Universal].

 <details>
 <summary>Show Full Tech Stack: </summary>
 <p>


 The majority of it was written in/ with [SASS]/[SCSS] (for the styles), [TypeScript] (for client-side JS),
 [Babel] (for server-side JS) and [handlebars] (for non-Angular HTML).

 Several utilities proved to be a vital help, when carrying out common tasks, mostly [Bluebird] and [Q] (for promises),
 [dotenv] (for managing environmental variables), [RxJS] (mainly for event binding in Angular), and of course [Mongoose]
 for making [Mongo] super easy to work with.

  Testing the app, was made possible using combination of frameworks and libraries. [Cucumber] (for specifying BHD tests),
 [Protractor] (for E2E Angular testing), [Karma] (for running the unit tests), [Mocha] (for running server-side tests),
 [Chai] (for writing the server side tests), [Istanbul] (for checking test coverage), [Code Climate] (for checking code
 quality is on point), [Sinnon.js] (for stubs and spies), [Davis DM] (for checking dependencies are u2d) and [Phantom]
 (was initially used for headless browser testing).

 Detailed analytics are collected with [Google Tag Manager (GTM)], and application errors and warnings are tracked with [Rollbar].
 </p>
 </details>

 [MEAN]: http://mean.io/
 [Mongo]: https://www.mongodb.com/
 [Express]: https://expressjs.com/
 [Angular 4]: https://angular.io/
 [D3.js]: https://d3js.org/
 [Angular Universal]: https://universal.angular.io/
 [SASS]: http://sass-lang.com/
 [SCSS]: http://sass-lang.com/
 [TypeScript]: https://www.typescriptlang.org/
 [Babel]: https://babeljs.io/
 [handlebars]: http://handlebarsjs.com/
 [Bluebird]: http://bluebirdjs.com
 [Q]: https://github.com/kriskowal/q
 [dotenv]: https://github.com/motdotla/dotenv
 [RxJS]: http://reactivex.io/
 [Mongoose]: http://mongoosejs.com/
 [Cucumber]: https://github.com/cucumber/cucumber-js
 [Protractor]: http://www.protractortest.org/#/
 [Karma]: https://karma-runner.github.io
 [Mocha]: https://mochajs.org/
 [Chai]: http://chaijs.com/
 [Istanbul]: https://github.com/istanbuljs/istanbuljs
 [Code Climate]: https://codeclimate.com/
 [Sinnon.js]: http://sinonjs.org/
 [Davis DM]: https://david-dm.org/
 [Phantom]: http://phantomjs.org/
 [Google Tag Manager]: https://www.google.com/analytics/tag-manager/
 [Rollbar]: https://rollbar.com/



## Project Planning


### High-Level Flow Chart

![Flowchart](/docs/high-level-flow-chart.png "Flowchart")


### Wireframes

![Wireframes](/docs/wireframes.png "Wireframes")



### High-Level Functional Requirements

#### Mail Scheduler
_The system the sends out periodic emails to team members, collects, verifies, formats and inserts results_
- Maintains a list of email addresses for each member of each team
- Generates unique data-collection links ( associated with email address, timestamp and mood)
- Sends emails at a specified time on given days (e.g. 4pm Mon- Fri)
- Verifies that users response is valid (from team-member email, and not already submitted within timeframe)
- Inserts team members response into the database

#### View Responses (Individual Team)
_A series of data visualisations to display team mood_
- Overview chart. A very simple proportion (donut) chart, showing overall percentages. Should allow the user to switch between displaying results from today, this week, and this month.
- Time chart. A line chart showing team sentiment over-time. Should allow the user to switch between aggregate (one line representing overall sentiment), and breakdown (line for each sentiment).
- Calendar view. A detailed month-view calendar, showing the number of responses for each sentiment per day, with hover tooltip to view comments (if applicable) for each response.
- Comment view. Show's in plain text the comments, sorted by most recent first.
- Sentiment word cloud. Generated from comments, size of word represents number of occurrences, colour represents sentiment.
- Grid view. Grid to show responses over time, the primary use of this is to gauge what percentage of team members consistently respond to the survey.
- Stats view. Numeric value, displaying the worst and best day, highest and lowest participation day.

#### View Responses (All Teams)
_The homepage will provide entry point to the application, as well as a quick overview of each team_
- List all teams, as links to their team response page
- Show small overview for each team
- Time Grid. The primary data visualisation for the homepage, is a grid, with row for each team, and column for each day, coloured by response.

#### Admin Dashboard
_Allows team admin to modify certain application settings and maintain the team member list_
- Should be secured, only accessible using admin credentials
- Should allow the admin to modify when emails are sent out (times and days)
- Should allow admin to add and remove team email addresses on the distribution list


[sample-data]: /tasks/setup/sample-data.json

[1]:http://www.json-generator.com/
[2]: https://docs.mongodb.com/v3.0/tutorial/getting-started-with-the-mongo-shell/
