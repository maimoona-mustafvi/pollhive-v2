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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKafkaProducer = getKafkaProducer;
exports.publishVoteEvent = publishVoteEvent;
exports.initKafkaConsumer = initKafkaConsumer;
// lib/kafka.ts
var kafkajs_1 = require("kafkajs");
var mongodb_1 = require("./mongodb");
var Vote_1 = __importDefault(require("@/models/Vote"));
var Participant_1 = __importDefault(require("@/models/Participant"));
var Session_1 = __importDefault(require("@/models/Session"));
var Poll_1 = __importDefault(require("@/models/Poll"));
var socket_1 = require("./socket");
var kafka = new kafkajs_1.Kafka({
    clientId: 'pollhive',
    brokers: [(_a = process.env.KAFKA_BROKER) !== null && _a !== void 0 ? _a : 'localhost:9092'],
});
// ─── Producer ────────────────────────────────────────────────────────────────
function getKafkaProducer() {
    return __awaiter(this, void 0, void 0, function () {
        var producer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (global._kafkaProducer)
                        return [2 /*return*/, global._kafkaProducer];
                    producer = kafka.producer();
                    return [4 /*yield*/, producer.connect()];
                case 1:
                    _a.sent();
                    global._kafkaProducer = producer;
                    return [2 /*return*/, producer];
            }
        });
    });
}
function publishVoteEvent(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var producer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getKafkaProducer()];
                case 1:
                    producer = _a.sent();
                    return [4 /*yield*/, producer.send({
                            topic: 'votes',
                            messages: [
                                {
                                    key: payload.roomCode, // same room = same partition = ordered
                                    value: JSON.stringify(payload),
                                },
                            ],
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ─── Consumer ────────────────────────────────────────────────────────────────
function initKafkaConsumer() {
    return __awaiter(this, void 0, void 0, function () {
        var consumer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    consumer = kafka.consumer({ groupId: 'vote-processor' });
                    return [4 /*yield*/, consumer.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, consumer.subscribe({ topic: 'votes', fromBeginning: false })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, consumer.run({
                            eachMessage: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                var _c, roomCode, sessionId, participantId, optionId, session, poll, existing, selectedOption, isCorrect, pointsEarned, basePoints, timerSeconds, elapsed, timeRatio, timeBonus, votes, tally, _i, _d, o, _e, votes_1, v;
                                var _f, _g, _h;
                                var message = _b.message;
                                return __generator(this, function (_j) {
                                    switch (_j.label) {
                                        case 0:
                                            if (!message.value)
                                                return [2 /*return*/];
                                            _c = JSON.parse(message.value.toString()), roomCode = _c.roomCode, sessionId = _c.sessionId, participantId = _c.participantId, optionId = _c.optionId;
                                            return [4 /*yield*/, (0, mongodb_1.connectDB)()];
                                        case 1:
                                            _j.sent();
                                            return [4 /*yield*/, Session_1.default.findById(sessionId)];
                                        case 2:
                                            session = _j.sent();
                                            return [4 /*yield*/, Poll_1.default.findById(session === null || session === void 0 ? void 0 : session.pollId)];
                                        case 3:
                                            poll = _j.sent();
                                            if (!session || !poll)
                                                return [2 /*return*/];
                                            return [4 /*yield*/, Vote_1.default.findOne({ sessionId: sessionId, participantId: participantId })];
                                        case 4:
                                            existing = _j.sent();
                                            if (existing)
                                                return [2 /*return*/];
                                            selectedOption = poll.options.find(function (o) { return o.id === optionId; });
                                            if (!selectedOption)
                                                return [2 /*return*/];
                                            isCorrect = poll.mode === 'quiz' ? Boolean(selectedOption.isCorrect) : false;
                                            pointsEarned = 0;
                                            if (poll.mode === 'quiz' && isCorrect) {
                                                basePoints = (_f = poll.points) !== null && _f !== void 0 ? _f : 100;
                                                timerSeconds = (_g = poll.timerSeconds) !== null && _g !== void 0 ? _g : 20;
                                                if (session.timerStartedAt) {
                                                    elapsed = (Date.now() - session.timerStartedAt.getTime()) / 1000;
                                                    timeRatio = Math.max(0, 1 - elapsed / timerSeconds);
                                                    timeBonus = Math.round(basePoints * 0.5 * timeRatio);
                                                    pointsEarned = basePoints + timeBonus;
                                                }
                                            }
                                            // Save vote
                                            return [4 /*yield*/, Vote_1.default.create({ sessionId: sessionId, participantId: participantId, optionId: optionId, isCorrect: isCorrect, answeredAt: new Date() })
                                                // Update participant score
                                            ];
                                        case 5:
                                            // Save vote
                                            _j.sent();
                                            // Update participant score
                                            return [4 /*yield*/, Participant_1.default.findByIdAndUpdate(participantId, {
                                                    $inc: { score: pointsEarned },
                                                    $push: { answers: { optionId: optionId, answeredAt: new Date(), pointsEarned: pointsEarned } },
                                                })
                                                // Recompute tally and broadcast via Socket.io
                                            ];
                                        case 6:
                                            // Update participant score
                                            _j.sent();
                                            return [4 /*yield*/, Vote_1.default.find({ sessionId: sessionId })];
                                        case 7:
                                            votes = _j.sent();
                                            tally = {};
                                            for (_i = 0, _d = poll.options; _i < _d.length; _i++) {
                                                o = _d[_i];
                                                tally[o.id] = 0;
                                            }
                                            for (_e = 0, votes_1 = votes; _e < votes_1.length; _e++) {
                                                v = votes_1[_e];
                                                tally[v.optionId] = ((_h = tally[v.optionId]) !== null && _h !== void 0 ? _h : 0) + 1;
                                            }
                                            (0, socket_1.emitToRoom)(roomCode, 'vote_update', {
                                                tally: tally,
                                                totalVotes: votes.length,
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        })];
                case 3:
                    _a.sent();
                    console.log('[Kafka] Consumer running on topic: votes');
                    return [2 /*return*/];
            }
        });
    });
}
