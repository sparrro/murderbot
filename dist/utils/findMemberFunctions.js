"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTheOne = exports.findAllMembers = exports.findFather = exports.findByUsername = exports.findMods = void 0;
const config_1 = require("../config");
const findMods = (server) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.members.fetch();
    const modRoles = ["MOD", "Moderator"]; //MOD is redundant but it still works so whatever
    const mods = server.members.cache.filter(member => member.roles.cache.some(role => modRoles.includes(role.name))).values();
    return mods;
});
exports.findMods = findMods;
const findByUsername = (server, username) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.members.fetch();
    return server.members.cache.filter(member => member.user.username === username).first();
});
exports.findByUsername = findByUsername;
const findFather = (server) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.members.fetch();
    return server.members.cache.find(user => user.id === config_1.MY_ID);
});
exports.findFather = findFather;
const findAllMembers = (server) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.members.fetch();
    return server.members.cache.values();
});
exports.findAllMembers = findAllMembers;
const findTheOne = (server) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.members.fetch();
    return server.members.cache.find(user => user.id === config_1.AMY_ID);
});
exports.findTheOne = findTheOne;
