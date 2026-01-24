// 简单测试DeepSeek API
const DEEPSEEK_API_KEY = "sk-8f140e71f91f4751827b7a8beaa3c192";

async function testDeepSeek() {
    console.log('测试DeepSeek API连接...\n');

    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是一个测试助手，请用中文回复' },
                    { role: 'user', content: '请回复"测试成功"' }
                ],
                max_tokens: 20,
                temperature: 1.0
            })
        });

        console.log('HTTP状态:', response.status, response.statusText);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ DeepSeek API调用成功！');
            console.log('返回内容:', data.choices[0].message.content);
        } else {
            const errorText = await response.text();
            console.log('❌ DeepSeek API错误');
            console.log('错误详情:', errorText);
        }
    } catch (err) {
        console.error('❌ 网络错误:', err.message);
    }
}

testDeepSeek();
