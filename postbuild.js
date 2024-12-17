import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义 dist 文件夹的路径
const distPath = path.resolve(__dirname, 'dist');

// 定义 src 文件夹的路径
const srcPath = path.join(distPath, 'src');

// 检查 src 文件夹是否存在
if (fs.existsSync(srcPath)) {
  // 删除 src 文件夹
  fs.rmSync(srcPath, { recursive: true });
  console.log(`Deleted ${srcPath}`);
} else {
  console.log(`${srcPath} does not exist`);
}