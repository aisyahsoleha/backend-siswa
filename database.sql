CREATE DATABASE IF NOT EXISTS db_siswa;
USE db_siswa;

CREATE TABLE IF NOT EXISTS siswa (
  kode_siswa VARCHAR(20) PRIMARY KEY,
  nama_siswa VARCHAR(100) NOT NULL,
  alamat_siswa TEXT NOT NULL,
  tgl_siswa DATE NOT NULL,
  jurusan_siswa VARCHAR(100) NOT NULL
);

-- Contoh data awal (opsional)
INSERT INTO siswa (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa)
VALUES
('S001', 'Andi Saputra', 'Jakarta', '2005-05-12', 'Teknik Informatika'),
('S002', 'Siti Aminah', 'Bekasi', '2005-09-20', 'Sistem Informasi')
ON DUPLICATE KEY UPDATE kode_siswa = VALUES(kode_siswa);
