"use strict";
class Validator {
  constructor() {
    /**
     * default rules
     */
    this.defaultRules = {
      number: checkNumber,
      int: checkInt,
      string: checkString,
      boolean: checkBoolean,
      array: checkArray,
      multiple: checkMultiple
    };
  }

  /**
   * 
   * @param {object} rules 
   * @param {object} data 
   * @returns 
   */
  validate(rules, data) {
    if (typeof rules !== "object") {
      throw new TypeError("rules must be an object");
    }

    let errors = [];

    for (const key in rules) {
      if (Object.hasOwnProperty.call(rules, key)) {
        const validRule = formatRuleType(rules[key]); // rule
        const validValule = data[key]; // value

        const validateFn = this.defaultRules[validRule.type];

        if (!validateFn) {
          throw new TypeError(`rule type must be one of [${Object.keys(
            this.defaultRules
          ).join(", ")}], but found: ${validRule.type}`);
        }

        const res = validateFn.call(this, validRule.value, validValule)
        if (validRule.type === 'multiple' && res) {
          errors.push({
            error: res,
            filed: key
          })
        }
        if (validRule.type !== 'multiple') {
          const err = validateRes(res, validRule.type)
          err && errors.push({
            error: err,
            field: key
          })
        }
      }
    }

    if (errors.length) {
      return errors;
    }
  };

  /**
   * add rule
   * @param {string} rule 
   * @param {function} check 
   */
  addRule(rule, check) {
    if (typeof rule !== 'string') {
      throw TypeError('rule name must be a string')
    }
    if (typeof check !== 'function') {
      throw TypeError('handler must be a function')
    }
    this.defaultRules[rule] = check
  }
}

/**
 * validate check result
 * @param {*} res 
 * @param {*} rule
 * @returns 
 */
function validateRes(res, rule) {
  if (!res && res !== 'undefined') {
    return `should be a ${rule}`
  }
  if (typeof res === "string") {
    return res
  }
}

/**
 * format and build up rule object
 * @param {any} rule
 * @returns
 */
function formatRuleType(rule) {
  if (typeof rule === "string") {
    rule = { type: rule, value: rule };
  } else if (Array.isArray(rule)) {
    rule = { type: "multiple", value: rule };
  } else if (rule instanceof RegExp) {
    rule = { type: "reg", value: rule };
  } else if (Object.prototype.toString.call(rule) === "[object Object]") {
    rule = { type: "object", value: rule };
  }

  return rule
}

/**
 * 
 * @param {object} rule 
 * @param {any} value 
 * @returns 
 */
function checkNumber(rule, value) {
  if (isNaN(value)) {
    return false;
  }
  if (rule.hasOwnProperty("max") &&
    value > rule.max
  ) {
    return `should smaller than ${rule.max}`;
  }
  if (rule.hasOwnProperty("min") &&
    value < rule.min
  ) {
    return `should bigger than ${rule.min}`;
  }
  return true
}

/**
 * 
 * @param {object} rule 
 * @param {any} value 
 * @returns 
 */
function checkInt(rule, value) {
  if (isNaN(value) || value % 1 !== 0) {
    return 'should be an integer';
  }

  if (rule.hasOwnProperty('max') && value > rule.max) {
    return `should smaller than ${rule.max}`;
  }

  if (rule.hasOwnProperty('min') && value < rule.min) {
    return `should bigger than ${rule.min}`;
  }
}

/**
 * 
 * @param {object} rule 
 * @param {any} value 
 * @returns 
 */
function checkString(rule, value) {
  return typeof value === "string";
}

/**
 * 
 * @param {object} rule 
 * @param {any} value 
 * @returns 
 */
function checkBoolean(rule, value) {
  return typeof value === "boolean";
}

/**
 * 
 * @param {object} rule 
 * @param {any} value 
 * @returns 
 */
function checkArray(rule, value) {
  if (!Array.isArray(value)) return false
}

/**
 * 
 * @param {object} rule 
 * @param {any} value 
 * @returns 
 */
function checkMultiple(rule, value) {
  const _this = this
  let errors = []
  rule.forEach(r => {
    const validateFn = _this.defaultRules[r]
    const res = validateFn(r, value)
    const err = validateRes(res, r)
    err && errors.push(err)
  })
  if (errors.length === rule.length) {
    return `should be one of [${rule}]`
  }
}

module.exports = Validator