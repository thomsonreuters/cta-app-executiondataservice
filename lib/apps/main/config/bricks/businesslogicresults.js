/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

module.exports = {
  name: 'results-businesslogic',
  module: './bricks/businesslogics/results/index.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
  properties: {},
  publish: [
    {
      topic: 'io.message.acknowledge',
      data: [
        {
          nature: {
            type: 'messages',
            quality: 'acknowledge',
          },
        },
      ],
    },
    {
      topic: 'dbInterface',
      data: [
        {
          nature: {
            type: 'dbInterface',
          },
        },
      ],
    },
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
  ],
  subscribe: [
    {
      topic: 'bl.results',
      data: [
        {
          nature: {
            type: 'results',
            quality: 'create',
          },
        },
        {
          nature: {
            type: 'results',
            quality: 'findById',
          },
        },
        {
          nature: {
            type: 'results',
            quality: 'update',
          },
        },
        {
          nature: {
            type: 'results',
            quality: 'delete',
          },
        },
        {
          nature: {
            type: 'results',
            quality: 'find',
          },
        },
      ],
    },
  ],
};
