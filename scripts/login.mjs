import { postRequest } from "./requests.mjs"
import {updateInfoOnPage, clearForm} from "./script.mjs"
const mainURL = "https://midterm2.front.kreosoft.space/api"
const authURL = mainURL + "/auth"

export function signIn(userInfo) {
    postRequest(authURL, userInfo)
        .then((response) => response.json())
        .then(data => {
            console.log(data)
            let msg = $("#authForm").find('.message')
            if (data.accessToken) {
                localStorage.setItem("token", data.accessToken);
                updateInfoOnPage()
                $('#authModal').modal('hide')

                if (!(msg.hasClass("d-none")))
                    msg.addClass("d-none")
                clearForm.call($("#authForm"))
            }
            else {
                msg.removeClass("d-none")
                msg.text(data.message)
            }
        })
        .catch(error => console.error(error))
}

window.logOut = function logOut() {
    localStorage.removeItem("token")
    updateInfoOnPage()
}
