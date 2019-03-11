// module.exports = () => {

    const d3 = require("d3");
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const dom = new JSDOM("d3Test");

    console.log(dom);
    
    const svg = d3.select(dom.body).append("svg");

    console.log(dom);

// }

    
