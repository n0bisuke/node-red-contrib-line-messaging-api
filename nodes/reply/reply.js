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
            if (event.type !== 'message' || event.message.type !== 'text') {
              return Promise.resolve(null);
            }
    
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: config.replyMessage || event.message.text //実際に返信の言葉を入れる箇所
            });
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