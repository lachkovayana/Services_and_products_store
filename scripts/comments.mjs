import { postWithAuthRequest, getRequest } from "./requests.mjs"
const mainURL = "https://midterm2.front.kreosoft.space/api"
const productURL = mainURL + "/Product"
const addProdCommURL = productURL + "/addcomment"
const commentURL = mainURL + "/Comment"
const replyURL = commentURL + "/reply"

export function addNewComment() {
    let prodNum = $("#sendComment").data("num")
    let commentId = $("#sendComment").data("commentId")
    let isReply = $("#sendComment").data("isReply")
    let data, url

    if (isReply) {
        data = {
            "parentCommentId": parseInt(commentId),
            "message": $("#newCommentText").val()
        }
        url = replyURL
    }
    else {
        data = {
            "productId": parseInt(prodNum),
            "message": $("#newCommentText").val()
        }
        url = addProdCommURL
    }
    postWithAuthRequest(url, data)
        .then(() => {
            loadComments(prodNum)
            $("#newCommentText").val("")
        })
        .catch(error => console.error(error))

}

export function loadComments(prodNum) {

    getRequest(productURL + "/" + prodNum + "/getcomments")
        .then((data) => {
            console.log(data)

            $("#productCommentsSpace").empty()

            let $templateComment = $(".comment-template")
            data.forEach((element) => {
                let $comment = $templateComment.clone()
                $comment.removeClass("d-none")
                $comment.find(".avatarPhoto").attr("src", element.userPhotoPath)
                $comment.find(".commentText").text(element.message)
                $comment.find(".commentName").text(element.username)
                $comment.find(".commentReply").attr("data-id", element.id)
                $comment.find(".commentReply").attr("data-name", element.username)

                element.replies.map((oneReply) => {
                    console.log(oneReply)
                    let $reply = $templateComment.clone()
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

window.replyComment = function replyComment(btn) {
    let commentId = btn.getAttribute("data-id")
    let username = btn.getAttribute("data-name")
    $("#sendComment").data("commentId", commentId)
    $("#sendComment").data("isReply", true)
    $("#newCommentText").text(username + ", ")
}