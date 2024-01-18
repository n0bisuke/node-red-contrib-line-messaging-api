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
                // channelSecret: node.credentials.channelSecret,
                channelAccessToken: node.credentials.channelAccessToken
            };
        }

        if(lineconfig.channelAccessToken === undefined || lineconfig.channelAccessToken === '') {
            console.error('token not found1');
            return;
        }

        const client = new line.Client(lineconfig);

        node.on('input', async (msg, send, done) => {
            try {
                const userId = msg.targetId || node.credentials.targetId;

                //Flex Messageなどに対応
                if(typeof msg.payload === 'object' && msg.payload.type){
                    msg.payload = await client.pushMessage(userId, msg.payload);
                }
                //テキストのみの場合
                else{
                    msg.payload = await client.pushMessage(userId, {
                        type: 'text',
                        text: msg.payload,
                    });
                }

                send(msg);
            } catch (error) {
                console.log(error);
                done(error);
            }
        });
    }

    RED.nodes.registerType("PushMessage_New", main, {
        credentials: {
            // channelSecret: {type:"password"},
            channelAccessToken: {type:"password"},
            targetId: {type:"password"},
        },
    });
}