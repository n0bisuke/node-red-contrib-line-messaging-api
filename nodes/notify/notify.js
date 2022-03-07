module.exports = (RED) => {
    'use strict';
    
    const axiosBase = require('axios');

    const main = function(config){
        const node = this;
        RED.nodes.createNode(node, config);
        const LINE_TOKEN = node.credentials.AccessToken;
        const axios = axiosBase.create({
            baseURL: `https://notify-api.line.me`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${LINE_TOKEN}`
            }
        });

        node.on('input', async (msg, send, done) => {
            const mes = msg.payload;
            try {
                const res = await axios.post(`/api/notify?message=${encodeURI(mes)}`);
                msg.payload = res.data;
                send(msg);
                done();        
            } catch (error) {
                console.log(error);
                done(error);
            }

        });
    }

    RED.nodes.registerType("Notify", main, {
        credentials: {
            AccessToken: {type:"password"}
        }
    });
}