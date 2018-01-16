/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';
const nodeUrl = require('url');
const BaseHelper = require('../../base/basehelper.js');
const validate = require('cta-common').validate;

/**
 * Business Logic Execution Helper Cancel class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Complete extends BaseHelper {
  constructor(cementHelper, logger, apiURLs) {
    super(cementHelper, logger);

    if (!validate(apiURLs.scenarioApiUrl, { type: 'string' }).isValid) {
      throw (new Error(
        'missing/incorrect \'scenarioApiUrl\' string in application global properties'
      ));
    }
    this.scenarioApiUrl = apiURLs.scenarioApiUrl;
  }

  /**
   * Validates Context properties specific to this Helper
   * Validates Query Execution Model fields
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) {
    const job = context.data;
    return new Promise((resolve, reject) => {
      if (!validate(job.payload.id, { type: 'identifier' }).isValid) {
        reject(new Error('missing/incorrect \'id\' String value of ObjectID in job payload'));
      }
      resolve({ ok: 1 });
    });
  }

  /**
   * Process the context
   * @param {Context} context - a Context
   */
  _process(context) {
    const that = this;
    const execution = context.data.payload.content;
    that._getScenario(context, execution);
  }

  _getScenario(context, execution) {
    const that = this;

    const requestScenario = {
      nature: {
        type: 'request',
        quality: 'get',
      },
      payload: {
        url: nodeUrl.resolve(
          that.scenarioApiUrl, `scenarios/${execution.scenarioId}`),
      },
    };
    const requestScenarioContext = this.cementHelper.createContext(requestScenario);
    requestScenarioContext.on('done', function(brickName, reqResponse) {
      context.emit('done', that.cementHelper.brickName, reqResponse.data.afterHandlers);
      that._publishNotification(context, execution, reqResponse.data);
    });
    requestScenarioContext.on('reject', function(brickName, error) {
      context.emit('reject', brickName, error);
    });
    requestScenarioContext.on('error', function(brickName, error) {
      context.emit('error', brickName, error);
    });
    requestScenarioContext.publish();
  }


  _publishNotification(context, execution, scenario) {
    const that = this;
    const afterHandler = scenario.afterHandlers[0];
    const notificationMessage = {
      nature: {
        type: 'afterhandler',
        quality: 'email',
      },
      payload: {
        template: afterHandler.template || 'test-report',
        data: {
          subject: `CTA-OSS Notification - ${scenario.name} -  ${execution.state} - ${execution.result} - results:{ ok: ${execution.ok}, partial: ${execution.partial}, inconclusive: ${execution.inconclusive}, failed: ${execution.failed} }`,
          name: `${scenario.name}`,
          execution,
        },
        mailerConfiguration: {
          from: afterHandler.from || 'cta@thomsonreuters.com',
          to: afterHandler.properties.emails.join(','),
          smtpServer: afterHandler.smtpServer || 'mailhub.tfn.com',
          ignoreTLS:  afterHandler.ignoreTLS || true,
          debug: false,
        },
      },
    };
    const payload = {
      queue: 'cta.nos.notifications',
      content: notificationMessage,
    };

    that.logger.log(JSON.stringify(payload));

    const notificationMessageContext = that.cementHelper.createContext({
      nature: {
        type: 'messages',
        quality: 'produce',
      },
      payload,
    });

    notificationMessageContext.on('done', function(brickName, reqResponse) {
      context.emit('done', that.cementHelper.brickName, reqResponse);
    });
    notificationMessageContext.on('reject', function(brickName, error) {
      context.emit('reject', brickName, error);
    });
    notificationMessageContext.on('error', function(brickName, error) {
      context.emit('error', brickName, error);
    });
    notificationMessageContext.publish();
  }
}

module.exports = Complete;
