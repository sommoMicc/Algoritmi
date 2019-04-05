const plotly = require("plotly")("sommoMicc","Zprek5QCqArZdXLYVFzX");
const opn = require("opn");

module.exports = class GraphPlotter {
    static plotRoute(graph,routes,fileName="routes") {
        let graphData = [];

        let series = Object.keys(routes);
        series.forEach((route)=>{
            const routePieces = route.split("-");
            const routeName = "Da "+routePieces[0]+" a "+routePieces[2]+" alle "+routePieces[1];

            let x = [], y = [];

            for(let i=0;i<routes[route].length;i++) {
                x.push(graph.coords[routes[route][i]].lng);
                y.push(graph.coords[routes[route][i]].lat);
            }
            graphData.push({
                    x: x,
                    y: y,
                    type: "scatter",
                    name: routeName
                }
            );
        });

        const graphTitle = "Percorsi trovati";
        console.log("\nGenerazione del grafico "+graphTitle+" in corso. Verificare di essere "+
                    "connessi ad internet e attendere...")
        var graphOptions = {
            layout: {
                title: graphTitle,
                yaxis: {
                    title: "Longitudine",
                    range: [46,51]
                },
                xaxis: {
                    title: "Latitudine",
                    range: [4,8]
                }
            },
            filename: fileName,
            fileopt: "overwrite"
        };
        //Disegno il grafico con plotly (RICHIEDE INTERNET!)
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
};