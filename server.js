const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Memastikan server dan koneksi database dapat digunakan
app.get("/", (req, res) => {
  res.json({ message: "API Data Siswa berjalan" });
});

// READ: mengambil semua data siswa
app.get("/api/siswa", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM siswa ORDER BY kode_siswa ASC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data siswa" });
  }
});

// READ: mengambil satu siswa berdasarkan kode
app.get("/api/siswa/:kode", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM siswa WHERE kode_siswa = ?",
      [req.params.kode]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Data siswa tidak ditemukan" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail siswa" });
  }
});

// CREATE: menambahkan siswa baru
app.post("/api/siswa", async (req, res) => {
  const { kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;

  if (!kode_siswa || !nama_siswa || !alamat_siswa || !tgl_siswa || !jurusan_siswa) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  try {
    await db.query(
      `INSERT INTO siswa
       (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa)
       VALUES (?, ?, ?, ?, ?)`,
      [kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa]
    );
    res.status(201).json({ message: "Data siswa berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Kode siswa sudah digunakan" });
    }
    res.status(500).json({ message: "Gagal menambahkan data siswa" });
  }
});

// UPDATE: mengubah data siswa berdasarkan kode
app.put("/api/siswa/:kode", async (req, res) => {
  const { nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;

  if (!nama_siswa || !alamat_siswa || !tgl_siswa || !jurusan_siswa) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  try {
    const [result] = await db.query(
      `UPDATE siswa
       SET nama_siswa = ?, alamat_siswa = ?, tgl_siswa = ?, jurusan_siswa = ?
       WHERE kode_siswa = ?`,
      [nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa, req.params.kode]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data siswa tidak ditemukan" });
    }
    res.json({ message: "Data siswa berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui data siswa" });
  }
});

// DELETE: menghapus siswa berdasarkan kode
app.delete("/api/siswa/:kode", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM siswa WHERE kode_siswa = ?",
      [req.params.kode]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data siswa tidak ditemukan" });
    }
    res.json({ message: "Data siswa berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus data siswa" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
