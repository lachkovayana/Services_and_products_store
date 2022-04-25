import { postRequest } from "./requests.mjs"
import { signIn } from "./login.mjs"

const mainURL = "https://midterm2.front.kreosoft.space/api"
const registerURL = mainURL + "/auth/register"


export function registerNewUser() {
    let user = {
        "username": ($("#registerUsername").val()).toString(),
        "password": ($("#registerPassword").val()).toString(),
        "photoPath": ($("#registerAvatar").val()).toString()
    }

    postRequest(registerURL, user)
        .then(() => {
            signIn(user)
            $('#registerModal').modal('hide')
        })
        .catch(error => console.error(error))
}