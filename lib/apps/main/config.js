'use strict';
const config = {
  /**
   * Tools
   */
  tools: [
    {
      name: 'logger',
      module: 'cta-logger',
      properties: {},
      scope: 'all',
    },
    {
      name: 'messaging',
      module: 'cta-messaging',
      properties: {
        provider: 'rabbitmq',
        parameters: {
          url: 'amqp://localhost?heartbeat=60',
        },
      },
      singleton: true,
    },
    {
      name: 'healthcheck',
      module: 'cta-healthcheck',
      properties: {
        port: 8080,
        queue: 'healthcheck',
      },
      dependencies: {
        messaging: 'messaging',
      },
      scope: 'bricks',
      singleton: true,
    },
    {
      name: 'my-express',
      module: 'cta-expresswrapper',
      properties: {
        port: 3000,
      },
      singleton: true,
    },
  ],
  /**
   * Bricks
   */
  bricks: [
    {
      name: 'receiver',
      module: 'cta-io',
      dependencies: {
        messaging: 'messaging',
      },
      properties: {
        input: {
          queue: 'input.queue',
        },
      },
      publish: [{
        topic: 'multiplier.do',
        data: [{}],
      }],
    },
    {
      name: 'restapi',
      module: 'cta-restapi',
      dependencies: {
        express: 'my-express',
      },
      properties: {
        providers: [
          {
            name: 'myprovider',
            module: 'utils/restapi/handlers/find.js', // relative to where you launched your application
            routes: [
              {
                method: 'get', // http method get|post|put|delete
                handler: 'findOne', // name of the method in your provider
                path: '/executions/:id', // the route path
              },
            ],
          },
        ],
      },
      publish: [], // don't forget to define this property so that you are able to send jobs to the next bricks
    },
    {
      name: 'mongodblayer',
      module: 'cta-dblayer',
      properties: {
        provider: 'mongodb',
        configuration: {
          databasename: 'etap',
          servers: [
            {
              host: 'localhost',
              port: 27017,
            },
          ],
          options: {},
        },
      },
      publish: [],
    },
    // ...
    // then here you should define the bricks that will receive jobs from the restapi, for example business logic brick
    {
      name: 'logic',
      module: 'bricks/logic/index.js',
      properties: {},
      publish: [],
    },
  ],
};

module.exports = config;
