module.exports = (RED) => {
    'use strict';
    const line = require('@line/bot-sdk');

    function LineSimpleReplay(config) {

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
        RED.nodes.createNode(this,config);
        const node = this;

        node.on('input', async (msg) => {
            const userId = `Ub159ea3fb8ede0b1b68f8270c16ae301`;
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

    RED.nodes.registerType("PushMessage", LineSimpleReplay);
}