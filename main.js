const http = require('http');
const fs = require('fs');
const { guardarCandidato, getCandidatos, registrarVotos, getHistorial } = require('./query');

http
.createServer(async (req, res) => {
    if (req.url == '/' && req.method == 'GET'){
        fs.readFile('index.html', (err, data) => {
            if(err) {
                res.statusCode = 500;
                res.end()
            } else{
                res.setHeader('content-type', 'text/html')
                res.end(data)
            }
        })
    }

    if (req.url == '/candidato' && req.method =='POST'){
        let body = '';
        req.on('data', (chunk) => {
            body = chunk.toString();
        });
        req.on('end', async () => {
            const candidato = JSON.parse(body);
            
            try{
                const result = await guardarCandidato(candidato);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            } catch(e){
                res.statusCode = 500;
                res.end("Ocurrio un problema en el servidor..." + e);
            }
        })
    }

    if(req.url == '/candidatos' && req.method == 'GET') {
        try {
            const candidatos = await getCandidatos();
            res.end(JSON.stringify(candidatos));
        } catch(e) {
            res.statusCode = 500;
            res.end('Ocurrio un problema en el servidor...' + e);
        }
    }

    if (req.url == '/votos' && req.method == 'POST'){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            try {
                const voto = JSON.parse(body);
                const result = await registrarVotos(voto);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            } catch (e) {
                res.statusCode = 500;
                res.end('Ocurrio un problema en el servidor...' + e);
            }
        });
    }

    if (req.url == '/historial' && req.method == 'GET') {
        try {
            const historial = await getHistorial ();
            res.end(JSON.stringify(historial));
        } catch (e) {
            res.statusCode = 500;
            res.end('Ocurrio un problema en el servidor...' + e);
        }
    }
})
.listen(3000, console.log('Server on'))