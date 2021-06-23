export default {
  exportToCSV (data, fileName = 'dowload.csv', mimeType = 'text/csv;encoding:utf-8') {
    let csvContent = '';
    data.forEach(function (infoArray, index) {
      let dataString = infoArray.join(',');
      csvContent += index < data.length ? dataString + '\n' : dataString;
    });

    /* Convert from UNICODE to ShiftJIS */
    let encoding = mimeType.toLowerCase()
    if (encoding.includes('sjis')) {
      csvContent = this.convertShiftJIS(csvContent)
    }

    let a = document.createElement('a')
    if (navigator.msSaveBlob) {
      // IE10
      navigator.msSaveBlob(new Blob([csvContent], {type: mimeType}), fileName);
    } else if (URL && 'download' in a) {
      a.href = URL.createObjectURL(new Blob([csvContent], {type: mimeType}));
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      location.href = 'data:application/octet-stream,' + encodeURIComponent(csvContent);
    }
  },
  convertShiftJIS (target) {
    const uniArray = encoding.stringToCode(target);
    const sjisArray = encoding.convert(uniArray, 'SJIS', 'UNICODE');
    return new Uint8Array(sjisArray);
  },
}
