/**
 * 公式ノード http in ベース
 * @see https://raw.githubusercontent.com/node-red/node-red/master/packages/node_modules/@node-red/nodes/core/network/21-httpin.js
 */

module.exports = function (RED) {
    'use strict';

    const bodyParser = require('body-parser');
    const cors = require('cors');

    function createResponseWrapper(node, res) {
        const wrapper = {
            _res: res
        };
        const toWrap = [
            'append',
            'attachment',
            'cookie',
            'clearCookie',
            'download',
            'end',
            'format',
            'get',
            'json',
            'jsonp',
            'links',
            'location',
            'redirect',
            'render',
            'send',
            'sendfile',
            'sendFile',
            'sendStatus',
            'set',
            'status',
            'type',
            'vary'
        ];
        toWrap.forEach(function (f) {
            wrapper[f] = function () {
                node.warn(RED._('webhook.errors.deprecated-call', { method: 'msg.res.' + f }));
                const result = res[f].apply(res, arguments);
                if (result === res) {
                    return wrapper;
                } else {
                    return result;
                }
            }
        });
        return wrapper;
    }

    let corsHandler = function (req, res, next) { next(); }

    if (RED.settings.httpNodeCors) {
        corsHandler = cors(RED.settings.httpNodeCors);
        RED.httpNode.options('*', corsHandler);
    }

    // LINEイベント種別から適切な文字列を返す
    function eventToString(event) {
        if (event.type === 'message') {
            // メッセージ系イベント
            switch (event.message.type) {
                case 'text':
                    return event.message.text;
                case 'image':
                case 'video':
                case 'audio':
                case 'file':
                    // 実装予定
                    return '(media)';
                case 'location':
                    return event.message.address;
                case 'sticker':
                    return '(sticker)';
                default:
                    return '(unknown message event)';
            }
        } else {
            // メッセージじゃない
            switch (event.type) {
                case 'unsend':
                    return '(unsend)';
                case 'follow':
                    return '(follow)';
                case 'unfollow':
                    return '(unfollow)';
                case 'join':
                    return '(join)';
                case 'leave':
                    return '(leave)';
                case 'memberJoined':
                    return '(memberJoined)';
                case 'memberLeft':
                    return '(memberLeft)';
                case 'postback':
                    if (event.postback.params.datetime) return event.postback.params.datetime;
                    else if (event.postback.params.newRichMenuAliasId) return event.postback.params.newRichMenuAliasId;
                    else '(postback)';
                case 'videoPlayComplete':
                    return 'videoPlayComplete';
                case 'beacon':
                    return (event.beacon.dm) ? event.beacon.dm : event.beacon.hwid;
                case 'accountLink':
                    return '(accountLink)';
                case 'things': // typeによって連携・連携解除・シナリオ実行の3種がある
                    return event.things.deviceId;
                default:
                    return '(unknown event)';
            }
        }
    }

    function Webhook(config) {
        RED.nodes.createNode(this, config);
        if (RED.settings.httpNodeRoot !== false) {

            if (!config.url) {
                this.warn(RED._('webhook.errors.missing-path'));
                return;
            }
            this.url = config.url;
            if (this.url[0] !== '/') {
                this.url = '/' + this.url;
            }

            const node = this;

            // エラー時
            this.errorHandler = function (err, req, res, next) {
                node.warn(err);
                res.sendStatus(500);
            };

            // 受信してmsgを送り出すところ
            this.callback = function (req, res) {
                const msgid = RED.util.generateId();
                res._msgid = msgid;
                // Webhook共通
                if (req.body.destination && req.body.events) {
                    // イベントと同数のmsgを送信
                    req.body.events.forEach(event => {
                        node.send({
                            _msgid: msgid,
                            req: req,
                            res: createResponseWrapper(node, res),
                            line: {
                                destination: req.body.destination,
                                event: event, // 個別のイベント
                                events: req.body.events, // 生イベント配列
                            },
                            payload: eventToString(event)
                        });
                    });
                }
                // 空データをLINEプラットフォームへ返す (200 OK)
                const wrapper = createResponseWrapper(node, res);
                wrapper._res.set('content-length', 0);
                wrapper._res.status(200).send('');
            };

            const httpMiddleware = function (req, res, next) { next(); }

            if (RED.settings.httpNodeMiddleware) {
                if (typeof RED.settings.httpNodeMiddleware === 'function' || Array.isArray(RED.settings.httpNodeMiddleware)) {
                    httpMiddleware = RED.settings.httpNodeMiddleware;
                }
            }

            const maxApiRequestSize = RED.settings.apiMaxLength || '5mb';
            const jsonParser = bodyParser.json({ limit: maxApiRequestSize });

            // 必ずPOSTで受ける
            RED.httpNode.post(this.url, httpMiddleware, corsHandler, jsonParser, this.callback, this.errorHandler);

            this.on('close', function () {
                const node = this;
                RED.httpNode._router.stack.forEach(function (route, i, routes) {
                    if (route.route && route.route.path === node.url && route.route.methods['post']) {
                        routes.splice(i, 1);
                    }
                });
            });
        } else {
            this.warn(RED._('webhook.errors.not-created'));
        }
    }
    RED.nodes.registerType('Webhook', Webhook);
}