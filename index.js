"use strict";

const Validator = require('./core')

module.exports = (app) => {
  app.validator = new Validator()

  app.context.validate = function (rules, data) {
    const { method, query, body } = this.request;
    let validateParams;
    switch (method) {
      case "GET":
        validateParams = query;
        break;
      case "POST":
      case "DELETE":
        validateParams = body;
        break;
      default:
        validateParams = {};
        break;
    }

    data = data || validateParams;
    const errors = app.validator.validate(rules, data);
    if (errors) {
      app.context.throw(422, 'Validation Failed', {
        code: 'invalid_param',
        errors,
      });
    }
  }
};
