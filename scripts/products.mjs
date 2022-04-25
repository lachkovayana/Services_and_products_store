import {  getRequest, postWithAuthRequest, deleteRequest } from "./requests.mjs"
import { loadComments } from "./comments.mjs"
const mainURL = "https://midterm2.front.kreosoft.space/api"
const productURL = mainURL + "/Product"
const allProductsURL = productURL+ "/getall"

export function addNewProduct() {
    
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
            $('#addProductModal').modal('hide')
            loadProducts()
        })
        .catch(error => console.error(error))
}

export function loadProducts() {

    getRequest(allProductsURL)
        .then((json) => {
            $("#productSpace").empty()
            let $product = $("#productCard")
            for (let card of json) {

                let $cardClone = $product.clone()
                $cardClone = $("#productCard").clone()
                $cardClone.removeClass("d-none")

                $cardClone.find(".productImg").attr("src", card.mainPhotoPath)
                $cardClone.find(".productName").text(card.name)
                $cardClone.find(".productDescription").val("")
                card.description.split('\n').forEach(element => {
                    $cardClone.find(".productDescription").append(element + "<br>")
                });
                // $cardClone.find(".productDescription").text(card.description)
                $cardClone.find(".btn-delete").attr("data-num", card.id)
                $cardClone.attr("id", "productCard-" + card.id)
                $cardClone.find(".editButton").attr("data-num", card.id)
                $cardClone.find(".btn-readmore").attr("data-num", card.id)
                $cardClone.find(".btn-readmore").find(".comment-counter").text(card.totalComments)

                $("#productSpace").append($cardClone)
            }
        })
}

export function saveEditedProduct() {
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
        .then(() => {
            loadProducts()
            $('#editProduct').modal('hide')
        })
        .catch((error) => { console.log(error) })

}

window.deleteProduct = function deleteProduct(prod) {
    let productNum = prod.getAttribute("data-num")
    let data = { id: productNum }
    deleteRequest(productURL + "/" + productNum, data)
        .then((data) => loadProducts())
        .catch((error) => console.error(error))
}

window.getEditedProductModal = function getEditedProductModal(prod) {
    let prodNum = prod.getAttribute("data-num")
    getRequest(productURL + "/" + prodNum)
        .then((data) => {
            $(".btn-prod-edit").data("num", prodNum)
            $("#editProductNameModal").val(data.name)
            $("#editProductWidthModal").val(data.width)
            $("#editProductHeightModal").val(data.height)
            $("#editProductWeightModal").val(data.weight)
            $("#editProductDescriptionModal").text("")
            // $("#editProductDescriptionModal").val(data.description)
            data.description.split('\n').forEach(element => {
                $("#editProductDescriptionModal").append(element +"\n")
            });
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
            $(".modalProductDescription").text("")
            data.description.split('\n').forEach(element => {
                $(".modalProductDescription").append(element + "<br>")
            });
            // $(".modalProductDescription").text(data.description)
            $(".modalProductWidth").text(data.width)
            $(".modalProductHeight").text(data.height)
            $(".modalProductWeight").text(data.weight)
            $("#phonesCarouselSpace").empty()
            $("#carouselOlSpace").empty()

            let $templatePhone = $(".phone-img-template")
            let $templateLi = $(".li-carousel-template")

            data.photoPaths.forEach(element => {
                let $phoneImg = $templatePhone.clone()
                let $li = $templateLi.clone()
                $phoneImg.removeClass("d-none")
                $li.removeClass("d-none")
                $phoneImg.find("img").attr("src", element)
                $("#phonesCarouselSpace").append($phoneImg)
                $("#carouselOlSpace").append($li)
            })

            $("#phonesCarouselSpace").find("div").first().addClass("active")
            $("#carouselOlSpace").find("li").first().addClass("active")
        })
        .catch((error) => console.log(error))
}