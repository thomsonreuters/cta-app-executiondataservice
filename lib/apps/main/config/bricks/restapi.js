'use strict';

module.exports = {
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
            handler: 'create', // name of the method in your provider
            path: '/eds/executions', // the route path
          },
          {
            method: 'put', // http method get|post|put|delete
            handler: 'create', // name of the method in your provider
            path: '/eds/executions/:id', // the route path
          },
          {
            method: 'patch', // http method get|post|put|delete
            handler: 'update', // name of the method in your provider
            path: '/eds/executions/:id', // the route path
          },
          {
            method: 'get', // http method get|post|put|delete
            handler: 'findById', // name of the method in your provider
            path: '/eds/executions/:id', // the route path
          },
          {
            method: 'delete', // http method get|post|put|delete
            handler: 'delete', // name of the method in your provider
            path: '/eds/executions/:id', // the route path
          },
          {
            method: 'get', // http method get|post|put|delete
            handler: 'find', // name of the method in your provider
            path: '/eds/executions', // the route path
          },
          {
            method: 'post', // http method get|post|put|delete
            handler: 'actions', // name of the method in your provider
            path: '/eds/executions/:id/actions', // the route path
          },
        ],
      },
      {
        name: 'results',
        module: './utils/restapi/handlers/results.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
        routes: [
          {
            method: 'post', // http method get|post|put|delete
            handler: 'create', // name of the method in your provider
            path: '/eds/results', // the route path
          },
          {
            method: 'get', // http method get|post|put|delete
            handler: 'find', // name of the method in your provider
            path: '/eds/results', // the route path
          },
        ],
      },
      {
        name: 'states',
        module: './utils/restapi/handlers/states.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
        routes: [
          {
            method: 'post', // http method get|post|put|delete
            handler: 'create', // name of the method in your provider
            path: '/eds/states', // the route path
          },
          {
            method: 'get', // http method get|post|put|delete
            handler: 'find', // name of the method in your provider
            path: '/eds/states', // the route path
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
            type: 'executions',
          },
        },
      ],
    },
    {
      topic: 'bl.results',
      data: [
        {
          nature: {
            type: 'results',
          },
        },
      ],
    },
    {
      topic: 'bl.states',
      data: [
        {
          nature: {
            type: 'states',
          },
        },
      ],
    },
  ], // don't forget to define this property so that you are able to send jobs to the next bricks
};
