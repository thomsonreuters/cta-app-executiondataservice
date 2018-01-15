# cta-app-executiondataservice
[![build status](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/badges/master/build.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/commits/master) [![coverage report](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/badges/master/coverage.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/commits/master)

**Execution Data Service Application (EDS)**  for Compass Test Automation, implementing CTA-OSS Framework

## General Overview

### Overview
Execution Data Service (EDS) performing as a service for manage an execution. EDS will received request from Job Manager Service such as create, update and cancel an execution, in the other round EDS will be provide state and status back to the requestor.

For detail, please go to our [**CTA Main Repository**](https://github.com/thomsonreuters/cta).

### Features
  * Create,update and delete an execution.
  * Cancel and Timeout an execution procress.
  * Status and State Management

## Guidelines

* [Getting Start](#getting-start)
  * [Prerequisites](#prerequisites) 
  * [Installation & Startup](#installation-startup)
* [Development Guide](#development-guide)
  * [Contributing](#contributing)
  * [More Information](#more-information)

## Getting Start

### Prerequisites
 1. Front End skills required include `HTML`, `CSS`, `JavaScript`, `JSON`. 
 2. Back End development using `Node.js`, `Express,` and `MongoDB`. It also important concept of source control using `Git`.

### Installation & Startup
The easiest way to get started is to clone the repository:
```bash
git clone git@git.sami.int.thomsonreuters.com:compass/cta-app-executiondataservice.git
```
Then install NPM dependencies:
```bash
npm install
```
To build, be sure you have [node](https://nodejs.org/en/) installed.

To start the application, browse to the project directory and type: `npm run start` into the terminal window. Point a browser to localhost:3010 and you're up and running!

## Development Guide

### Contributing
You can follow [these steps](https://github.com/thomsonreuters/cta/blob/master/contributing.md) to contribute.

### More Information
Our service is composed of different components working together to schedule, run, collect tests results and more. You can find additional information for more understand in Execution Data Service.
We also cover in detail :
* The Rest API is composed of multiple REST service to perform actions on CTA.
* A DataContract is a formal agreement between a bricks.
* The Document associated with a software project and the system being.
* A Sequence Diagrams is an interaction diagram that shows how objects operate with one another and in what order.
