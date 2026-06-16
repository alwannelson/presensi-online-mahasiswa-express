const db = require('../../../configs/db')
const currentDate = require('../../../utils/format-date')
const currentDay = require('../../../utils/format-days')
const timeDifference = require('../../../utils/time-difference')
const upload = require('../../../middlewares/selfie-middleware')

exports.getToday = async (req, res) => {
    try {
        const page = 'today'
        const nim = req.user.nim
        const [rows] = await db.execute(
            `SELECT * FROM students WHERE nim = ?`, [nim]
        )
        const user = {
            fullname: rows[0].fullname,
            nickname: rows[0].nickname,
            major: req.user.major,
            nim,
            major_code: req.user.major_code
        }
        const newDate = new Date()
        const today = newDate.getDay()

        // Format tanggal untuk filter (YYYY-MM-DD)
        const currentDateFormatted = newDate.toISOString().split('T')[0];

        if (user.major_code === 'SI' || user.major_code === 'MI') {
            const [rows] = await db.execute(`
            SELECT
                s.id AS id_schedule,
                c.name AS class_name,
                c.location AS class_loc,
                co.name AS course_name,
                co.slug AS slug,
                co.credits AS course_credits,
                l.fullname AS lecturer_name,
                l.degree AS lecturer_degree,
                s.day AS day,
                s.major_code AS major,
                s.start_time AS start,
                s.end_time AS end,
                TIMEDIFF(s.end_time, s.start_time) AS durations,
                CASE 
                    WHEN a.status = 1 THEN 'hadir'
                    WHEN a.status = 0 THEN 'tidak_hadir'
                    ELSE 'belum'
                END AS attendance_status,
                a.status AS attendance_value
            FROM schedules s
            JOIN classes c ON s.id_class = c.id
            JOIN courses co ON s.id_course = co.id
            JOIN lecturers l ON s.nid = l.nid
            LEFT JOIN attendance a ON s.id = a.id_schedule 
                AND a.nim = ? 
                AND DATE(a.date) = ?
            WHERE s.day = ?
            AND s.major_code = ?
            ORDER BY s.day, s.start_time
            `, [nim, currentDateFormatted, today, user.major_code]
            )


            return res.status(200).render('s/dashboard', {
                title: `Dashboard ${user.nickname}`,
                layout: 's/layouts/main',
                page,
                user,
                activeMenu: 'today',
                rows,
                currentDate,
                currentDay,
                error: req.flash('error')[0],
                success: req.flash('success')[0]
            })
        } else {
            const [rows] = await db.execute(`
            SELECT
                s.id AS id_schedule,
                c.name AS class_name,
                c.location AS class_loc,
                co.name AS course_name,
                co.slug AS slug,
                co.credits AS course_credits,
                l.fullname AS lecturer_name,
                l.degree AS lecturer_degree,
                s.day AS day,
                s.major_code AS major,
                s.start_time AS start,
                s.end_time AS end,
                TIMEDIFF(s.end_time, s.start_time) AS durations,
                CASE 
                    WHEN a.status = 1 THEN 'hadir'
                    WHEN a.status = 0 THEN 'tidak_hadir'
                    ELSE 'belum'
                END AS attendance_status,
                a.status AS attendance_value
            FROM schedules s
            JOIN classes c ON s.id_class = c.id
            JOIN courses co ON s.id_course = co.id
            JOIN lecturers l ON s.nid = l.nid
            LEFT JOIN attendance a ON s.id = a.id_schedule 
                AND a.nim = ? 
                AND DATE(a.date) = ?
            WHERE s.day = ?
            AND s.major_code = ?
            ORDER BY s.day, s.start_time
            `, [nim, currentDateFormatted, today, user.major_code])

            return res.status(200).render('s/dashboard', {
                title: `Dashboard ${user.nickname}`,
                layout: 's/layouts/main',
                page,
                user,
                activeMenu: 'today',
                rows,
                currentDate,
                currentDay,
                error: req.flash('error')[0],
                success: req.flash('success')[0]
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).render('err/500', {
            layout: 'err/500',
        })
    }
}

exports.getPresentBySlug = async (req, res) => {
    try {
        const { slug } = req.params
        const today = new Date().getDay()

        const nim = req.user.nim
        const [rows] = await db.execute(
            `SELECT * FROM students WHERE nim = ?`, [nim]
        )
        const user = {
            fullname: rows[0].fullname,
            nickname: rows[0].nickname,
            major: req.user.major,
            nim,
            major_code: req.user.major_code
        }

        const [schedule] = await db.execute(
            `SELECT 
                s.id AS id_schedule,
                co.name AS course_name,
                l.fullname AS lecturer_name,
                l.degree,
                s.start_time,
                s.end_time,
                s.day AS day,
                co.slug AS slug,
                co.credits,
                c.name AS class_name
            FROM schedules s
            JOIN courses co ON s.id_course = co.id
            JOIN lecturers l ON s.nid = l.nid
            JOIN classes c ON s.id_class = c.id
            WHERE co.slug = ? AND s.day = ?`,
            [slug, today]
        )

        const [datum] = await db.execute(
            `SELECT
                co.name AS course_name,
                l.fullname AS lecturer_name,
                s.start_time AS start,
                s.end_time AS end,
                s.day,
                c.name AS class_name
            FROM schedules s
            JOIN courses co ON s.id_course = co.id
            JOIN lecturers l ON s.nid = l.nid
            JOIN classes c ON s.id_class = c.id
            WHERE co.slug = ?
            `,
            [slug]
        )
        const data = datum[0]

        if (schedule.length === 0) {
            return res.render('err/cant-access', {
                layout: 'err/cant-access',
                data
            });
        }


        // Tanggal server (tidak bisa dimanipulasi client)
        const now = new Date();
        const serverDate = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        res.render('s/hadir', {
            title: 'Form Presensi',
            layout: 's/hadir',
            course_name: schedule[0].course_name,
            lecturer_name: schedule[0].lecturer_name,
            start_time: schedule[0].start_time,
            end_time: schedule[0].end_time,
            id_schedule: schedule[0].id_schedule,
            credits: schedule[0].credits,
            class_name: schedule[0].class_name,
            degree: schedule[0].degree,
            nim: nim,
            user,
            slug: schedule[0].slug,
            serverDate: serverDate,
        });


    } catch (error) {
        console.log(error)
    }
}

// Submit presensi
exports.submitPresensi = async (req, res) => {
    try {
        // Ambil data dari req.body (termasuk location_address)
        const { id_schedule, nim, latitude, longitude, location_address } = req.body;

        // Ambil file selfie dari req.file
        const photoFile = req.file;

        // Validasi data
        if (!id_schedule || !nim) {
            return res.status(400).json({
                success: false,
                message: 'Data jadwal atau NIM tidak lengkap'
            });
        }

        if (!photoFile) {
            return res.status(400).json({
                success: false,
                message: 'Selfie tidak ditemukan'
            });
        }

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Lokasi tidak ditemukan'
            });
        }

        // Path foto untuk disimpan di database
        const photoPath = `/img/uploads/presence/${photoFile.filename}`;

        // Cek apakah sudah pernah presensi hari ini untuk jadwal ini
        // const date = new Date()
        // const now = date.getDate()
        // const [existing] = await db.execute(
        //     `SELECT * FROM attendance WHERE id_schedule = ? AND nim = ? AND date = ?`,
        //     [id_schedule, nim, now]
        // );

        // if (existing.length > 0) {
        //     if (existing[0].status === true) {
        //         req.flash('success', 'Anda telah mengambil presensi.')
        //         return res.redirect('/s/today')
        //     } else {
        //         req.flash('error', 'Anda absen untuk hari ini.')
        //         return res.redirect('/s/today')
        //     }
        // }


        const currentDate = new Date().getDate();
        // Simpan ke database
        const [result] = await db.execute(
            `INSERT INTO attendance 
       (id_schedule, nim, status, attachment, latitude, longitude, location_address, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [id_schedule, nim, true, photoPath, latitude, longitude, location_address || null]
        );

        if (result.affectedRows > 0) {
            return res.json({
                success: true,
                message: 'Presensi berhasil disimpan',
                data: {
                    id: result.insertId,
                    photo: photoPath,
                    location: location_address,
                    coordinates: { latitude, longitude }
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Gagal menyimpan presensi'
            });
        }

    } catch (error) {
        console.error('Error submit presensi:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server: ' + error.message
        });
    }
};