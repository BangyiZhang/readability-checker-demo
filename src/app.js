import express from 'express';
import bodyParser from 'body-parser';
import readabilityCheck from './readabilityCheck.js';  // Ensure this path is correct

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));  // 使public目录中的文件可访问

app.post('/check', (req, res) => {
    readabilityCheck(req.body.url)
      .then(result => res.json({ support: !!result }))
      .catch(error => {
          console.error('Error:', error);
          res.status(500).json({ error: 'Error processing your request' });
      });
});

// 新增 GET /readability/:url 路由
// 新增 GET /readability/:url 路由
app.get('/readability/:url', (req, res) => {
    const { url } = req.params;
    console.log('Received URL:', url); // 日志输出接收到的 URL

    const decodedUrl = decodeURIComponent(url);
    console.log('Decoded URL:', decodedUrl); // 日志输出解码后的 URL

    readabilityCheck(decodedUrl)
        .then(result => {
            console.log('Readability result:', result); // 日志输出 Readability 的结果
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({ error: 'No readability data available' });
            }
        })
        .catch(error => {
            console.error('Error processing readability for URL:', decodedUrl, error);
            res.status(500).json({ error: 'Server error' });
        });
});


app.listen(3333, () => {
    console.log('Server is running on port 3333');
});
