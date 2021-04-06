const URL_CONTACT_ENDPOINT = `https://fadi-api.herokuapp.com/api/init-contact`;
const SUCCESS_MESSAGE = `Yêu cầu của bạn đã được gửi đi, xin cảm ơn!`;
const ERROR_MESSAGE = `Có lỗi xảy ra, vui lòng thử lại sau`;
const IS_REQUIRED_INPUTS_MESSAGE = `Bạn cần nhập đầy đủ thông tin trước khi gửi!`;
const contact = {};
const price = "";
const url = window.location;
let form;
let phone;
let fullname;
let btnSubmitPrice;
let htmlBtnPrice;
let closePriceFormBtn;
let loadingFormPrice;
let formPriceContainer;
let inputPriceElemtGroup;
let formPriceElemtGroup;
let notification;
let notification_message;
(($) => {
    //set up notification
    notification = $('.notification-benzene');
    notification_message = $('.notification-benzene__message');

    //hide notification with timeout
    $.fn.hideNotification = (timeOut) => {
        notification.removeClass("slide-left").addClass('slide-right');
       setTimeout(()=> {
            notification.css('display', 'none');
       }, timeOut)
    }

    //show notification
    $.fn.showNotification = () => {
        notification.css('display', 'flex');
        notification.removeClass("slide-right").addClass('slide-left');
    }
    
    /**
     * Show then hide notification when submit
     * @param {boolean} isSucess Check respone is success?
     * @param {number} timeOut time to hide notification. unit: milisecond
     * @param {boolean} isEmptyInput check field is empty?
     */
    $.fn.changeStateOfNotification = (isSucess, timeOut, isEmptyInput) => {
        if(isSucess) {
            $().showNotification(true);
            notification_message.html(SUCCESS_MESSAGE);
            notification.removeClass('error').addClass('success');
            setTimeout(() => {
                $().hideNotification(timeOut);
            }, timeOut);
        } else {
            if(isEmptyInput) {
                $().showNotification(true);
                notification_message.html(IS_REQUIRED_INPUTS_MESSAGE);
                notification.removeClass('success').addClass('error');
                setTimeout(() => {
                    $().hideNotification(timeOut);
                }, timeOut);
            } else {
                $().showNotification(true);
                notification_message.html(ERROR_MESSAGE);
                notification.removeClass('success').addClass('error');
                setTimeout(() => {
                    $().hideNotification(timeOut);
                }, timeOut)
            }
        }
    }


    /**
     * Disable form when submit
     * @param {string} elementPrefixId As prefix id of form
     */
    $.fn.disableForm = (elementPrefixId) => {
        $(`#${elementPrefixId}-form :input`).prop("disabled", true);
        $(`#${elementPrefixId}-text-btn`).hide();
        $(`#${elementPrefixId}-loading`).show();
    }

     /**
     * Enable form when receive respone
     * @param {string} elementPrefixId As prefix id of form
     */
    $.fn.enableForm = (elementPrefixId) => {
        $(`#${elementPrefixId}-form :input`).prop("disabled", false);
        $(`#${elementPrefixId}-text-btn`).show();
        $(`#${elementPrefixId}-loading`).hide();
    }

     /**
     * get contact data
     * @param {string} elementPrefixId As prefix id of form
     */
    $.fn.getContact = (elementPrefixId) => {
        $(`#${elementPrefixId}-form :input`).prop("disabled", false);
        $(`#${elementPrefixId}-text-btn`).show();
        $(`#${elementPrefixId}-loading`).hide();
    }

    //reset form
    $.fn.resetForm = (elementPrefixId) => {
        $(`#${elementPrefixId}-form :input`).val('');
        $(`#${elementPrefixId}-text-btn`).text('Gửi yêu cầu');
    }


    //check  is valid form  
    $.fn.sendContactToServer = () => {
        return;
    }
})(jQuery)

jQuery(document).ready(($) => {
    $().disableFormWhenSubmit('footer');
    $().changeStateOfNotification(true, 1000, null);
})