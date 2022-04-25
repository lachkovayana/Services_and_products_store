import { addNewComment } from "./comments.mjs"
import { addNewProduct, loadProducts, saveEditedProduct } from "./products.mjs"
import { addNewService, loadServices, saveEditedService } from "./services.mjs"
import { registerNewUser } from "./register.mjs"
import { signIn } from "./login.mjs"

document.addEventListener("DOMContentLoaded", () => {
    updateInfoOnPage()

    $('#registerForm').submit(function (event) {
        event.preventDefault()
        if ($(this)[0].checkValidity() !== false) {
            registerNewUser()
        }
    })

    $('#authForm').submit(function (event) {
        event.preventDefault()
        if ($(this)[0].checkValidity() === false) {
            event.stopPropagation()
        } else {
            let userInfo = {
                username: $('#authForm').find($("#loginUsername")).val(),
                password: $('#authForm').find($("#loginPassword")).val()
            }

            signIn(userInfo)

        }
    })

    $('#editServiceForm').submit(function (event) {
        event.preventDefault()
        if ($(this)[0].checkValidity() === false) {
            event.stopPropagation()
        } else {
            saveEditedService()
        }
    })

    $('#editProductForm').submit(function (event) {
        event.preventDefault()
        if ($(this)[0].checkValidity() === false) {
            event.stopPropagation()
        } else {
            saveEditedProduct()
        }
    })

    $("#saveProdBtn").on("click", addNewProduct)
    $("#saveServBtn").on("click", addNewService)
    $("#sendComment").on("click", addNewComment)

    $('#registerModal').on('hidden.bs.modal', function () {
        $(this)
            .find("input,textarea")
            .val('')
            .end()
            .find('select>option:eq(0)').prop('selected', true)
            .end()
            .find('input[type=checkbox]').prop('checked', false)
            .end()
    })

    $('#authModal').on('hidden.bs.modal', function () {
        clearForm.call(this)
    })
    $('#addServiceModal').on('hidden.bs.modal', function () {
        clearForm.call(this)
    })

    $('#addProductModal').on("hidden.bs.modal", function () {
        clearForm.call(this)
    })
})

export function clearForm() {
    $(this)
        .find("input, textarea")
        .val('')
        .end()
    $(this).find(".message").addClass("d-none")
}

export function updateInfoOnPage() {
    $(".navbar_ul").empty()
    if (localStorage.getItem("token")) {
        loadProducts()
        loadServices()
        $(".navbar_ul").append(
            '<li class="nav-item active"><a class="nav-link" href="#" onclick="logOut()">Logout</a></li>'
        )
    }
    else {
        $("#productSpace").empty()
        $("#serviceSpace").empty()
        $(".navbar_ul").append(
            '<li class="nav-item active"><a class="nav-link" href="#" data-toggle="modal" data-target="#registerModal">Register</a></li>'
        )
        $(".navbar_ul").append(
            '<li class="nav-item active"><a class="nav-link" href="#" data-toggle="modal" data-target="#authModal">Login</a></li>'
        )
    }
}
