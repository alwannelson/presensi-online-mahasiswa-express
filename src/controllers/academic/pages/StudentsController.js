const bcrypt = require('bcrypt');
const db = require('../../../configs/db');

exports.getStudentsPage = async (req, res) => {
    try {
        const { nim, name, major, page } = req.query;


        const limit = 10;
        const currentPage = parseInt(page) || 1;
        const offset = (currentPage - 1) * limit;


        let querySql = "SELECT * FROM students WHERE 1=1";
        let countSql = "SELECT COUNT(*) as total FROM students WHERE 1=1";
        let queryParams = [];
        let countParams = [];


        if (nim && nim.trim() !== '') {
            querySql += " AND nim = ?";
            countSql += " AND nim = ?";
            queryParams.push(nim.trim());
            countParams.push(nim.trim());
        }


        if (name && name.trim() !== '') {
            querySql += " AND fullname LIKE ?";
            countSql += " AND fullname LIKE ?";
            queryParams.push(`%${name.trim()}%`);
            countParams.push(`%${name.trim()}%`);
        }


        if (major && major.trim() !== '') {
            querySql += " AND major = ?";
            countSql += " AND major = ?";
            queryParams.push(major.trim());
            countParams.push(major.trim());
        }


        const [countResult] = await db.query(countSql, countParams);
        const totalData = countResult[0].total;
        const totalPages = Math.ceil(totalData / limit);


        querySql += " ORDER BY nim ASC LIMIT ? OFFSET ?";


        const finalParams = [...queryParams, limit, offset];


        const [students] = await db.query(querySql, finalParams);


        res.render('a/students', {
            layout: 'a/layouts/main-layout',
            currentPage: 'students',
            students: students,
            searchQuery: { nim: nim || '', name: name || '', major: major || '' },
            pagination: {
                totalData,
                currentPage,
                totalPages,
                hasNext: currentPage < totalPages,
                hasPrev: currentPage > 1
            }
        });

    } catch (error) {
        console.error('Error getStudents:', error);


        req.flash('error', 'Gagal mengambil data mahasiswa. Silakan coba lagi.');
        res.render('a/students', {
            layout: 'a/layouts/main-layout',
            currentPage: 'students',
            students: [],
            searchQuery: { nim: '', name: '', major: '' },
            pagination: {
                totalData: 0,
                currentPage: 1,
                totalPages: 0,
                hasNext: false,
                hasPrev: false
            }
        });
    }
}

exports.getNewStudentPage = (req, res) => {
    try {
        res.render('a/new-student', {
            layout: 'a/layouts/main-layout',
            currentPage: 'students',
            title: 'Tambah Mahasiswa',
            error: null,
            oldInput: req.flash('oldInput')[0] || null,
            success: req.flash('success')[0] || null,
            error: req.flash('error')[0] || null,
            messages: req.flash()
        });
    } catch (error) {
        console.error('Error getNewStudentPage:', error);
        res.render('a/new-student', {
            layout: 'a/layouts/main-layout',
            currentPage: 'students',
            title: 'Tambah Mahasiswa',
            error: { general: 'Terjadi kesalahan saat memuat halaman' },
            oldInput: null,
            success: null,
            messages: req.flash()
        });
    }
}

exports.postNewStudent = async (req, res) => {
    try {
        const { nim, fullname, password, major, address, email } = req.body;


        let errors = {};
        if (!nim || nim.trim() === '') errors.nim = 'NIM wajib diisi';
        if (!fullname || fullname.trim() === '') errors.fullname = 'Nama lengkap wajib diisi';
        if (!password || password.trim() === '') errors.password = 'Password wajib diisi';
        if (!major || major.trim() === '') errors.major = 'Jurusan wajib dipilih';
        if (!address || address.trim() === '') errors.address = 'Alamat wajib diisi';
        if (!email || email.trim() === '') errors.email = 'Email wajib diisi';


        if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.email = 'Format email tidak valid';
        }

        if (Object.keys(errors).length > 0) {

            req.flash('oldInput', req.body);
            req.flash('error', 'Silakan perbaiki kesalahan pada form');

            return res.render('a/new-student', {
                layout: 'a/layouts/main-layout',
                currentPage: 'students',
                title: 'Tambah Mahasiswa',
                error: errors,
                oldInput: req.body,
                success: null,
                messages: req.flash()
            });
        }


        const [existing] = await db.query(
            'SELECT * FROM students WHERE nim = ? OR email = ?',
            [nim, email]
        );

        if (existing.length > 0) {
            if (existing[0].nim === nim) {
                errors.nim = 'NIM sudah terdaftar';
            }
            if (existing[0].email === email) {
                errors.email = 'Email sudah terdaftar';
            }

            req.flash('oldInput', req.body);

            return res.render('a/new-student', {
                layout: 'a/layouts/main-layout',
                currentPage: 'students',
                title: 'Tambah Mahasiswa',
                error: errors,
                oldInput: req.body,
                success: null,
                messages: req.flash()
            });
        }


        const randomNumber = Math.floor(Math.random() * 9000) + 1000
        const firstName = fullname.split(' ')[0]
        const uniqueNickname = `${firstName}!jn!${randomNumber}`
        const hashed = await bcrypt.hash(password, 12)
        const [insert] = await db.execute(
            `INSERT INTO students (nim, password, fullname, nickname, email, major, address, telephone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nim, hashed, fullname, uniqueNickname, email, major, address, '-']
        )

        if (insert.affectedRows >= 1) {
            req.flash('success', `Berhasil menambahkan ${fullname} dengan NIM ${nim}.`)
            return res.redirect('/a/students/new-student')
        }
    } catch (error) {
        console.error('Error createStudent:', error);
        req.flash('oldInput', req.body);
        req.flash('error', 'Gagal menambahkan mahasiswa. Silakan coba lagi.');

        res.render('a/new-student', {
            layout: 'a/layouts/main-layout',
            currentPage: 'students',
            title: 'Tambah Mahasiswa',
            error: { general: 'Terjadi kesalahan pada server' },
            oldInput: req.body,
            success: null,
            messages: req.flash()
        });
    }
}

exports.deleteStudent = async (req, res) => {
    try {
        const { nim } = req.params

        const [deleteThat] = await db.execute(
            `DELETE FROM students WHERE nim = ?`, [nim]
        )

        if (deleteThat.affectedRows >= 1) {
            return res.status(200).json({
                success: true,
                message: `NIM ${nim} berhasil dihapus.`
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.getEditStudentPage = async (req, res) => {
    try {
        const nim = req.params.nim;


        const [rows] = await db.query('SELECT * FROM students WHERE nim = ?', [nim]);

        if (rows.length === 0) {
            req.flash('error', 'Data mahasiswa tidak ditemukan');
            return res.redirect('/a/students');
        }

        const student = rows[0];
        student.status = student.status == 1 || student.status === '1' || student.status === 'true'

        res.render('a/edit-student', {
            layout: 'a/layouts/main-layout',
            currentPage: 'students',
            title: 'Edit Mahasiswa',
            student: student,
            error: null,
            oldInput: null,
            messages: req.flash()
        });

    } catch (error) {
        console.error('Error getEditStudentPage:', error);
        req.flash('error', 'Terjadi kesalahan saat memuat data');
        res.redirect('/a/students');
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { nim_params } = req.params;
        const formData = req.body;
        const status = formData.status ? 1 : 0;
        
        // ===== 1. VALIDASI =====
        let errors = {};

        // Validasi NIM
        if (formData.nim !== nim_params) {
            errors.nim = 'NIM tidak sinkron';
        }

        // Validasi required fields
        const requiredFields = [
            { field: 'fullname', message: 'Nama lengkap wajib diisi' },
            { field: 'major', message: 'Jurusan wajib dipilih' },
            { field: 'address', message: 'Alamat wajib diisi' },
            { field: 'email', message: 'Email wajib diisi' }
        ];

        requiredFields.forEach(({ field, message }) => {
            if (!formData[field] || formData[field].trim() === '') {
                errors[field] = message;
            }
        });

        // Validasi email format
        if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.email = 'Format email tidak valid';
        }

        // Validasi password
        if (formData.password && formData.password.trim() !== '' && formData.password.length < 6) {
            errors.password = 'Password minimal 6 karakter';
        }

        // Jika ada error
        if (Object.keys(errors).length > 0) {
            const [rows] = await db.query('SELECT * FROM students WHERE nim = ?', [formData.nim]);
            return res.render('a/edit-student', {
                layout: 'a/layouts/main-layout',
                currentPage: 'students',
                title: 'Edit Mahasiswa',
                student: rows[0] || { nim: formData.nim, status: true },
                error: errors,
                oldInput: formData,
                messages: req.flash()
            });
        }

        // ===== 2. CEK EMAIL DUPLIKAT =====
        const [existing] = await db.query(
            'SELECT * FROM students WHERE email = ? AND nim != ?',
            [formData.email, formData.nim]
        );

        if (existing.length > 0) {
            errors.email = 'Email sudah digunakan oleh mahasiswa lain';
            const [rows] = await db.query('SELECT * FROM students WHERE nim = ?', [formData.nim]);
            return res.render('a/edit-student', {
                layout: 'a/layouts/main-layout',
                currentPage: 'students',
                title: 'Edit Mahasiswa',
                student: rows[0] || { nim: formData.nim, status: true },
                error: errors,
                oldInput: formData,
                messages: { error: 'Email sudah terdaftar' }
            });
        }

        // ===== 3. BUILD DYNAMIC UPDATE QUERY =====
        const updateFields = [];
        const updateValues = [];

        // Field yang bisa diupdate
        const allowedFields = ['fullname', 'major', 'address', 'email'];

        allowedFields.forEach(field => {
            if (formData[field] !== undefined && formData[field] !== null) {
                updateFields.push(`${field} = ?`);
                updateValues.push(formData[field]);
            }
        });

        // Status selalu diupdate
        updateFields.push('status = ?');
        updateValues.push(status);

        // Password hanya jika diisi
        if (formData.password && formData.password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(formData.password, 10);
            updateFields.push('password = ?');
            updateValues.push(hashedPassword);
        }

        // Tambahkan WHERE clause
        updateValues.push(formData.nim);

        // Build final query
        const updateSql = `UPDATE students SET ${updateFields.join(', ')} WHERE nim = ?`;

        // ===== 4. EKSEKUSI QUERY =====
        await db.query(updateSql, updateValues);

        // ===== 5. RESPONSE =====
        req.flash('success', 'Data mahasiswa berhasil diperbarui');
        res.redirect('/a/students');

    } catch (error) {
        console.error('Error updateStudent:', error);
        req.flash('error', 'Gagal memperbarui data mahasiswa');
        res.redirect(`/a/students/edit/${req.body.nim || req.params.nim_params}`);
    }
};