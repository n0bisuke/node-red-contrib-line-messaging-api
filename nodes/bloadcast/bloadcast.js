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
            lineconfig = { channelSecret: node.credentials.channelSecret, channelAccessToken: node.credentials.channelAccessToken};
        }

        if(lineconfig.channelSecret === '' || lineconfig.channelAccessToken === '') {
            this.error(RED._("token not found"));
        }

        const client = new line.Client(lineconfig);

        node.on('input', async (msg, send, done) => {

            try {
                const res = await client.broadcast([{
                    type: 'text',
                    text: msg.payload,
                }]);
                
                const output = {
                    status: `success`,
                    res: res
                };

                msg.payload = output;
                send(msg);
                done();
            } catch (error) {
                console.log(error);
                done(error);
            }
        });
    }

    RED.nodes.registerType("BloadcastMessage", main, {
        credentials: {
            channelSecret: {type:"password"},
            channelAccessToken: {type:"password"},
        },
    });
}