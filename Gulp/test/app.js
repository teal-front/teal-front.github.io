var http = require('http'),
	fs = require('fs'),
	path = require('path')

/**
 * 简单的文件系统 
 */
http.createServer(function (req, res) {
	var file = path.normalize('.' + req.url)

	var reportError = function (err) {
		console.log('err: %s', err)
		res.writeHead(500)
		res.end('Internal Server Error')
	}

	fs.exists(file, function (exists) {
		if (exists) {
			fs.stat(file, function (err, stat) {
				if (err) {
					return reportError(err)
				}

				if (stat.isDirectory()) {
					res.writeHead(503)
					res.end('Forbidden')
				} else {
					rs = fs.createReadStream(file)
					rs.on('error', reportError)
					res.writeHead(200)
					rs.pipe(res)
				}
			})
		} else {
			res.writeHead(404)
			res.end('File Not Found')
		}
	})
}).listen(1024)