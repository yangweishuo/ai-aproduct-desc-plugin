// 当前语言
let currentLocale = 'zh';
// 语言数据
let localeData = {};

// 加载语言文件
async function loadLocale(locale) {
    try {
        const response = await fetch(`locales/${locale}.json`);
        localeData = await response.json();
        currentLocale = locale;
        applyLocale();
    } catch (error) {
        console.error('Error loading locale:', error);
    }
}

// 应用语言数据到页面
function applyLocale() {
    document.title = localeData.title;
    document.querySelector('h1').textContent = localeData.title;
    document.getElementById('product-name').placeholder = localeData.input_placeholder;
    document.querySelectorAll('#length-option option')[0].textContent = localeData.length_short;
    document.querySelectorAll('#length-option option')[1].textContent = localeData.length_medium;
    document.querySelectorAll('#length-option option')[2].textContent = localeData.length_long;
    document.getElementById('generate-button').textContent = localeData.generate_button;
    document.getElementById('copy-button').textContent = localeData.copy_button;
}

// 切换语言
function switchLocale(locale) {
    if (locale!== currentLocale) {
        loadLocale(locale);
    }
}

// 初始化加载默认语言
loadLocale(currentLocale);

export { switchLocale };