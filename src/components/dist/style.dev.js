"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Canvas = exports.Board = exports.Container = void 0;

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _core = require("@emotion/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n  background-color: white;\n  width: 100%;\n  height: 100%;\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n  ", "\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  top: calc(50% + 10px);\n  left: 50%;\n  transform: translate(-50%, -50%);\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n        height: calc((100vh - 112px) * 0.95);\n        width: calc((100vh - 112px) * 0.95);\n        position: relative;\n        margin-right: 200px;\n        box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);\n        cursor: url(http://www.javascriptkit.com/dhtmltutors/cursor-hand.gif),\n          auto;\n      "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n        height: 100vh;\n        width: 100vw;\n      "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        height: 86vh;\n        width: 100vw;\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var setDimensions = function setDimensions(full, isMobile) {
  switch (true) {
    case isMobile:
      return (0, _core.css)(_templateObject());

    case full:
      return (0, _core.css)(_templateObject2());

    default:
      return (0, _core.css)(_templateObject3());
  }
};

var Container = _styled["default"].div(_templateObject4());

exports.Container = Container;

var Board = _styled["default"].div(_templateObject5(), function (_ref) {
  var full = _ref.full,
      isMobile = _ref.isMobile;
  return setDimensions(full, isMobile);
});

exports.Board = Board;

var Canvas = _styled["default"].canvas(_templateObject6());

exports.Canvas = Canvas;