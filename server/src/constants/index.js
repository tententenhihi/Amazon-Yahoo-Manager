export default {
    FFMPEG: {
        OUTPUT_OPTION_AUDIO: ['-ar 44100', '-b:a 192k', '-ac 2', '-c:a aac'],
    },
    listExtFileVideo: ['.avi', '.mp4', '.mov', '.flv', '.wmv', '.mpeg', '.vob', '.ts', '.mpg', '.mkv', '.webm'],
    listExtFileImage: ['.mpeg', '.jpg', '.png', '.gif', '.bmp', '.jpeg'],
    listExtFileConvertToGif: ['.avi', '.mkv', '.vob', '.ts', '.mpg'],
    listExtFileMusic: ['.mp3', '.acc', '.wav', '.flac', '.m4a'],
    VOICE: {
        VOICE_TEXT_JP: 'VOICE_TEXT_JP',
        NOTE_VIBES: 'NOTE_VIBES',
        GOOGLE: 'GOOGLE',
    },
};
