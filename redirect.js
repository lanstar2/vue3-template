window.onload = function() {
    // 定义映射关系，包含参数名和具体参数值的匹配规则
    const config = {
        rules: [
            { param: 'ie', value: '111', target: 'dl-cv/OpenIVS' },
            { param: 'ie', value: '222', target: 'tyro-ch/deepseek' },
            { param: 'type', value: 'abc', target: 'dl-cv/OpenIVS' },
            { param: 'type', value: 'xyz', target: 'tyro-ch/deepseek' },
            { param: 'code', value: 'test123', target: 'dl-cv/OpenIVS' },
            { param: 'id', value: 'special', target: 'tyro-ch/deepseek' }
        ]
    };

    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const baseURL = 'https://gitee.com';

    // 遍历规则，查找匹配的参数名和值
    let targetPath = null;
    for (const rule of config.rules) {
        const paramValue = urlParams.get(rule.param);
        if (paramValue === rule.value) {
            targetPath = rule.target;
            break;
        }
    }

    if (targetPath) {
        // 使用window.location.replace实现重定向
        var new_url = baseURL + '/' + targetPath;
        window.location.replace(new_url);
    }
}; 