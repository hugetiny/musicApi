function randomString(pattern: string, length: number) {
    return Array.from(new Array(length), () => pattern[Math.floor(Math.random() * pattern.length)]).join('')
}

export default function completeCookie(cookie:string = '') {
    let origin = cookie.split(/;\s*/).map(element => (element.split('=')[0])), extra = []
    let now = (new Date).getTime()

    if (!origin.includes('JSESSIONID-WYYY')) {
        let expire = new Date(now + 1800000) //30 minutes
        let jessionid = randomString('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ\\/+', 176) + ':' + expire.getTime()
        extra.push(['JSESSIONID-WYYY=' + jessionid, 'Expires=' + expire.toUTCString()])
    }
    if (!origin.includes('_iuqxldmzr_')) {
        let expire = new Date(now + 157680000000) //5 years
        extra.push(['_iuqxldmzr_=32', 'Expires=' + expire.toUTCString()])
    }
    if ((!origin.includes('_ntes_nnid')) || (!origin.includes('_ntes_nuid'))) {
        let expire = new Date(now + 3153600000000) //100 years
        let nnid = randomString('0123456789abcdefghijklmnopqrstuvwxyz', 32) + ',' + now
        extra.push(['_ntes_nnid=' + nnid, 'Expires=' + expire.toUTCString()])
        extra.push(['_ntes_nuid=' + nnid.slice(0, 32), 'Expires=' + expire.toUTCString()])
    }

    return extra.map(x => x[0]).join('; ')
}