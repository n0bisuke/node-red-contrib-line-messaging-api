module.exports = (RED) => {
    'use strict';
    function LineSimpleReplay(config) {
        const express = require('express');
        const line = require('@line/bot-sdk');
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
        // const client = new line.Client(lineconfig);
    
        const app = express();
        
        
        app.post('/webhook', line.middleware(lineconfig), (req, res) => {
            console.log(req.body.events);
            Promise
              .all(req.body.events.map(handleEvent))
              .then((result) => res.json(result));
        });
    }
    
    RED.nodes.registerType("Webhook", LineSimpleReplay);
}