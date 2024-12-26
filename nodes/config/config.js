module.exports = function(RED) {
    function main(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.LineChannelSecret = this.credentials.LineChannelSecret;
        this.LineChannelAccessToken = this.credentials.LineChannelAccessToken;
    }
 
    RED.nodes.registerType("lineConfig", main, {
        defaults: {
            name: {value: ""}
        },
        credentials: {
            LineChannelSecret: {type: "text"},
            LineChannelAccessToken: {type: "text"}
        }
    });
 }