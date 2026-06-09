/* ================================================================
   api.js — REST API Gateway Hoax Detector
   ================================================================
   Modul ini adalah jembatan antara React frontend dan Flask backend.

   Panduan untuk Afin (Backend Engineer):
   ─────────────────────────────────────
   1. Pastikan Flask berjalan di localhost:5000 (atau sesuaikan BASE_URL)
   2. Endpoint yang sudah tersedia: POST /predict
      - Request body: { "text": "..." }
      - Response: { label: "HOAX"|"VALID", score: 0.0-1.0, ... }
        (sesuaikan dengan output Gradio model ardhptr21/hoax-detection-id)
   3. Endpoint OCR placeholder: POST /ocr
      - Request body: FormData dengan key "image"
      - Response: { text: "..." }  ← diisi Ardhi setelah EasyOCR siap

   Panduan untuk Nima (Frontend):
   ───────────────────────────────
   Ubah VITE_API_BASE_URL di file .env jika backend berjalan di host/port lain.
   Saat development, Vite proxy sudah menangani /predict dan /ocr → localhost:5000.
   ================================================================ */

import axios from 'axios';

// ── Base URL ────────────────────────────────────────────────────────────────
// Di development: diproxy Vite ke localhost:5000 (lihat vite.config.js)
// Di production : set VITE_API_BASE_URL di .env file
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 detik
});

// ── Request Interceptor (opsional untuk logging) ─────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Contoh: tambahkan auth header di sini jika diperlukan
    // config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor (centralized error handling) ────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan saat menghubungi server.';
    return Promise.reject(new Error(message));
  }
);

// ============================================================================
// ENDPOINT 1: POST /predict
// Kirim teks berita dan dapatkan hasil klasifikasi IndoBERT
// ============================================================================
/**
 * Mengirim teks ke model IndoBERT via Flask backend untuk diklasifikasikan.
 *
 * @param {string} text - Teks berita / konten yang akan dianalisis
 * @returns {Promise<Object>} Response dari backend (label, score, dsb.)
 *
 * Contoh response yang diharapkan dari Gradio model:
 * {
 *   label: "HOAX" | "VALID",
 *   score: 0.92,          // confidence 0.0 - 1.0
 *   category: "...",      // (opsional) kategori disinformasi
 *   explanation: "..."    // (opsional) penjelasan model
 * }
 */
export const predictHoax = async (text) => {
  const response = await apiClient.post('/predict', { text });
  return response.data;
};

// ============================================================================
// ENDPOINT 2: POST /ocr  [PLACEHOLDER — Ardhi / Afin]
// Kirim gambar dan dapatkan teks hasil EasyOCR
// ============================================================================
/**
 * [PLACEHOLDER] Mengirim file gambar ke backend EasyOCR.
 * Saat ini belum tersambung ke backend. Ardhi mengisi implementasi di sisi server.
 *
 * @param {File} imageFile - File objek dari input/drag-drop
 * @returns {Promise<{text: string}>} Teks hasil ekstraksi OCR
 *
 * TODO (Ardhi): Implementasikan endpoint POST /ocr di Flask yang menerima
 * multipart/form-data dengan key "image" dan mengembalikan { "text": "..." }
 */
export const extractOCR = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post(`${BASE_URL}/ocr`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // OCR butuh lebih lama
  });

  return response.data; // { text: "..." }
};

export default apiClient;
