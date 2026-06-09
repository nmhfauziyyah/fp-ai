/* ================================================================
   api.js — REST API Service untuk Hoax Detector
   Single endpoint: POST /predict di localhost:5000

   Cara kirim per tipe input:
   ─ text  → JSON body    { "text":  "..." }
   ─ url   → JSON body    { "url":   "..." }
   ─ image → FormData     key: "image" (file)

   Contoh response dari Gradio model:
   {
     "label": "LABEL_0" | "LABEL_1",   // LABEL_0=valid, LABEL_1=hoax (verify!)
     "score": 0.92                      // confidence 0.0–1.0
   }
   ================================================================ */

import axios from 'axios';

// Dev: request lewat Vite proxy (vite.config.js → localhost:5000), tidak ada CORS issue
// Prod: set VITE_API_BASE_URL=https://your-api.com di .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 detik (model Gradio bisa lambat)
});

// ── Response interceptor: tangani error HTTP secara terpusat ────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Gagal menghubungi server.';
    return Promise.reject(new Error(msg));
  }
);

// ============================================================================
// predictText — kirim teks berita langsung
// Body: application/json → { "text": "..." }
// ============================================================================
export const predictText = async (text) => {
  const res = await apiClient.post('/predict', { text }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

// ============================================================================
// predictUrl — kirim URL berita (backend akan crawl sendiri)
// Body: application/json → { "url": "..." }
// ============================================================================
export const predictUrl = async (url) => {
  const res = await apiClient.post('/predict', { url }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

// ============================================================================
// predictImage — kirim file gambar (backend EasyOCR + predict)
// Body: multipart/form-data → key "image" = File
// PENTING: image harus dikirim sebagai FormData, bukan JSON!
// ============================================================================
export const predictImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await apiClient.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export default apiClient;
