module.exports = (RED) => {
    'use strict';
    
    const axiosBase = require('axios');

    const main = function(config){
        const node = this;
        RED.nodes.createNode(node, config);
        const LINE_TOKEN = node.credentials.AccessToken;
        const axios = axiosBase.create({
            baseURL: `https://api.line.me/v2/bot/message/quota`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${LINE_TOKEN}`
            }
        });

        node.on('input', async (msg, send, done) => {
            const mes = msg.payload;
            try {
                const resLimit = await axios.get(`/`);
                const resCurrent = await axios.get(`/consumption`);

                const output = {
                    type: resLimit.data.type,
                    limit: resLimit.data.value,
                    totalUsage: resCurrent.data.totalUsage,
                    usagePercentage: resCurrent.data.totalUsage / resLimit.data.value
                }

                msg.payload = output;
                send(msg);
                done();
            } catch (error) {
                console.log(error);
                done(error);
            }

        });
    }

    RED.nodes.registerType("Limit", main, {
        credentials: {
            AccessToken: {type:"password"}
        }
    });
}