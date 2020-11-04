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
                channelSecret: config.channelSecret,
                channelAccessToken: config.channelAccessToken
            };
        }

        if(lineconfig.channelSecret === '' || lineconfig.channelAccessToken === '') {
            this.error(RED._("token not found"));
        }

        const client = new line.Client(lineconfig);

        //メインの処理
        const handleEvent = (event) => {
            if (event.type !== 'message') {
                return Promise.resolve(null);
            }

            if (event.message.type === 'text') {
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: config.replyMessage || event.message.text //実際に返信の言葉を入れる箇所
                  });
            } else if (event.message.type === 'flex') {
                const message_text = event.message.altText;

                return client.replyMessage(event.replyToken, {
                    type: "flex",
                    altText: message_text,
                    contents: event.message.text
                });
            } else {
                return Promise.resolve(null);
            }
        }

        node.on('input', (msg) => {
            Promise
                .all(msg.payload.events.map(handleEvent))
                .then(result => {
                    // [{}]が返ってきてる
                    if (result.length === 1 && 0 === Object.keys(result[0]).length) {
                        result = {status: 200, message: 'Success'}
                    }
                    msg.payload = result;
                    node.send(msg)
                }).catch(err => {
                    console.log(err);
                    node.error(err);
                });
        });
    }

    RED.nodes.registerType("ReplyMessage", main);
}