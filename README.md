## Contents
 1. [Project Introduction](#introduction)
 1. [Development Setup](#development-setup)
 2. [Production Setup](#production-setup)
 3. [Test Environment](#test-environment)
 4. [Data](#data)
 5. [API](#api)


## Introduction

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

## Data

All data is anonymised, a one-way hash is created from the users email address, 
which is used by the system to uniquely identify them, but this is not displayed
to users/ admins. 


User data is represented in the [following JSON format](docs/example-json-struct.png): 
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
the parameters of which were defined in the [populate-demo-db.js](`/tasks/setup/populate-demo-db.js`) file. 
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
Returns all recorded sentiment data for any given team

- **URL:** `/team-sentiment/`
- **Method:** `GET`
- **URL Params:** `teamName` (the name of the team, as a String)
- **Success Response:**
  - **Code:** `200`
  - **Content:** `{teamName: '', data: { [.....] }}` (See the above section on [data](#data) format)
- **Error Response:**
  - **Code:** `200`
  - **Content:** `{}`

[sample-data]: /tasks/setup/sample-data.json

[1]:http://www.json-generator.com/
[2]: https://docs.mongodb.com/v3.0/tutorial/getting-started-with-the-mongo-shell/

