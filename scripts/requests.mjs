
export async function postRequest(url, data) {
    return await fetch(url, {
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
}

export async function postWithAuthRequest(url, data) {
    return await fetch(url, {
        credentials: 'same-origin',
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("token")
        }),
    })
}

export async function getRequest(url){
    const response = await fetch(url, {
        method: "GET",
        headers: new Headers({
            'Authorization': "Bearer " + localStorage.getItem("token")
        })
    })
    return await response.json()
}

export async function deleteRequest(url, data){
    return fetch(url, {
        credentials: 'same-origin',
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("token")
        }),
    })
}