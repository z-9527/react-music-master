

export function formatNumber(num){
    if(num<10000){
        return num
    }
    if(num>=10000){
        num = num/10000
        return num.toFixed(1) + '万'
    }
}