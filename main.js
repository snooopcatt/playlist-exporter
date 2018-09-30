const yandex = require('./src/yandex.music');
const program = require('commander');

program.version('1.0.0')
    .option('-s, --source', 'Source of the playlists')
    .option('-t, --target', 'Target of the playlists')
    .option('-l, --list', 'List all supported sources/targets')
    .parse(process.argv);

if (program.list) {
    console.log('');
    console.log('  sources:');
    console.log('    yandex\t http://music.yandex.ru');
    console.log('    deezer\t http://deezer.com');
    console.log('');
    console.log('  targets:');
    console.log('    yandex\t http://music.yandex.ru');
    console.log('    deezer\t http://deezer.com');
}
else if (program.source && program.target) {
    const source = program.source,
        target = program.target;

    if (source === target) {
        console.error('Source cannot be same as target');
    }

    yandex.exportPlaylists().then(() => {

    });
}
else {
    program.outputHelp();
}