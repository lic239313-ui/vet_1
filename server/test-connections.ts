// 测试DeepSeek API和Supabase连接
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

console.log('环境变量检查:');
console.log('DEEPSEEK_API_KEY:', DEEPSEEK_API_KEY ? '✓ 已设置' : '✗ 未设置');
console.log('SUPABASE_URL:', SUPABASE_URL ? '✓ 已设置' : '✗ 未设置');
console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓ 已设置' : '✗ 未设置');
console.log('\n测试Supabase连接...');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSupabase() {
    try {
        const { data, error } = await supabase
            .from('case_templates')
            .select('id, disease_name')
            .limit(1);

        if (error) {
            console.error('✗ Supabase错误:', error.message);
            console.log('  提示：请确保已在Supabase执行schema.sql和seed.sql');
        } else {
            console.log('✓ Supabase连接成功');
            console.log('  数据库中的病例数:', data?.length || 0);
            if (data && data.length > 0) {
                console.log('  示例病例:', data[0].disease_name);
            }
        }
    } catch (err: any) {
        console.error('✗ Supabase连接失败:', err.message);
    }
}

async function testDeepSeek() {
    console.log('\n测试DeepSeek API...');
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
                    { role: 'system', content: '你是一个测试助手' },
                    { role: 'user', content: '回复"测试成功"' }
                ],
                max_tokens: 10
            })
        });

        if (response.ok) {
            const data: any = await response.json();
            console.log('✓ DeepSeek API连接成功');
            console.log('  返回:', data.choices[0].message.content);
        } else {
            const errorText = await response.text();
            console.error('✗ DeepSeek API错误:', response.status, errorText);
        }
    } catch (err: any) {
        console.error('✗ DeepSeek API连接失败:', err.message);
    }
}

testSupabase().then(() => testDeepSeek());
