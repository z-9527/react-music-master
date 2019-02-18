/**
 * 将1000转换为'1万'
 * @param num
 * @returns {*}
 */
export function formatNumber(num){
    if(num<10000){
        return num
    }
    if(num>=10000){
        num = num/10000
        return num.toFixed(1) + '万'
    }
}

/**
 * 实现类似vue的v-html功能
 * @param description
 * @returns {{__html: *}}
 */
export function createMarkup(description) {
    if(description){
        description = description.replace(/(\r\n|\n|\r)/gm, "<br />")
        return {__html: description};
    }
}