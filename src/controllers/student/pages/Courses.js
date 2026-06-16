const db = require('../../../configs/db')
const day = require('../../../utils/format-days')

exports.getCourses = async (req, res) => {
    try {
        const page = 'courses'
        const nim = req.user.nim
        const [rows] = await db.query('SELECT * FROM students WHERE nim = ?', [nim])
        const user = {
            fullname: rows[0].fullname,
            nickname: rows[0].nickname,
            major: req.user.major,
            nim,
            major_code: req.user.major_code
        }

        if (user.major_code === 'SI') {
            const [rows] = await db.execute(`
                SELECT 
                s.day AS day,
                co.name AS course_name,
                l.fullname AS lecturer_name,
                l.degree AS lecturer_degree,
                co.credits AS credits,
                co.slug AS slug,
                co.semester AS semester,
                c.name AS class_name
                FROM schedules s
                JOIN courses co ON s.id_course = co.id
                JOIN lecturers l ON s.nid = l.nid
                JOIN classes c ON s.id_class = c.id
                WHERE s.major_code = ?
                ORDER BY s.day ASC
                `, [user.major_code]
            )

            const semester = rows[0].semester % 2 === 0 ? 'Genap' : 'Ganjil'
            return res.status(200).render('s/dashboard', {
                title: `Mata Kuliah ${user.nim}`,
                layout: 's/layouts/main',
                page,
                user,
                activeMenu: 'courses',
                rows,
                semester,
                error: req.flash('error')[0],
                success: req.flash('success')[0]
            })
        } else {
            const [rows] = await db.execute(`
                SELECT 
                s.day AS day,
                co.name AS course_name,
                l.fullname AS lecturer_name,
                l.degree AS lecturer_degree,
                co.credits AS credits,
                co.slug AS slug,
                co.semester AS semester,
                c.name AS class_name
                FROM schedules s
                JOIN courses co ON s.id_course = co.id
                JOIN lecturers l ON s.nid = l.nid
                JOIN classes c ON s.id_class = c.id
                WHERE s.major_code = ?
                ORDER BY s.day ASC
                `, [user.major_code]
            )
            const semester = rows[0].semester % 2 === 0 ? 'Genap' : 'Ganjil'

            return res.status(200).render('s/dashboard', {
                title: `Mata Kuliah ${user.nim}`,
                layout: 's/layouts/main',
                page,
                user,
                activeMenu: 'courses',
                rows,
                semester,
                error: req.flash('error')[0],
                success: req.flash('success')[0]
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params
        const nim = req.user.nim
        const [rows] = await db.execute(
            `SELECT * FROM students WHERE nim = ?`, [nim]
        )
        const user = {
            fullname: rows[0].fullname,
            nickname: rows[0].nickname,
            nim: rows[0].nim,
            major: rows[0].major
        }

        const [course] = await db.execute(
            `
                SELECT
                    co.name AS course_name,
                    s.day AS day,
                    l.fullname AS lecturer_name,
                    l.telephone AS lecturer_telephone,
                    co.credits AS credits,
                    c.name AS class_name,
                    c.location AS location,
                    c.capacity AS capacity,
                    s.start_time AS start_time,
                    s.end_time AS end_time,
                    TIMEDIFF(s.end_time, s.start_time) AS durations
                FROM schedules s
                JOIN courses co ON s.id_course = co.id
                JOIN classes c ON s.id_class = c.id
                JOIN lecturers l ON s.nid = l.nid
                WHERE co.slug = ?
            `, [slug]
        )

        if (course.length === 0) {
            return res.status(404).render('err/404', {
                layout: 'err/404'
            })
        }

        res.status(200).render('s/detailcourse', {
            layout: 's/detailcourse',
            course,
            slug
        })
    } catch (error) {
        console.log(error)
    }
}