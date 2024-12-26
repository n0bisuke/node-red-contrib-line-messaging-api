module.exports = (RED) => {
    'use strict';
    
    const line = require('@line/bot-sdk');

    const main = function(config){
        const node = this;
        RED.nodes.createNode(node, config);

        let lineconfig = {};
        try {
            lineconfig = require('../../env');
        } catch (error) {
            node.lineConfig = RED.nodes.getNode(config.lineConfig); //共通のlineConfigを取得

            lineconfig = { 
                channelSecret: node.lineConfig.credentials.LineChannelSecret,
                channelAccessToken: node.lineConfig.credentials.LineChannelAccessToken
            };
        }
        if(lineconfig.channelAccessToken === undefined || lineconfig.channelAccessToken === '') {
            console.error('LINE token not found');
            return;
        }
        const client = new line.messagingApi.MessagingApiClient(lineconfig);

        // ここでLINE APIを呼び出す処理
        node.on('input', async(msg, send, done) =>  {

            try {
                const res = await client.getProfile(msg.payload.userId);
                msg.payload = res;
                send(msg);
            } catch (error) {
                console.error(error.body);
                node.error(error.body, msg.payload);
                send(msg);
                done(error);
            }

            console.log("Message received:", msg.payload);
        });
    }

    RED.nodes.registerType("getProfile", main);
}
