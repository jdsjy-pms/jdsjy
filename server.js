const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 数据存储目录
const DATA_DIR = path.join(__dirname, 'data');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 保存客户信息
app.post('/api/client', (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ success: false, message: '请填写必填项' });
  }

  const clientData = {
    id: Date.now().toString(),
    name,
    phone,
    email,
    message: message || '',
    createdAt: new Date().toISOString()
  };

  const filePath = path.join(DATA_DIR, `${clientData.id}.json`);

  try {
    fs.writeFileSync(filePath, JSON.stringify(clientData, null, 2), 'utf-8');
    res.json({ success: true, message: '信息提交成功', id: clientData.id });
  } catch (error) {
    console.error('保存失败:', error);
    res.status(500).json({ success: false, message: '保存失败，请重试' });
  }
});

// 获取所有客户信息
app.get('/api/clients', (req, res) => {
  try {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    const clients = files.map(file => {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
      return JSON.parse(content);
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ success: false, message: '读取数据失败' });
  }
});

app.listen(PORT, () => {
  console.log(`服务器已启动: http://localhost:${PORT}`);
});