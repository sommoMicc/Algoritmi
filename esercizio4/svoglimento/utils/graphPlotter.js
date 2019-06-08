const plotly = require("plotly")("sommoMicc","Zprek5QCqArZdXLYVFzX");
const opn = require("opn");

module.exports = class GraphPlotter {
    static distortion(plotData) {
        const plotTitle = "Distorsione su dataset "+plotData.dataset;
        let graphData = [];

        const series = Object.keys(plotData.data);
        series.forEach((algorithmName)=>{

            let x = [], y = [];
            const clusterNumbers = Object.keys(
                plotData.data[algorithmName]);

            for(let i=0;i<clusterNumbers.length;i++) {
                x.push(clusterNumbers[i]);
                y.push(plotData.data[algorithmName][clusterNumbers[i]]);
            }

            graphData.push({
                    x: x,
                    y: y,
                    type: "scatter",
                    name: algorithmName
                }
            );
        });

        var graphOptions = {
            layout: {
                title: plotTitle,
                yaxis: {
                    title: "Distorsione",
                },
                xaxis: {
                    title: "Numero di cluster",
                }
            },
            filename: plotTitle.toLocaleLowerCase().replace(/ /g,"_"),
            fileopt: "overwrite"
        };
        //Disegno il grafico con plotly (RICHIEDE INTERNET!)
        plotly.plot(graphData, graphOptions, function (err, msg) {
            if(err == null && msg.url != null) {
                console.log("Grafico per "+plotTitle+" generato correttamente");
                setTimeout(()=>opn(msg.url),3000);

            }
            else {
                console.error("Impossibile generare il grafico "+plotTitle+": "+err);
            }
        });
    }
};