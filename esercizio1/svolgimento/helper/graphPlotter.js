const plotly = require("plotly")("sommoMicc","Zprek5QCqArZdXLYVFzX");
const opn = require("opn");

module.exports = class GraphPlotter {
    /**
     * 
     * @param {Array<Array<Integer>>} results matrice da rappresentare graficamente
     */
    static plotResilience(graphs,results,fileName="random-attack-result") {
        var graphData = [];
        for(let i=0;i<results.length;i++) {
            if(results[i] != null) {
                graphData.push({
                        x: Array.apply(null, {length: results[i].length}).map(Number.call, Number),
                        y: results[i],
                        type: "scatter",
                        name: graphs[i].name
                    }
                );
            }
        }
        //console.log(graphData);
        console.log("Generazione del grafico in corso. Verificare di essere connessi ad internet e attendere...")
        var graphOptions = {filename: fileName, fileopt: "overwrite"};
        plotly.plot(graphData, graphOptions, function (err, msg) {
            console.log(msg);
            if(err == null && msg.url != null) {
                opn(msg.url);
            }
            else {
                console.error("Impossibile generare il grafico: "+err);
            }
        });
    }

    /**
     * 
     * @param {Array<Array<>>} results lista di array di cui determinare il massimo numero di righe
     */
    static findMaxRows(results) {
        const rowsNumber = [];
        for(let i=0; i<results.length; i++) {
            rowsNumber[i] = 0;
            if(results[i] != null) {
                rowsNumber[i] = results[i].length;
            }
        }
    
        return Math.max(...rowsNumber);    
    }
}