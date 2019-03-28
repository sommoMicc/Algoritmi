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
        const resilientBehaviour = [];
        for(let i=0;i<results[0].length;i++) {
            resilientBehaviour.push(Math.round(((results[0].length - i)*0.75)));
        }
        graphData.push({
                x: Array.apply(null, {length: resilientBehaviour.length}).map(Number.call, Number),
                y: resilientBehaviour,
                type: "scatter",
                name: "Comportamento resiliente"
            }
        );

        const twentyPercentY = [];
        const twentyPercentX = [];
        const twentyPercentValue = results[0][0] * 0.2;
        for(let i=0;i<=results[0][0];i++) {
            twentyPercentY.push(i);
            twentyPercentX.push(twentyPercentValue);
        }

        graphData.push({
            x: twentyPercentX,
            y: twentyPercentY,
            type: "scatter",
            name: "20% dei nodi"
        });
        const graphTitle = fileName == "random-attack-result" ? "Random attack" : "Clever attack"
        console.log("Generazione del grafico "+graphTitle+" in corso. Verificare di essere "+
                    "connessi ad internet e attendere...")
        var graphOptions = {
            layout: {
                title: graphTitle,
                yaxis: {
                    title: "Dimensione massima componente connessa",
                    rangemode: "nonnegative" //nascondo valori negativi
                },
                xaxis: {
                    title: "Numero nodi disattivati",
                    rangemode: "nonnegative" //nascondo valori negativi
                }
            },
            filename: fileName,
            fileopt: "overwrite"
        };
        plotly.plot(graphData, graphOptions, function (err, msg) {
            if(err == null && msg.url != null) {
                console.log("Grafico "+graphTitle+" generato, disponibile all'url: "+msg.url+" ,"+ 
                            " che verrà aperto automaticamente tra pochi secondi");

                setTimeout(()=>opn(msg.url),3000);
                
            }
            else {
                console.error("Impossibile generare il grafico "+graphTitle+": "+err);
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