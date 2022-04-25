
import {  getRequest, postWithAuthRequest, deleteRequest } from "./requests.mjs"
const mainURL = "https://midterm2.front.kreosoft.space/api"
const serviceURL = mainURL + "/Service/"
const allServicesURL = serviceURL + "getall"

export function loadServices() {
    getRequest(allServicesURL)
        .then((json) => {
            $("#serviceSpace").empty()

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

export function addNewService(id) {

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

window.deleteService = function deleteService(service) {
    let serviceNum = service.getAttribute("data-num")
    let data = { id: serviceNum }

    deleteRequest(serviceURL + serviceNum, data)
        .then(() => loadServices())
        .catch((error) => console.error(error))
}

window.editService = function editService(service) {
    let serviceNum = service.getAttribute("data-num")
    getRequest(allServicesURL)
        .then((data) => {
            let elem = data.filter((elem) => elem.id == serviceNum)[0]
            $("#editServiceBtn").data("num", serviceNum)
            $("#editServiceDescr").val(elem.description)
            $("#editServiceName").val(elem.name)
        })
        .catch((error) => { console.log(error) })
}

window.getServiceDetailsModal = function getServiceDetailsModal(prod) {
    let serviceNum = prod.getAttribute("data-num")
    getRequest(serviceURL + serviceNum)
        .then((data) => {
            $(".modalServiceName").text(data.name)
            $(".modalServiceDescription").text(data.description)
        })
}

export function saveEditedService() {
    let serviceNum = $("#editServiceBtn").data("num")
    let newData = {
        "id": parseInt(serviceNum),
        "name": $("#editServiceName").val(),
        "description": $("#editServiceDescr").val()
    }
    postWithAuthRequest(serviceURL, newData)
        .then(() => {
            loadServices()
            $('#editService').modal('hide')
        })
        .catch((error) => { console.log(error) })
}