import 'whatwg-fetch'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''

/**
 * 处理url
 * @param url
 * @param param
 * @returns {*}
 */
function handleURL (url, param) {
    let completeUrl = BASE_URL + url
    if (completeUrl.indexOf('?') === -1) {
        completeUrl = `${url}?${ObjToURLString(param)}`
    } else {
        completeUrl = `${url}&${ObjToURLString(param)}`
    }
    return completeUrl
}

/**
 * 将参数对象转化为'test=1&test2=2'这种字符串形式
 * @param param
 * @returns {string}
 * @constructor
 */
function ObjToURLString (param = {}) {
    const list = Object.entries(param).map(item => {
        return `${item[0]}=${item[1]}`
    })

    return list.join('&')
}

export async function get (url, param) {
    const completeUrl = handleURL(url, param)
    const response = await fetch(completeUrl, {
        credentials: 'include',
    })
    if (response.ok) {
        return response.json()
    } else {
        return response
    }
}

export async function post (url, parma) {
    const completeUrl = BASE_URL + url
    const response = await fetch(completeUrl, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(parma),
    })
    if (response.ok) {
        return response.json()
    } else {
        return response
    }
}
