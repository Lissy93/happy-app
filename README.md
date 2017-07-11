## Contents
 1. [Project Introduction](#introduction)
 1. [Development Setup](#development-setup)
 2. [Production Setup](#production-setup)
 3. [Test Environment](#test-environment)
 4. [Data Structures](#data)
 5. [API Reference](#api)
 6. [Project Planning](#project-planning)


## Introduction

Happy App finds out how team members are feeling about their project, and visually displays results.

Scheduled emails are sent out to every member at a given time, containing an embedded poll,
making submitting responses effortless. All responses are anonymised, encouraging team member to be honest.
The dashboard displays a summary of results in a series of data visualisations, showing:

 - Overall team sentiment for today
 - Sentiment change over time
 - Sentiment by team

### Screen Shot

### Tech Stack

## Development Setup
Setting up the project for development is done in the standard way.

The steps are as follows:
 1. Clone the repo, and `cd` into it
 2. `npm install` the node dependencies
 3. Connect to mongo, `mongod`. See the [Getting Started page on MongoDB documentation][2].
 4. Populate the database with some sample data (optional). `gulp populate-sample-data` (*See [Data](#data) section for more info*)
 5. Start the development server, `npm run dev`. This watches, compiles and refreshes appropriate server and client components.


## Production Setup

## Test Environment

Read more about the [test strategy](https://github.com/Lissy93/twitter-sentiment-visualisation/blob/dev/docs/test-strategy.md)

## Data

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


For example:

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

To populate the database with either randomly generated data, or exported JSON, run:
```
gulp populate-sample-data
```
By default this generates a set of random, but reasonably realistic sample data,
the parameters of which were defined in the [populate-demo-db.js](/tasks/setup/populate-demo-db.js) file.
Alternativley, the path of previously generated or exported data can be specified,
and the database will be populated the that data.
An example filename parameter may look something like this:  [`/tasks/setup/sample-data.json`][sample-data].


## API

The frontend accesses it's data through the set of functions exposed by the backend.
There are **GET** routes for just returning data, and **POST** routes which update/
add new data, and require authentication.

All API calls are made from `BASE_URL/api/`, where `BASE_URL` is the URI of the app
root *(e.g. 'localhost', IP address or the domain pointing to main app)*

### /teams
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


### /team-sentiment
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


### /team-sentiment/:team-name
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


## Project Planning


### High-Level Flow Chart

![Flowchart](/docs/high-level-flow-chart.png "Flowchart")


### Wireframes

![Wireframes](/docs/Wireframes.png "Wireframes")



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
