# Execution Data Contracts

## Input
* [Create a State](#create-a-state)
* [Create a Result](#create-a-result)

## Output
* [Instance update event](#instance-update-event)
* [Notification event](#notification-event)

### Create a State:
Contract: 
```javascript
{
    "nature": {
        "type": "state",
        "quality": "create"
      },
    "payload": {
        "executionId": id(Execution),
        "timestamp": Long,
        "status": String,
        "index": Long,
        "hostname": String
    }
}
```
Example: 
```javascript
{
    "nature": {
        "type": "state",
        "quality": "create"
      },
    "payload": {
        "executionId": "57c7edbc327a06452c50c984",
        "timestamp": 10,
        "status": "finished",
        "index": 1,
        "hostname": "mymachine"
    }
}
```

## Create a Result:
Contract: 
```javascript
{
    "nature": {
        "type": "result",
        "quality": "create"
      },
    "payload": {
        "executionId": id(Execution),
        "testId": id(Test),
        "timestamp": Long,
        "status": String,
        "index": Long,
        "hostname": String
    }
}
```
Example: 
```javascript
{
    "nature": {
        "type": "result",
        "quality": "create"
      },
    "payload": {
        "executionId": "57c7edbc327a06452c50c984",
        "testId": "57bc0db530b0d82a183ceb91",
        "timestamp": 10,
        "status": "failed",
        "index": 1,
        "hostname": "mymachine"
    }
}
```

### Instance Update Event:
Contract: 
```javascript
{
    "nature": {
        "type": "instances",
        "quality": "update"
      },
    "payload": {
        "hostname": String,
        "executionId": id(Execution),
        "state": String,
    }
}
```
Example: 
```javascript
{
    "nature": {
        "type": "instances",
        "quality": "update"
      },
    "payload": {
        "hostname": "mymachine",
        "executionId": "57c7edbc327a06452c50c984",
        "state": "running",
    }
}
```