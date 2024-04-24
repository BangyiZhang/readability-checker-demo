document.addEventListener('DOMContentLoaded', function () {
    const checkButton = document.getElementById('checkButton');
    const input = document.getElementById('urlInput');
    const showButton = document.getElementById('showReadabilityButton');

    // 检查输入框并更新按钮状态的函数
    function updateButtonStatus() {
        if (input.value.trim() === '') {
            checkButton.disabled = true;  // 禁用检查按钮
        } else {
            checkButton.disabled = false;  // 启用检查按钮
        }
    }

    // 在页面加载时立即检查输入框状态
    updateButtonStatus();

    // 添加事件监听器，当输入内容变化时更新按钮状态
    input.addEventListener('input', updateButtonStatus);

    checkButton.addEventListener('click', function () {
        const url = input.value;
        if (checkButton.textContent === '清除') {
            input.value = '';
            checkButton.textContent = '检查';
            showButton.style.display = 'none';
            updateButtonStatus();
            return;
        }

        checkButton.textContent = '检查中...';
        document.getElementById('modalContent').innerHTML = '';  // 清空旧的 Readability 数据

        fetch('/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        })
            .then(response => response.json())
            .then(data => {
                if (data.support) {
                    checkButton.textContent = '清除';
                    showButton.style.display = 'inline';
                    showButton.onclick = function () {
                        showModalReadability(url);
                    };
                } else {
                    alert('该网页不支持 Readability');
                    checkButton.textContent = '清除';
                    showButton.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('检查失败，请稍后再试');
                checkButton.textContent = '清除';
                showButton.style.display = 'none';
            });
    });
});



function showModalReadability(url) {
    fetch(`/readability/${encodeURIComponent(url)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not successful');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error('No readability data available');
            }
            document.getElementById('originalLink').href = url;
            document.getElementById('originalLink').textContent = url;
            //document.getElementById('modalContent').innerHTML = data.title + '\n\n' + data.excerpt + '\n\n' + data.textContent;
            // 更新内容显示格式
            document.getElementById('modalContent').innerHTML = `<h2 class="readabilityTitle">${data.title || 'Readability 结果'}</h2>` +
                `<p class="readabilityExcerpt">${data.excerpt}</p>` +
                `<p class="readabilityContent">${data.textContent}</p>`;
            document.getElementById('resultModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('modalContent').textContent = '获取 Readability 数据失败: ' + error.message;
            document.getElementById('resultModal').style.display = 'block';
        });
}

function adjustTextSize(size) {
    document.getElementById('modalContent').style.fontSize = size + 'em';
}

document.getElementById('textSizeIcon').addEventListener('click', function () {
    const slider = document.getElementById('textSizeSlider');
    slider.style.display = slider.style.display === 'none' ? 'block' : 'none';
});

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
    const checkButton = document.getElementById('checkButton');
    const showButton = document.getElementById('showReadabilityButton');
    checkButton.textContent = '检查';
    checkButton.disabled = false;
    showButton.style.display = 'none';  // 关闭弹窗时隐藏展示按钮
}
