'use strict';
const config = {
  name: 'execution-dataservice',
  /**
   * Tools
   */
  tools: [
    {
      name: 'logger',
      module: 'cta-logger',
      properties: {
        level: 'info',
      },
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
      name: 'my-express',
      module: 'cta-expresswrapper',
      properties: {
        port: 3000,
      },
      singleton: true,
    },
    {
      name: 'healthcheck',
      module: 'cta-healthcheck',
      properties: {
        queue: 'healthcheck',
      },
      dependencies: {
        messaging: 'messaging',
        express: 'my-express',
      },
      scope: 'bricks',
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
            name: 'executions',
            module: './utils/restapi/handlers/executions.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
            routes: [
              {
                method: 'post', // http method get|post|put|delete
                handler: 'save', // name of the method in your provider
                path: '/executions', // the route path
              },
              {
                method: 'get', // http method get|post|put|delete
                handler: 'findById', // name of the method in your provider
                path: '/executions/:id', // the route path
              },
              {
                method: 'delete', // http method get|post|put|delete
                handler: 'delete', // name of the method in your provider
                path: '/executions/:id', // the route path
              },
            ],
          },
        ],
      },
      publish: [
        {
          topic: 'bl.executions',
          data: [
            {
              nature: {
                type: 'execution',
              },
            },
          ],
        },
      ], // don't forget to define this property so that you are able to send jobs to the next bricks
    },
    {
      name: 'mongodblayer',
      module: 'cta-dblayer',
      properties: {
        provider: 'mongodb',
        configuration: {
          databasename: 'oss',
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
      subscribe: [
        {
          topic: 'dblayer',
          data: [
            {
              nature: {
                type: 'database',
                quality: 'query',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'executions-businesslogic',
      module: './bricks/businesslogics/execution/index.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
      properties: {},
      publish: [
        {
          topic: 'dbinterface',
          data: [
            {
              nature: {
                type: 'dbinterface',
              },
            },
          ],
        },
      ],
      subscribe: [
        {
          topic: 'bl.executions',
          data: [
            {
              nature: {
                type: 'execution',
                quality: 'create',
              },
            },
            {
              nature: {
                type: 'execution',
                quality: 'findbyid',
              },
            },
            {
              nature: {
                type: 'execution',
                quality: 'update',
              },
            },
            {
              nature: {
                type: 'execution',
                quality: 'delete',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'dbinterface-mongodb',
      module: './bricks/dbinterfaces/mongodbinterface/index.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
      properties: {},
      publish: [
        {
          topic: 'dblayer',
          data: [
            {
              nature: {
                type: 'database',
                quality: 'query',
              },
            },
          ],
        },
      ],
      subscribe: [
        {
          topic: 'dbinterface',
          data: [
            {
              nature: {
                type: 'dbinterface',
              },
            },
          ],
        },
      ],
    },
  ],
};

module.exports = config;
