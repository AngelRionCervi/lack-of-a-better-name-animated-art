"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var animejs_1 = __importDefault(require("animejs"));
var styleProxy = {
    get: function (object, property) {
        return function (value) {
            if (value) {
                object[property] = value;
                return new Proxy(object, styleProxy);
            }
            return object[property];
        };
    },
};
var style = function (element) {
    return new Proxy(element.style, styleProxy);
};
var container = document.querySelector(".circles-container");
var circles = document.querySelectorAll(".circle");
var cw = container.offsetWidth;
var ch = container.offsetHeight;
var baseRadius = 600;
var getCenter = function (radius) {
    return [cw / 2 - radius / 2, ch / 2 - radius / 2];
};
__spreadArrays(circles).reverse().forEach(function (circle, index, arr) {
    var radius = Math.round(baseRadius * ((index + 0.5) / arr.length)); //Math.round((index + circles.length) * ((index+0.5) * (circles.length/50)));
    var _a = getCenter(radius), x = _a[0], y = _a[1];
    style(circle).left(x + "px").top(y + "px").width(radius + "px").height(radius + "px");
});
var droplet = function () {
    circles.forEach(function (circle, index) {
        var top = parseInt(circle.style.top.replace("px", "")) - index * 11;
        style(circle).top(top + "px");
    });
    var circlesArr = __spreadArrays(circles).reverse();
    var circlesToAnimate = __spreadArrays(circlesArr).splice(0, 16);
    animejs_1.default({
        targets: circlesToAnimate,
        delay: animejs_1.default.stagger(50, { easing: "linear" }),
        top: [
            {
                value: function (el, index) {
                    return "+=" + (circlesToAnimate.length - index - 1) * 22;
                },
                duration: 2000,
            },
            {
                value: function (el, index) {
                    return "-=" + (circlesToAnimate.length - index - 1) * 22;
                },
                duration: 2000,
            },
        ],
        easing: "easeInOutQuad",
        loop: true,
        direction: "alternate",
    });
};
//droplet();
