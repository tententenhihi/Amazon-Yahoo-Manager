const path = require('path')
const fs = require('fs')
const MAX_UPLOAD_SIZE = 20;

const defaultOptions = {
  disk: '',
  maxSize: MAX_UPLOAD_SIZE,
  allows: ['image/gif', 'image/jpeg', 'image/png'],
  resize: false
}

module.exports = async function (fileUpload, options) {
  try {
    options = Object.assign({}, defaultOptions, options);
    if (fileUpload) {

      if (fileUpload.size > options.maxSize * 1024 * 1024) {
        throw new Error(`Tệp tải lên quá lớn (tối đa ${options.maxSize}Mb)`)
      }

      if (!options.allows.includes(fileUpload.mimetype)) {
        throw new Error(`Tệp tải không đúng định dạng (cho phép ${options.allows.join(', ').replace(/image\//g, '')})`)
      }

      const fileName = Date.now() + '_' + Math.round(Math.random() * 1E9)
      let disk = 'uploads/' + options.disk
      if (!fs.existsSync(disk)) {
        fs.mkdirSync(disk, { recursive: true })
      }
      disk += fileName + path.extname(fileUpload.name)
      disk = disk.replace(/\/\//g, '/')
      fs.writeFileSync(disk, fileUpload.data, "binary");
      if (fs.existsSync(disk)) {
        return disk.substring(8)
      }
    }
    return null
  } catch (error) {
    throw error
  }
}
