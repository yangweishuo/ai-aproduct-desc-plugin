// // import DOMPurify from 'dompurify';
//
// 获取 DOM 元素
const productNameInput = document.getElementById('product-name');
const lengthOptionSelect = document.getElementById('length-option');
const generateButton = document.getElementById('generate-button');
const descriptionOutput = document.getElementById('description-output');
const copyButton = document.getElementById('copy-button');

// 缓存对象
const cache = {};

// 处理生成文案逻辑
generateButton.addEventListener('click', async () => {
    let productName = productNameInput.value.trim();
    if (!productName) {
        alert('请输入有效的商品名称，不能为空。');
        return;
    }
    // 过滤输入
    // productName = DOMPurify.sanitize(productName);
    if (productName.length > 100) {
        alert('商品名称过长，请控制在 100 个字符以内。');
        return;
    }

    const lengthOption = lengthOptionSelect.value;
    let lengthPrompt = '';
    switch (lengthOption) {
        case '简短':
            lengthPrompt = '尽量简短';
            break;
        case '适中':
            lengthPrompt = '';
            break;
        case '详细':
            lengthPrompt = '尽量详细';
            break;
    }

    const cacheKey = `${productName}-${lengthOption}`;
    if (cache[cacheKey]) {
        descriptionOutput.value = cache[cacheKey];
        return;
    }

    // 显示加载状态
    generateButton.disabled = true;
    generateButton.textContent = '生成中...';

    try {
        const response = await fetch('you_AI_API_url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer you_sk'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {
                        role: 'user',
                        content: `请为商品 ${productName} 生成一段${lengthPrompt}的商品详情页文案。`
                    }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error ? errorData.error.message : '未知错误';
            throw new Error(`请求失败，状态码: ${response.status}，错误信息: ${errorMessage}`);
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            const description = data.choices[0].message.content;
            descriptionOutput.value = description;
            cache[cacheKey] = description;
        } else {
            alert('生成文案时出错，请稍后重试。');
        }
    } catch (error) {
        console.error('生成文案时出错:', error);
        alert(`生成文案时出错: ${error.message}`);
    } finally {
        // 恢复按钮状态
        generateButton.disabled = false;
        generateButton.textContent = '生成文案';
    }
});

// 处理复制按钮点击事件
copyButton.addEventListener('click', () => {
    const description = descriptionOutput.value;
    if (description) {
        navigator.clipboard.writeText(description)
            .then(() => {
                alert('文案已复制到剪贴板。');
            })
            .catch((error) => {
                console.error('复制文案时出错:', error);
                alert('复制文案时出错，请稍后重试。');
            });
    } else {
        alert('没有可复制的文案，请先生成文案。');
    }
});
// import DOMPurify from 'dompurify';
// import { switchLocale } from './i18n.js';

// // 获取 DOM 元素
// const productNameInput = document.getElementById('product-name');
// const lengthOptionSelect = document.getElementById('length-option');
// const generateButton = document.getElementById('generate-button');
// const descriptionOutput = document.getElementById('description-output');
// const copyButton = document.getElementById('copy-button');
//
// // 缓存对象
// const cache = {};
//
// // 处理生成文案逻辑
// generateButton.addEventListener('click', () => {
//     let productName = productNameInput.value.trim();
//     if (!productName) {
//         alert(localeData.error_empty_name);
//         return;
//     }
//     // 过滤输入
//     // productName = DOMPurify.sanitize(productName);
//     if (productName.length > 100) {
//         alert(localeData.error_long_name);
//         return;
//     }
//
//     const lengthOption = lengthOptionSelect.value;
//     let lengthPrompt = '';
//     switch (lengthOption) {
//         case '简短':
//             lengthPrompt = '尽量简短';
//             break;
//         case '适中':
//             lengthPrompt = '';
//             break;
//         case '详细':
//             lengthPrompt = '尽量详细';
//             break;
//     }
//
//     const cacheKey = `${productName}-${lengthOption}`;
//     if (cache[cacheKey]) {
//         descriptionOutput.value = cache[cacheKey];
//         return;
//     }
//
//     // 显示加载状态
//     generateButton.disabled = true;
//     generateButton.textContent = '生成中...';
//
//     $.ajax({
//         url: 'https://api.deepseek.com/chat/completions',
//         type: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer sk-aeaec973978d4ea986281fe9a7b7654e'
//         },
//         data: JSON.stringify({
//             model: 'deepseek-chat',  // 根据实际支持的模型填写
//             messages: [
//                 {"role": "system", "content": "You are a helpful assistant."},
//                 {
//                     role: 'user',
//                     content: `请为商品 "${productName}" 生成一段${lengthPrompt}的商品详情页文案。`
//                 }
//             ],
//             stream: false
//         }),
//         success: function (data) {
//             if (data.choices && data.choices.length > 0) {
//                 const description = data.choices[0].message.content;
//                 descriptionOutput.value = description;
//                 cache[cacheKey] = description;
//             } else {
//                 alert('生成文案时出错，请稍后重试。');
//             }
//             // 恢复按钮状态
//             generateButton.disabled = false;
//             generateButton.textContent = localeData.generate_button;
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             let errorMessage;
//             try {
//                 const errorData = JSON.parse(jqXHR.responseText);
//                 errorMessage = errorData.error ? errorData.error.message : '未知错误';
//             } catch (parseError) {
//                 errorMessage = '未知错误';
//             }
//             console.error('生成文案时出错:', errorThrown);
//             alert(localeData.error_generate + `请求失败，状态码: ${jqXHR.status}，错误信息: ${errorMessage}`);
//             // 恢复按钮状态
//             generateButton.disabled = false;
//             generateButton.textContent = localeData.generate_button;
//         }
//     });
// });
//
// // 处理复制按钮点击事件
// copyButton.addEventListener('click', () => {
//     const description = descriptionOutput.value;
//     if (description) {
//         navigator.clipboard.writeText(description)
//             .then(() => {
//                 alert(localeData.copied_success);
//             })
//             .catch((error) => {
//                 console.error('复制文案时出错:', error);
//                 alert(localeData.copied_error);
//             });
//     } else {
//         alert('没有可复制的文案，请先生成文案。');
//     }
// });