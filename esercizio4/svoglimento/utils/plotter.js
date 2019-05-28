const fs = require("fs");
const { Image, createCanvas } = require("canvas");

module.exports = class Plotter {
    static get OUTPUT_DIR() { return "./outputs/" };
    static get MAP_IMAGE_PATH() { return "./assets/map.png" };

    static get COLORS() {
        return [
            "rgba(0,0,0,1)",
            "rgba(255,0,0,1)",
            "rgba(0,255,0,1)",
            "rgba(0,0,255,1)",
            "rgba(255,255,0,1)",
            "rgba(255,0,255,1)",
            "rgba(0,255,255,1)",
            "rgba(255,255,255,1)",
            "rgba(130,0,130,1)",
            "rgba(255,0,130,1)",
            "rgba(130,0,255,1)",
            "rgba(0,130,130,1)",
            "rgba(0,130,255,1)",
            "rgba(0,255,130,1)",
            "rgba(75,75,130,1)",
            "rgba(255,75,75,1)",
        ]
    }

    static disegnaKMeans(clusters) {
        return new Promise(async (resolve,reject) => {
           try {
                const backgroundImage = await this._loadImage();

                const canvas = createCanvas(backgroundImage.width, backgroundImage.height);
                const ctx = canvas.getContext('2d');

                ctx.drawImage(backgroundImage,0,0);

                clusters.forEach((cluster,i)=>{
                    const center = cluster.center();
                    cluster.points.forEach((point) => {
                        Plotter._disegnaLinea(ctx,center,point,Plotter.COLORS[i]);
                    });
                });

                await Plotter._save(canvas,"test.png");
           }
           catch(e) {
               console.log(e);
               reject(e);
           }
        });
    }

    static _disegnaLinea(ctx,da,a,colore) {
        ctx.strokeStyle = colore;
        ctx.beginPath();
        ctx.moveTo(da.x,da.y);
        ctx.lineTo(a.x,a.y);
        ctx.stroke();
    }

    static async _loadImage() {
        return new Promise((resolve,reject) => {
            try {

                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = err => { throw err }
                img.src = Plotter.MAP_IMAGE_PATH;
            }
            catch(e) {
                reject(e);
            }
        });
    }

    static async _save(canvas,fileName) {
        return new Promise((resolve,reject) => {
            const out = fs.createWriteStream(Plotter.OUTPUT_DIR + fileName);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            out.on('finish', () =>  resolve());
            out.on("error",() => reject("errore nel salvataggio"))
        });
    }
};