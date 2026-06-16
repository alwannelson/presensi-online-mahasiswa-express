function timeDifference(time1, time2) {
    // Buat date object dengan tanggal yang sama
    const date1 = new Date(`2000-01-01 ${time1}`)
    const date2 = new Date(`2000-01-01 ${time2}`)
    
    // Hitung selisih dalam milidetik
    const diffMs = date2 - date1
    
    // Konversi ke berbagai satuan
    const diffSc = Math.floor(diffMs / 1000)
    const diffMn = Math.floor(diffMs / (1000 * 60))
    const diffHr = Math.floor(diffMs / (1000 * 60 * 60))
    
    // Sisa menit dan detik
    const minLeft = diffMn % 60
    const secLeft = diffSc % 60
    
    return {
        hour: diffHr,
        minute: diffMn,
        second: diffSc,
        format: `${diffHr} jam ${minLeft} menit ${secLeft} detik`,
        formatSimple: `${diffMn} menit`,
        milisecond: diffMs
    }
}

module.exports = timeDifference