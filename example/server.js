const http = require('http')
const { readFileSync } = require('fs')

const bundle = readFileSync(__dirname + '/bundle.js')

const { getScriptTag } = require('../dist')

const requestListener = function (req, res) {
	if (req.url === '/') {
		res.writeHead(200)
		res.end(`
  <html>
    <body>
        Hello world!
        ${getScriptTag()}
        <script src="http://localhost:8080/bundle.js"></script>
    </body>
  </html>
  `)
	} else if (req.url === '/bundle.js') {
		res.writeHead(200)
		res.end(bundle)
	}
}

const server = http.createServer(requestListener)
server.listen(8080)
