//modulos
const http = require('http');
const fs = require('fs');
const url = require('url');
const yargs = require('yargs');
const jimp = require('jimp');


const argv = yargs
    .command(
        'iniciar',
        'If Clave correcta, ejecutar puerto 8080', {
            key: {
                describe: 'clave de acceso',
                demand: true,
                alias: 'k',
            },
        },
        (args) => {
            args.key == 123 ?
                http.createServer((req, res) => {

                    if (req.url == '/') {
                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        fs.readFile('index.html', 'utf8', (err, data) => {
                            res.end(data);
                        })
                    }

                    if (req.url == '/style') {
                        res.writeHead(200, {
                            'Content-Type': 'text/css'
                        });
                        fs.readFile('style.css', (err, data) => {
                            res.end(data);
                        })
                    }

                    const params = url.parse(req.url, true).query;
                    const urlImg = params.link;

                    if (req.url.includes('/visualizar')) {

                        jimp.read(urlImg,
                            (err, img) => {
                                img
                                    .grayscale()
                                    .quality(60)
                                    .resize(350, jimp.AUTO)
                                    .writeAsync('newImg.jpg')
                                    .then(() => {
                                        fs.readFile('newImg.jpg', (err, img) => {
                                            res.writeHead(200, {
                                                'Content-Type': 'image/jpeg'
                                            });
                                            res.end(img);
                                        })
                                    })
                            })
                    }
                })
                .listen(8080, () => console.log('Puerto 8080')) :
                console.log('Key incorrecta, Recuerda que es 123')
        }
    )
    .help().argv