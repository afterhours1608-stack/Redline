import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        katalog: resolve(__dirname, 'katalog.html'),
        produk: resolve(__dirname, 'produk.html'),
        keranjang: resolve(__dirname, 'keranjang.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        pembayaran: resolve(__dirname, 'pembayaran.html'),
        akun: resolve(__dirname, 'akun.html'),
        tentang: resolve(__dirname, 'tentang.html'),
        faq: resolve(__dirname, 'faq.html'),
        kontak: resolve(__dirname, 'kontak.html'),
        adminLogin: resolve(__dirname, 'admin/login.html'),
        adminIndex: resolve(__dirname, 'admin/index.html'),
        adminContent: resolve(__dirname, 'admin/content.html'),
        adminProducts: resolve(__dirname, 'admin/products.html'),
        adminOrders: resolve(__dirname, 'admin/orders.html'),
        adminLeads: resolve(__dirname, 'admin/leads.html'),
        adminPayments: resolve(__dirname, 'admin/payments.html'),
        adminProfile: resolve(__dirname, 'admin/profile.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
});
