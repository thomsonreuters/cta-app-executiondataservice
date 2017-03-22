Execution Data Service for Compass Test Automation
======
[![build status](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/badges/master/build.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/commits/master)[![coverage report](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/badges/master/coverage.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-app-executiondataservice/commits/master)
------
* General Overview
  * [Overview](#overview)
  * [Features](#features)
* Getting Started
  * A
  * A
* Development Guide
  * [Contributing](#contributing)
  * [More Information](#more-information)

------

# General Overview
Execution Data Service (EDS) provides the service to register the instance which run the cta-client to CTA system. When the instance is registered, CTA system will assign the matched execution test to the cta-client. Any CTA’s services need IDS to check the information then IDS will provides the instance’s status (available or being executing the test) and the test script result base on the test script logics.

EDS provides the services to matching message between cta-instance and test suite of each scenario. When the scenario request to test    

The Instance Matching tool is a function that can be used to queue your character in a selected dungeon. To access the instance matching tool, 
## Overview
Please tell me a little about Execution Data Service

## Features
Please check the [feature guide](https://git.sami.int.thomsonreuters.com/compass/cta/blob/master/features.md) for a list of all features provided by CTA.

------

# Getting Started
* npm lib/app.js
* config

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
