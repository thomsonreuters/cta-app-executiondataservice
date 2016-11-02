# Execution Data Service application for Compass Test Automation

#### Rest API
* [Create an Execution](#create-an-execution)
* [Find an Execution by Id](#find-an-execution-by-id)
* [Update an Execution](#update-an-execution)
* [Delete an Execution](#delete-an-execution)
* [Cancel an Execution](#cancel-an-execution)
* [Create a Result](#create-a-result)
* [Create a State](#create-a-state)

#### Create an Execution
**Request**
```ruby
POST /executions
{
  "scenarioId" : "580dd766810970de88fe7201",
  "userId" : "580dd766810970de88fe7202",
  "pendingTimeout": 360000,
  "runningTimeout": 360000,
  "commandsCount" : 1,
  "state" : "pending",
  "instances": []
}
```

**Response**
```ruby
{
  "id": "581995b77a784529a0f5eadb",
  "scenarioId": "580dd766810970de88fe7201",
  "userId": "580dd766810970de88fe7202",
  "createTimestamp": 1478071735679,
  "updateTimestamp": null,
  "completeTimestamp": null,
  "pendingTimeout": 360000,
  "runningTimeout": 360000,
  "pendingTimeoutScheduleId": "581995b75c29260e30ff5a6f",
  "result": null,
  "ok": 0,
  "partial": 0,
  "inconclusive": 0,
  "failed": 0,
  "resultsCount": 0,
  "instances": [],
  "commandsCount": 1,
  "state": "pending",
  "cancelDetails": null
}
```

#### Find a schedule by Id
**Request**
```ruby
GET /executions/:id
```
**Response**
```ruby
{
  "id": "581995b77a784529a0f5eadb",
  "scenarioId": "580dd766810970de88fe7201",
  "userId": "580dd766810970de88fe7202",
  "createTimestamp": 1478071735679,
  "updateTimestamp": null,
  "completeTimestamp": null,
  "pendingTimeout": 360000,
  "runningTimeout": 360000,
  "pendingTimeoutScheduleId": "581995b75c29260e30ff5a6f",
  "pendingTimestamp": 1478072095679,
  "result": null,
  "ok": 0,
  "partial": 0,
  "inconclusive": 0,
  "failed": 0,
  "resultsCount": 0,
  "instances": [],
  "commandsCount": 1,
  "state": "pending",
  "cancelDetails": null
}
```

#### Update a schedule
**Request**
```ruby
PATCH /executions/:id
{
  "scenarioId": "580dd766810970de88fe7203"
}
```
**Response**
```ruby
{
  "id": "581995b77a784529a0f5eadb",
  "scenarioId": "580dd766810970de88fe7203",
  "userId": "580dd766810970de88fe7202",
  "createTimestamp": 1478071735679,
  "updateTimestamp": null,
  "completeTimestamp": null,
  "pendingTimeout": 360000,
  "runningTimeout": 360000,
  "pendingTimeoutScheduleId": "581995b75c29260e30ff5a6f",
  "pendingTimestamp": 1478072095679,
  "result": null,
  "ok": 0,
  "partial": 0,
  "inconclusive": 0,
  "failed": 0,
  "resultsCount": 0,
  "instances": [],
  "commandsCount": 1,
  "state": "pending",
  "cancelDetails": null
}
```

#### Delete an Execution
**Request**
```ruby
DELETE /executions/:id
```
**Response**
```ruby
{
  "id": "581995b77a784529a0f5eadb",
  "scenarioId": "580dd766810970de88fe7203",
  "userId": "580dd766810970de88fe7202",
  "createTimestamp": 1478071735679,
  "updateTimestamp": null,
  "completeTimestamp": null,
  "pendingTimeout": 360000,
  "runningTimeout": 360000,
  "pendingTimeoutScheduleId": "581995b75c29260e30ff5a6f",
  "pendingTimestamp": 1478072095679,
  "result": null,
  "ok": 0,
  "partial": 0,
  "inconclusive": 0,
  "failed": 0,
  "resultsCount": 0,
  "instances": [],
  "commandsCount": 1,
  "state": "pending",
  "cancelDetails": null
}
```

#### Cancel an Execution
**Request**
```ruby
POST /executions/:id/actions
{
  "action" : "cancel"
}
```

**Response**
```ruby
{
  // response from JMS Cancel API
}
```

#### Create a Result
**Request**
```ruby
POST /results
{
  "executionId": "57c7edbc327a06452c50c984",
  "testId": "57bc0db530b0d82a183ceb91",
  "timestamp": 10,
  "status": "failed",
  "index": 1,
  "hostname": "mymachine"
}
```
**Response**
```ruby
{
  "id": "5819a08d7a784529a0f5eae2",
  "executionId": "57c7edbc327a06452c50c984",
  "testId": "57bc0db530b0d82a183ceb91",
  "timestamp": 10,
  "status": "failed",
  "index": 1,
  "hostname": "mymachine"
}
```

#### Create a State
**Request**
```ruby
POST /states
{
  "executionId": "57c7edbc327a06452c50c984",
  "timestamp": 10,
  "status": "finished",
  "index": 1,
  "hostname": "mymachine"
}
```
**Response**
```ruby
{
  "id": "5819a08d7a784529a0f5eae2",
  "executionId": "57c7edbc327a06452c50c984",
  "timestamp": 10,
  "status": "finished",
  "index": 1,
  "hostname": "mymachine"
}
```
