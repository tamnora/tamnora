// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import fs from 'fs'

const input = {}

function addFilesFromFolder(folder, myDir) {
  fs.readdirSync(resolve(__dirname, folder)).forEach(file => {
    const filePath = resolve(__dirname, folder, file);
    
    if (fs.lstatSync(filePath).isDirectory()) {
      addFilesFromFolder(filePath, file);
  
    } else if (file.endsWith('.html')) {
      const name = myDir + '_' + file.replace('.html', '');
      input[name] = filePath;
    }
  })
}

addFilesFromFolder('src', 'src');

export default defineConfig({
  root: './src',
  base: './',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input
    },
  },
})

