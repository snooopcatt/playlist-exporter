let http = require('http'),
    DZ = require('node-deezer'),
    deezerApi = require('./deezer_wrapper'),
    path = require('path'),
    fs = require('fs'),
    open = require('open');

// read app config
const config = JSON.parse(fs.readFileSync('config.json', { encoding : 'UTF8' }));
const deezer = new DZ();

async function doImport(code) {
    return new Promise((resolve) => {
        deezer.createSession(config.deezer_app, config.deezer_secret, code, function (err, result) {
            if (err) throw err;
    
            if (result.accessToken) {
                const api = new deezerApi(result.accessToken, deezer);
                const playlistsToImport = JSON.parse(fs.readFileSync(path.join('output', 'playlists.json'), { encoding: 'UTF8' }));
    
                const requests = [];

                for (let targetPL of playlistsToImport) {
                    if (targetPL) {
                        const tracksToAdd = Promise.all(targetPL.tracks.map(track => api.findTrack(track.title, track.artist)));
        
                        const request = api.createPlaylist(targetPL.title)
                            .then(result => {
                                return tracksToAdd.then(tracks => {
                                    if (result) {
                                        return api.addToPlaylist(tracks.map(track => {
                                            if (track.data[0]) {
                                                return track.data[0].id;
                                            }
                                            else {
                                                console.log(`Couldnt add track: ${track}`);
                                            }
                                        }), result.id);
                                    }
                                    else {
                                        console.log(`Cannot create playlist ${targetPL.title}`);
                                        return Promise.resolve();
                                    }
                                });
                            });

                        requests.push(request);
                    }
                }

                Promise.all(requests).then(() => {
                    api.destroy();
                    return resolve();
                });
            }
        });
    });
}

async function importPlaylists() {
    return new Promise((resolve, reject) => {
        let server = http.createServer(function(request, response) {
            let url = request.url;
            let deezerCode = null;
    
            if (url.indexOf('deezer') !== -1) {
                if (url.indexOf('error_reason') !== -1) {
                    return reject('API permission denied');
                }
                else {
                    deezerCode = request.url.match(/code=(.+)/)[1];
                }
                
            }
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('You may close this window');
            
            server.close();
            console.log('Server stopped');
    
            if (deezerCode) {
                doImport(deezerCode).then(resolve).catch(reject);
            }

            resolve();
        });
        
        // this port is specified in the deezer app setting and I guess cannot be randomly changed
        let port = 1337;
        server.listen(port);
        
        console.log('Server running at http://localhost:%d', port);
        
        const redirectUrl = `http://localhost:${port}/deezer`;
        
        // get login url and open it in browser for user to allow access to the app
        const loginUrl = deezer.getLoginUrl(config.deezer_app, redirectUrl, ['manage_library', 'delete_library']);
        open(loginUrl);
    });
}

module.exports = { importPlaylists };
