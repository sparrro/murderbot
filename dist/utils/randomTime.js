"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInterval = void 0;
const randomInterval = () => {
    const sixHours = 1000 * 60 * 60 * 6;
    const aWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(Math.random() * (aWeek - sixHours + 1) + sixHours);
};
exports.randomInterval = randomInterval;
