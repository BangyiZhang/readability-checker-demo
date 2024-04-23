import fetch from 'node-fetch';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

// 定义带超时的 fetch 函数
async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 设置超时时间为10000毫秒（10秒）

    try {
        const response = await fetch(url, { signal: controller.signal });
        return response.text(); // 返回纯文本，因为我们要处理HTML内容
    } catch (error) {
        console.error('Fetch failed', error);
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

// 使用 fetchWithTimeout 来改进 readability 检查
async function checkReadability(url) {
    try {
        const html = await fetchWithTimeout(url);
        const dom = new JSDOM(html, { url, features: { FetchExternalResources: false, ProcessExternalResources: false } }); // 禁用外部资源的加载
        const reader = new Readability(dom.window.document);
        const article = reader.parse(); // 返回处理结果

        if (!article) {
            return null;
        }

        // 确保返回的对象包含所需的字段
        return {
            title: article.title,
            excerpt: article.excerpt,
            textContent: article.textContent
        };
    } catch (error) {
        console.error('Error processing readability:', error);
         return { error: 'Error during readability processing' }; // 根据你的错误处理策略，返回适当的值或错误
    }
}

export default checkReadability;


