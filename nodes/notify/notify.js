module.exports = (RED) => {
    'use strict';
    
    const axiosBase = require('axios');

    const main = function(config){
        const node = this;
        RED.nodes.createNode(node, config);
        const LINE_TOKEN = config.AccessToken;
        const axios = axiosBase.create({
            baseURL: `https://notify-api.line.me`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${LINE_TOKEN}`
            }
        });

        node.on('input', async (msg) => {
            const mes = msg.payload;
            try {
                const res = await axios.post(`/api/notify?message=${encodeURI(mes)}`);
                msg.payload = res.data;
                node.send(msg);                
            } catch (error) {
                console.log(error);
            }

        });
    }

    RED.nodes.registerType("Notify", main);
}