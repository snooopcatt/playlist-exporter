const yandex = require('./src/yandex.music');
const deezer = require('./src/deezer');
const program = require('commander');

program.version('1.0.0')
    .option('-s, --source <source>', 'Source of the playlists', /^(yandex|deezer)$/i, 'yandex')
    .option('-t, --target <target>', 'Target of the playlists', /^(yandex|deezer)$/i, 'deezer')
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

    let sourceService, targetService;

    switch (source) {
    case 'yandex':
        sourceService = yandex;
        break;
    case 'deezer':
        sourceService = deezer;
        break;
    }
    
    switch (target) {
    case 'yandex':
        targetService = yandex;
        break;
    case 'deezer':
        targetService = deezer;
        break;
    }

    sourceService.exportPlaylists().then(() => {
        return targetService.importPlaylists();
    }).then(() => {
        console.log('Exported');
    });
}
else {
    program.outputHelp();
}