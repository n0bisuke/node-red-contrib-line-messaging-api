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
            lineconfig = { channelSecret: config.channelSecret, channelAccessToken: config.channelAccessToken};
        }

        if(lineconfig.channelSecret === '' || lineconfig.channelAccessToken === '') {
            this.error(RED._("token not found"));
        }

        const client = new line.Client(lineconfig);

        node.on('input', async (msg) => {
            const userId = config.targetId;
            try {
                const res = await client.pushMessage(userId, {
                    type: 'text',
                    text: msg.payload,
                });
                
                msg.payload = res.data;
                node.send(msg);
            } catch (error) {
                console.log(error);
                node.error(error);
            }
        });
    }

    RED.nodes.registerType("PushMessage", main);
}