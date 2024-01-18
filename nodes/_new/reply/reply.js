module.exports = (RED) => {
    'use strict';

    const line = require('@line/bot-sdk');
    const main = function(config){
        const node = this;
        RED.nodes.createNode(node, config);

        let lineconfig;
        try {
            lineconfig = require('../../env');
        } catch (error) {
            lineconfig = {
                channelSecret: node.credentials.channelSecret,
                channelAccessToken: node.credentials.channelAccessToken
            };
        }

        if (lineconfig.channelSecret === '' || lineconfig.channelAccessToken === '') {
            this.error(RED._('token not found'));
        }

        const client = new line.Client(lineconfig);

        // 旧仕様
        const handleEvent = (event) => {
            if (event.type !== 'message') {
                return Promise.resolve(null);
            }

            if (event.message.type === 'text') {
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: config.replyMessage || event.message.text // 実際に返信の言葉を入れる箇所
                });
            } else if (event.message.type === 'flex') {
                const message_text = event.message.altText;

                return client.replyMessage(event.replyToken, {
                    type: 'flex',
                    altText: message_text,
                    contents: event.message.text
                });
            } else if (event.message.type === 'image') {
                return client.replyMessage(event.replyToken, {
                    type: 'image',
                    originalContentUrl: event.message.originalContentUrl,
                    previewImageUrl: event.message.previewImageUrl || event.message.originalContentUrl
                });
            } else {
                return Promise.resolve(null);
            }
        }

        // 新仕様
        const reply = (msg) => {
            if (!msg.line || !msg.line.event || !msg.line.event.type) {
                throw 'no valid LINE event found within msg';
            } else if (!msg.line.event.replyToken) {
                throw 'no replyable LINE event received';
            } else if (!msg.payload) {
                throw 'reply content (msg.payload) is empty';
            } else if (typeof msg.payload === 'object' && msg.payload.type) {
                // payloadがオブジェクトの場合はメッセージオブジェクト扱いで送信される
                return client.replyMessage(msg.line.event.replyToken, msg.payload);
            } else {
                // payloadがそれ以外なら強制的に文字列に変換しテキストメッセージ扱いで送信する
                return client.replyMessage(msg.line.event.replyToken, {
                    type: 'text',
                    text: config.replyMessage || String(msg.payload)
                });
            }
        }

        node.on('input', async (msg, send, done) => {
            if (msg.line && msg.line.event) {
                // 新仕様
                try {
                    const result = await reply(msg);
                    console.info(result);
                    send(msg);
                    done();
                } catch (err) {
                    console.warn(err);
                    done(err);
                }
            } else if (msg.payload.events) {
                // 旧仕様
                Promise
                    .all(msg.payload.events.map(handleEvent))
                    .then(result => {
                        // [{}]が返ってきてる
                        if (result.length === 1 && 0 === Object.keys(result[0]).length) {
                            result = { status: 200, message: 'Success' }
                        }
                        msg.payload = result;
                        send(msg);
                        done();
                    }).catch(err => {
                        console.log(err);
                        done(err);
                    });
            }
        });
    }

    RED.nodes.registerType('ReplyMessage', main, {
        credentials: {
            channelSecret: { type:'password' },
            channelAccessToken: { type:'password' },
        }
    });
}