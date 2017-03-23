Execution Data Service for Compass Test Automation
======
[![build status](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/badges/master/build.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/commits/master)[![coverage report](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/badges/master/coverage.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/commits/master)
------
* General Overview
  * [Overview](#overview)
  * [Features](#features)
* Getting Started
  * [Install](#Getting-Started)
  * A
* Development Guide
  * [Contributing](#contributing)
  * [More Information](#more-information)

------

## Overview
Execution Data Service (EDS) is an intermediary brick between JobManager and Instance Data Service, which provides the services to matching message. When the scenario request test to cta-client, EDS will assign the matched execution test to the cta-client.

## Features
Please check the [feature guide](https://git.sami.int.thomsonreuters.com/compass/cta/blob/master/features.md) for a list of all features provided by CTA.

------

# Getting Started
To build, be sure you have [node](https://nodejs.org/en/) installed. Clone the project:
```ruby
git clone git@git.sami.int.thomsonreuters.com:compass/cta-app-executiondataservice.git
```
Then in the cloned directory, simply run:
```ruby
npm install
```
And you will have the boilerplate example running on http://localhost:8000

# Development Guide

## Contributing
You can follow [these steps](https://git.sami.int.thomsonreuters.com/compass/cta/blob/master/contributing.md) to contribute.

## More Information
Our service is composed of different components working together to schedule, run, collect tests results and more. You can find additional information for more understand in Execution Data Service.
We also cover in detail :
* The [Rest API](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/wikis/restapi) is composed of multiple REST service to perform actions on CTA.
* A [DataContract](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/wikis/datacontract) is a formal agreement between a bricks.
* The [Document](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/wikis/document) associated with a software project and the system being.
* A [Sequence Diagrams](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/wikis/sequencediagram) is an interaction diagram that shows how objects operate with one another and in what order.

------

This code is running live at [CTA-OSS](https://www.). We also have [CTA Central Document](https://git.sami.int.thomsonreuters.com/compass/cta) 
