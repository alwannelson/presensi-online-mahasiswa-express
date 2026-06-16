const bcrypt = require('bcrypt');
const db = require('../../../configs/db')


exports.getStudentsPage = async (req, res) => {
    try {
        // Ambil parameter dari query string
        const page = parseInt(req.query.page) || 1
        const limit = 10
        const offset = (page - 1) * limit
        const search = req.query.search || ''

        // ========== 1. GET STATISTIK PER JURUSAN ==========
        const [statsResult] = await db.execute(`
            SELECT 
                major,
                COUNT(*) AS total
            FROM students 
            GROUP BY major
        `)

        // Inisialisasi statistik
        let totalSI = 0
        let totalSK = 0
        let totalMI = 0
        let totalOther = 0

        statsResult.forEach(row => {
            const major = row.major?.toLowerCase() || ''
            const total = row.total
            if (major.includes('sistem informasi') || major === 'SI') {
                totalSI = total
            } else if (major.includes('sistem komputer') || major === 'SK') {
                totalSK = total
            } else if (major.includes('manajemen informatika') || major === 'MI') {
                totalMI = total
            } else {
                totalOther += total
            }
        })

        const totalStudents = totalSI + totalSK + totalMI + totalOther

        // ========== 2. GET DATA MAHASISWA DENGAN SEARCH ==========
        let query = `
            SELECT 
                nim, 
                fullname, 
                email, 
                nickname, 
                major, 
                telephone, 
                address 
            FROM students 
            WHERE 1=1
        `
        let countQuery = `SELECT COUNT(*) as total FROM students WHERE 1=1`
        let params = []

        // Tambahkan kondisi search jika ada
        if (search) {
            const searchParam = `%${search}%`
            query += ` AND (nim LIKE ? OR fullname LIKE ? OR email LIKE ? OR nickname LIKE ?)`
            countQuery += ` AND (nim LIKE ? OR fullname LIKE ? OR email LIKE ? OR nickname LIKE ?)`
            params.push(searchParam, searchParam, searchParam, searchParam)
        }

        // Urutkan dan tambahkan pagination
        query += ` ORDER BY nim LIMIT ? OFFSET ?`

        // Clone params untuk count query
        const countParams = [...params]

        // Tambahkan limit dan offset ke params
        params.push(limit, offset)

        // Eksekusi query
        const [students] = await db.execute(query, params)
        const [totalResult] = await db.execute(countQuery, countParams)

        const filteredTotal = totalResult[0].total
        const totalPages = Math.ceil(filteredTotal / limit)

        // ========== 3. RENDER VIEW ==========
        res.render('a/students', {
            layout: 'a/layouts/main-layout',
            title: 'Manajemen Mahasiswa',
            activeMenu: 'students',
            // Data statistik
            totalStudents: totalStudents,
            totalSI: totalSI,
            totalSK: totalSK,
            totalMI: totalMI,
            // Data mahasiswa
            students: students,
            currentPage: page,
            totalPages: totalPages,
            limit: limit,
            search: search,
            // Data untuk form filter (opsional)
            success: req.flash('success'),
            error: req.flash('error'),
            scripts: ''
        })

    } catch (error) {
        console.error('Error getStudents:', error)

        // Kirim data kosong jika error
        res.render('a/students', {
            layout: 'a/layouts/main-layout',
            title: 'Manajemen Mahasiswa',
            activeMenu: 'students',
            totalStudents: 0,
            totalSI: 0,
            totalSK: 0,
            totalMI: 0,
            students: [],
            currentPage: 1,
            totalPages: 1,
            limit: 10,
            search: '',
            error: 'Gagal memuat data: ' + error.message,
            scripts: ''
        })
    }
}