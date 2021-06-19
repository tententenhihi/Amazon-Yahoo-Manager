import Express from 'express';
import Fs from 'fs';
import Path from 'path';
import Constants from '../constants/index';

var fileRouter = Express.Router();

fileRouter.use('/', async function (req, res) {
    try {
        let path = req.url;

        if (path.startsWith('/public')) path = path.substring(1, path.length);

        if (!path.includes('googlevideo')) {
            path = decodeURI(path).split('?')[0];
        }
        let timeStart = req.query.timeStart;
        if (path.includes('googlevideo') && !timeStart) {
            timeStart = 1;
        }

        let checkExistFile = Fs.existsSync(path);
        if (!path.includes('googlevideo') && (!path || !checkExistFile)) {
            return res.status(400).json({ message: 'File Not Exist' });
        }

        let typeFile = Path.extname(path);

        if (!path.includes('googlevideo') && !typeFile) return res.status(400).json({ message: 'Not Read Extension File' });

        if (Constants.listExtFileImage.includes(typeFile.toString().toLowerCase())) typeFile = 'image/' + typeFile.replace('.', '');
        if (Constants.listExtFileVideo.includes(typeFile.toString().toLowerCase())) typeFile = 'video/' + typeFile.replace('.', '');

        if (Constants.listExtFileMusic.includes(typeFile.toString().toLowerCase())) typeFile = 'audio/' + typeFile.replace('.', '');

        const stat = Fs.statSync(path);
        const fileSize = stat.size;
        const range = req.headers.range;
        try {
            if ((typeFile.startsWith('video') || typeFile.startsWith('audio')) && range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = end - start + 1;
                const file = Fs.createReadStream(path, { start, end, flag: 'rs+' });

                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': typeFile,
                };
                res.writeHead(206, head);
                file.pipe(res, { end: true });
                file.on('end', () => {
                    file.close();
                    file.destroy();
                });
                file.on('error', function (err) {});
                file.on('data', function (err) {});
                file.on('close', function (err) {});
                file.on('readable', function (err) {
                    this.read();
                });
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': typeFile,
                };
                res.writeHead(200, head);
                const file = Fs.createReadStream(path, { flag: 'rs+' });
                file.pipe(res, { end: true });
                file.on('end', () => {
                    file.close();
                    file.destroy();
                });
                file.on('error', function (err) {});
                file.on('data', function (err) {});
                file.on('close', function (err) {});
                file.on('readable', function (err) {
                    this.read();
                });
            }
        } catch (error) {}
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

export default fileRouter;
