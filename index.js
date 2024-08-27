const chokidar = require('chokidar');
const {updateZipArchive, deleteEntry} = require('./zipOperations.js');

const watcher = chokidar.watch('../CSV_Storage', {
    cwd: '.',
    persistent: true
})

watcher.on('all', async (event, path) => {

    path = path.replaceAll('\\','/');
    if(event==='addDir' || event ==='unlinkDir') path += '/';

    if(event==='add' || event==='addDir' || event==='change') {
        updateZipArchive(path);
    }
    else if(event==='unlink' || event==='unlinkDir') {
        deleteEntry(path);
    }
    else{
        console.log(`unknown event: ${event}`)
    }
})
