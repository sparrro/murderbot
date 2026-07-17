"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInterval = void 0;
const randomInterval = () => {
    const threeHours = 1000 * 60 * 60 * 3;
    const aWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(Math.random() * (aWeek - threeHours + 1) + threeHours);
};
exports.randomInterval = randomInterval;
