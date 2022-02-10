import { postRequest, postWithAuthRequest, getRequest, deleteRequest } from "./requests.mjs"
const mainURL = "https://midterm2.front.kreosoft.space/api"
const registerURL = mainURL + "/auth/register"
const authURL = mainURL + "/auth"
const serviceURL = mainURL + "/Service/"
const allServicesURL = serviceURL + "getall"
const productURL = mainURL + "/Product"
const addProdCommURL = productURL + "/addcomment"
const allProductsURL = productURL + "/getall"
const commentURL = mainURL + "/Comment"
const replyURL = commentURL + "/reply"

document.addEventListener("DOMContentLoaded", () => {
    updateInfoOnPage()

    $('#registerForm').submit(function (event) {
        event.preventDefault();
        if ($(this)[0].checkValidity() === false) {
            event.stopPropagation();
        } else {
            registerNewUser();
        }
    });

    $('#authForm').submit(function (event) {
        event.preventDefault();
        if ($(this)[0].checkValidity() === false) {
            event.stopPropagation();
        } else {
            let userInfo = {
                username: $('#authForm').find($("#loginUsername")).val(),
                password: $('#authForm').find($("#loginPassword")).val()
            }

            signIn(userInfo)

        }
    });

    $('#editServiceForm').submit(function (event) {
        event.preventDefault();
        if ($(this)[0].checkValidity() === false) {
            event.stopPropagation();
        } else {
            saveEditedService();
        }
    });

    $('#editProductForm').submit(function (event) {
        event.preventDefault();
        if ($(this)[0].checkValidity() === false) {
            event.stopPropagation();
        } else {
            saveEditedProduct();
        }
    });

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
            .end();
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



function clearForm() {
    $(this)
        .find("input, textarea")
        .val('')
        .end()
}

function signIn(userInfo) {
    postRequest(authURL, userInfo)
        .then((response) => response.json())
        .then(data => {
            let msg = $(this).find('.message')
            if (data.accessToken) {
                localStorage.setItem("token", data.accessToken);
                updateInfoOnPage()
                $('#authModal').modal('hide')

                if (!(msg.hasClass("d-none")))
                    msg.addClass("d-none")
                clearForm.call(this)
            }
            else {
                msg.removeClass("d-none")
                msg.text(data.message)
            }
        })
        .catch(error => console.error(error))
}

function updateInfoOnPage() {
    $(".navbar_ul").empty();
    if (localStorage.getItem("token")) {
        loadProducts()
        loadServices()
        $(".navbar_ul").append(
            '<li class="nav-item active"><a class="nav-link" href="#" onclick="logOut()">Logout</a></li>'
        )
    }
    else {
        $("#productSpace").empty();
        $("#serviceSpace").empty();
        $(".navbar_ul").append(
            '<li class="nav-item active"><a class="nav-link" href="#" data-toggle="modal" data-target="#registerModal">Register</a></li>'
        )
        $(".navbar_ul").append(
            '<li class="nav-item active"><a class="nav-link" href="#" data-toggle="modal" data-target="#authModal">Login</a></li>'
        )
    }
}

function registerNewUser() {
    let user = {
        "username": ($("#registerUsername").val()).toString(),
        "password": ($("#registerPassword").val()).toString(),
        "photoPath": ($("#registerAvatar").val()).toString()
    }

    postRequest(registerURL, user)
        .then(response => {
            let msg = $(this).find('.message')
            if (response.status == 200) {
                signIn(user)
                $('#registerModal').modal('hide')
                if (!msg.hasClass("d-none"))
                    msg.addClass("d-none")
            }
            else {
                msg.removeClass("d-none")
            }
        })
        .catch(error => console.error(error))
}


function loadServices() {
    getRequest(allServicesURL)
        .then((json) => {
            $("#serviceSpace").empty();

            let $service = $("#serviceCard")

            for (var cards of json) {
                let $card = $service.clone()
                $card.removeClass("d-none")

                $card.find(".serviceName").text(cards.name)
                $card.find(".serviceDescription").text(cards.description)
                $card.attr("id", "serviceCard-" + cards.id)
                $card.find(".btn-serv-edit").attr("data-num", cards.id)
                $card.find(".btn-serv-del").attr("data-num", cards.id)
                $card.find(".servDet").attr("data-num", cards.id)

                $("#serviceSpace").append($card)
            }
        })
}

function loadProducts() {

    getRequest(allProductsURL)
        .then((json) => {
            console.log(json);
            $("#productSpace").empty();

            let $product = $("#productCard")

            for (var card of json) {

                let $cardClone = $product.clone()
                $cardClone = $("#productCard").clone()
                $cardClone.removeClass("d-none")

                $cardClone.find(".productImg").attr("src", card.mainPhotoPath)
                $cardClone.find(".productName").text(card.name)
                $cardClone.find(".productDescription").text(card.description)
                $cardClone.find(".btn-delete").attr("data-num", card.id)
                $cardClone.attr("id", "productCard-" + card.id)
                $cardClone.find(".editButton").attr("data-num", card.id)
                $cardClone.find(".btn-readmore").attr("data-num", card.id)
                $cardClone.find(".btn-readmore").find(".comment-counter").text(card.totalComments)

                $("#productSpace").append($cardClone)
            }
        })
}

function addNewProduct() {
    let product = {
        id: null,
        name: $("#productNameModal").val(),
        description: $("#productDescriptionModal").val(),
        width: $("#productWidthModal").val(),
        height: $("#productHeightModal").val(),
        weight: parseInt($("#productWeightModal").val()),
        photoPaths: [
            $("#productPhotoPathModal").val()
        ]
    }

    postWithAuthRequest(mainURL + "/Product", product)
        .then(() => {
            loadProducts()
            $('#addProduct').modal('hide')
        })
        .catch(error => console.error(error))
}

function addNewService(id) {

    let service = {
        id: null,
        name: $("#serviceNameModal").val(),
        description: $("#serviceDescriptionModal").val()
    }
    postWithAuthRequest(mainURL + "/Service", service)
        .then(() => {
            loadServices()
        })
        .catch(error => console.error(error))

}
function addNewComment() {
    let prodNum = $("#sendComment").data("num");
    let commentId = $("#sendComment").data("commentId");
    let isReply = $("#sendComment").data("isReply");
    let data, url;

    if (isReply) {
        data = {
            "parentCommentId": parseInt(commentId),
            "message": $("#newCommentText").val()
        }
        url = replyURL;
    }
    else {
        data = {
            "productId": parseInt(prodNum),
            "message": $("#newCommentText").val()
        }
        url = addProdCommURL;
    }
    postWithAuthRequest(url, data)
        .then(() => {
            loadComments(prodNum)
            $("#newCommentText").val("")
        })
        .catch(error => console.error(error))

}

window.replyComment = function replyComment(btn) {
    let commentId = btn.getAttribute("data-id");
    let username = btn.getAttribute("data-name");
    $("#sendComment").data("commentId", commentId)
    $("#sendComment").data("isReply", true)
    $("#newCommentText").text(username + ", ");
}

window.logOut = function logOut() {
    localStorage.removeItem("token");
    updateInfoOnPage();
}

window.deleteProduct = function deleteProduct(prod) {
    let productNum = prod.getAttribute("data-num")
    let data = { id: productNum }
    deleteRequest(productURL + "/" + productNum, data)
        .then((data) => loadProducts())
        .catch((error) => console.error(error));
}

window.deleteService = function deleteService(service) {
    let serviceNum = service.getAttribute("data-num")
    let data = { id: serviceNum }

    deleteRequest(serviceURL + serviceNum, data)
        .then(() => loadServices())
        .catch((error) => console.error(error));
}

window.editService = function editService(service) {
    let serviceNum = service.getAttribute("data-num")
    getRequest(allServicesURL)
        .then((data) => {
            let elem = data.filter((elem) => elem.id == serviceNum)[0];
            $("#editServiceBtn").data("num", serviceNum)
            $("#editServiceDescr").val(elem.description)
            $("#editServiceName").val(elem.name)
        })
        .catch((error) => { console.log(error) })
}

window.getEditProdModal = function getEditProdModal(prod) {
    let prodNum = prod.getAttribute("data-num")
    getRequest(productURL + "/" + prodNum)
        .then((data) => {
            $(".btn-prod-edit").data("num", prodNum)
            $("#editProductNameModal").val(data.name)
            $("#editProductWidthModal").val(data.width)
            $("#editProductHeightModal").val(data.height)
            $("#editProductWeightModal").val(data.weight)
            $("#editProductDescriptionModal").val(data.description)
            $("#editProductPhotoPathModal").val(data.photoPaths.map((el) => el).join(","))
        })

}

window.getReadmoreModal = function getReadmoreModal(prod) {
    let prodNum = prod.getAttribute("data-num")
    $("#sendComment").data("num", prodNum)
    $("#sendComment").data("isReply", false)

    loadComments(prodNum)

    getRequest(productURL + "/" + prodNum)
        .then((data) => {
            $(".modalProductName").text(data.name)
            $(".modalProductDesciption").text(data.description)
            $(".modalProductWidth").text(data.width)
            $(".modalProductHeight").text(data.height)
            $(".modalProductWeight").text(data.weight)
            $("#phonesCarouselSpace").empty()
            $("#carouselOlSpace").empty()

            let $templatePhone = $(".phone-img-template")
            let $templateLi = $(".li-carousel-template")

            data.photoPaths.forEach(element => {
                let $phoneImg = $templatePhone.clone();
                let $li = $templateLi.clone();
                $phoneImg.removeClass("d-none")
                $li.removeClass("d-none")
                $phoneImg.find("img").attr("src", element)
                $("#phonesCarouselSpace").append($phoneImg)
                $("#carouselOlSpace").append($li)
            });

            $("#phonesCarouselSpace").find("div").first().addClass("active")
            $("#carouselOlSpace").find("li").first().addClass("active")
        })
        .catch((error) => console.log(error))
}

function loadComments(prodNum) {

    getRequest(productURL + "/" + prodNum + "/getcomments")
        .then((data) => {
            console.log(data);

            $("#productCommentsSpace").empty()

            let $templateComment = $(".comment-template")
            data.forEach((element) => {
                let $comment = $templateComment.clone();
                $comment.removeClass("d-none")
                $comment.find(".avatarPhoto").attr("src", element.userPhotoPath)
                $comment.find(".commentText").text(element.message)
                $comment.find(".commentName").text(element.username)
                $comment.find(".commentReply").attr("data-id", element.id)
                $comment.find(".commentReply").attr("data-name", element.username)

                element.replies.map((oneReply) => {
                    console.log(oneReply);
                    let $reply = $templateComment.clone();
                    $reply.removeClass("d-none")
                    $reply.addClass("ml-5")
                    $reply.find(".avatarPhoto").attr("src", oneReply.userPhotoPath)
                    $reply.find(".commentText").text(oneReply.message)
                    $reply.find(".commentName").text(oneReply.username)
                    $reply.find(".commentReply").addClass("d-none")
                    $comment.append($reply)
                })

                $("#productCommentsSpace").append($comment)
            })

        })
        .catch((error) => console.log(error))
}

window.getServiceDetailsModal = function getServiceDetailsModal(prod) {
    let serviceNum = prod.getAttribute("data-num")
    getRequest(serviceURL + serviceNum)
        .then((data) => {
            $(".modalServiceName").text(data.name)
            $(".modalServiceDescription").text(data.description)
        })
}

function saveEditedService() {
    let serviceNum = $("#editServiceBtn").data("num")
    let newData = {
        "id": parseInt(serviceNum),
        "name": $("#editServiceName").val(),
        "description": $("#editServiceDescr").val()
    }
    postWithAuthRequest(serviceURL, newData)
        .then(() => { loadServices(); $('#editService').modal('hide') })
        .catch((error) => { console.log(error) })
}

function saveEditedProduct() {
    let productNum = $(".btn-prod-edit").data("num")
    let newData = {
        "id": parseInt(productNum),
        "name": $("#editProductNameModal").val(),
        "description": $("#editProductDescriptionModal").val(),
        "width": $("#editProductWidthModal").val(),
        "height": $("#editProductHeightModal").val(),
        "weight": parseInt($("#editProductWeightModal").val()),
        "photoPaths":
            $("#editProductPhotoPathModal").val().split(/[\s,]+/)

    }
    postWithAuthRequest(productURL, newData)
        .then(() => { loadProducts(); $('#editProduct').modal('hide') })
        .catch((error) => { console.log(error) })

}

