const API = require('yandex-music-api'),
    path = require('path'),
    fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', { encoding: 'UTF8' }));

async function exportPlaylists() {
    let api = new API();

    await api.init({
        username: config.yandex_username,
        password: config.yandex_password
    });

    let playlists = await api.getUserPlaylists();

    let playlistsRequests = [];

    for (let p of playlists) {
        playlistsRequests.push(api.getPlaylist(null, p.kind));
    }

    playlists = await Promise.all(playlistsRequests);

    let output = [],
        songsCount = 0,
        playlistsCount = playlists.length;

    for (let p of playlists) {
        let playlistObject = { title: p.title, tracks: [] };

        for (let item of p.tracks) {
            let track = item.track;
            songsCount++;
            playlistObject.tracks.push({ title: track.title, artist: track.artists[0].name });
        }

        output.push(playlistObject);
    }

    fs.writeFileSync(path.join('output', 'playlists.json'), JSON.stringify(output), { encoding: 'UTF8' });

    console.log(`Exported ${songsCount} songs from ${playlistsCount} playlists`);
}

async function importPlaylists() {
    console.log('Implement me');
}

module.exports = { exportPlaylists, importPlaylists };