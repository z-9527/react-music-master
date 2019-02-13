

export function formatNumber(num){
    if(num<10000){
        return num + '次'
    }
    if(num>=10000){
        num = num/10000
        return num.toFixed(1) + '万次'
    }
}