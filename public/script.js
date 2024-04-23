document.getElementById('checkButton').addEventListener('click', function() {
    const url = document.getElementById('urlInput').value;
    const button = this;
    button.textContent = '检查中...';
    button.disabled = true;

    fetch('/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Received data:", data); // 查看接收到的数据
        const modal = document.getElementById('resultModal');
        document.getElementById('modalContent').textContent = `该网页${data.support ? "支持" : "不支持"} Readability`;
        modal.style.display = 'block';
        if (data.support) {
            const openButton = document.getElementById('openReadabilityButton');
            openButton.style.display = 'inline';
            openButton.onclick = function() {
                showModalReadability(url);
            };
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('modalContent').textContent = '检查失败，请稍后再试';
        document.getElementById('resultModal').style.display = 'block';
    })
    .finally(() => {
        button.textContent = '检查';
        button.disabled = false;
    });
});

function showModalReadability(url) {
    // 请求后端获取 readability 数据
    fetch(`/readability/${encodeURIComponent(url)}`)
    .then(response => response.json())
    .then(data => {
        // 将读取结果显示在模态窗口中
        if (data.title) {
            document.getElementById('modalTitle').textContent = data.title;
            document.getElementById('modalContent').innerHTML = `<strong>摘要:</strong> ${data.excerpt}<br><strong>内容:</strong> ${data.textContent}`;
        } else {
            document.getElementById('modalContent').textContent = '未找到 Readability 数据';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('modalContent').textContent = '获取 Readability 数据失败';
    });
}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
    document.getElementById('openReadabilityButton').style.display = 'none';
}
