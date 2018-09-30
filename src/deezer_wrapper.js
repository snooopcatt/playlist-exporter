var Wrapper = function(accessToken, deezer) {
    this.accessToken = accessToken;
    this.deezer = deezer;

    this.resolvePlaylistId = function resolvePlaylistId(name) {
        return name;
    };

    this.deletePlaylist = function deletePlaylist(id) {
        return new Promise((resolve, reject) => {
            this.deezer.request(this.accessToken, {
                resource: `playlist/${id}`,
                method: 'get',
                fields: {
                    request_method: 'delete'
                }
            }, function (err, result) {
                if (err) reject(err);
                console.log('Playlist removed', result);
                resolve(result);
            });
        });
    };

    this.createPlaylist = function createPlaylist(name) {
        return new Promise((resolve, reject) => {
            this.deezer.request(this.accessToken, {
                resource: 'user/me/playlists',
                fields: {
                    request_method: 'post',
                    title: name
                }
            }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };

    this.addToPlaylist = function addToPlaylist(tracks, id) {
        return new Promise((resolve, reject) => {
            this.deezer.request(this.accessToken, {
                resource: `playlist/${id}/tracks`,
                method: 'post',
                fields: {
                    songs: tracks.join(',')
                }
            }, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };

    this.findTrack = function findTrack(title, artist) {
        return new Promise((resolve, reject) => {
            this.deezer.request(this.accessToken, {
                resource: 'search',
                fields: {
                    q: `${artist ? 'artist:"' + artist + '" ' : ''}track:"${title}"`
                }
            }, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
};

module.exports = Wrapper;