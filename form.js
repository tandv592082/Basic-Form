const URL_CONTACT_ENDPOINT = `https://fadi-api.herokuapp.com/api/init-contact`;
const SUCCESS_MESSAGE = `Yêu cầu của bạn đã được gửi đi, xin cảm ơn!`;
let ERROR_MESSAGE = `Có lỗi xảy ra, vui lòng thử lại sau`;
const contact = {};
const price = "";
const url = window.location;
// let form;
// let phone;
// let fullname;
// let btnSubmitPrice;
// let htmlBtnPrice;
// let closePriceFormBtn;
// let loadingFormPrice;
// let formPriceContainer;
// let inputPriceElemtGroup;
// let formPriceElemtGroup;
let notification;
let notification_message;
(($) => {

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
            $().showNotification(true);
            notification_message.html(ERROR_MESSAGE);
            notification.removeClass('success').addClass('error');
            setTimeout(() => {
                $().hideNotification(timeOut);
            }, timeOut)
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

    //reset form
    $.fn.resetForm = (elementPrefixId) => {
        $(`#${elementPrefixId}-form :input`).val('');
        $(`#${elementPrefixId}-text-btn`).text('Gửi yêu cầu');
    }

    //get contact data
    $.fn.getContactData = (elementPrefixId, isPriceForm) => {
        if(isPriceForm) {
            contact.text = price;
        } else {
            contact.text = $(`#${elementPrefixId}-subject`).val('');
        }
        contact.url = url;
        contact.phone = $(`#${elementPrefixId}-phone`).val('');
        contact.fullname =  $(`#${elementPrefixId}-fullname`).val('');
        return contact;
    }

    //check every field input not empty 
    $.fn.isFormValid = (elementPrefixId) => {
        let isValid = true;
        $(`#${elementPrefixId}-form :input[type="text"]`).each(function() {
            if ($(this).val().trim() === '') {
                ERROR_MESSAGE = `Thông tịn không được để trống.`
                isValid = false;
               return;
            }
         });
        if(!isValid) return isValid;
        $(`#${elementPrefixId}-form :input[type="number"]`).each(function() {
            if (!$.isNumeric($(this).val().trim())) {
                ERROR_MESSAGE = `Nhập sai định dạng số`
                isValid = false;
               return;
            }
         });
        if(!isValid) return isValid;
        let phone = $(`#${elementPrefixId}-phone`)
        if(phone.val().trim().length <= 7) {
            ERROR_MESSAGE = `Nhập sai định dạng số điện thoại.`
            isValid = false;
        }
        return isValid;
    }
    $.fn.sendRequestToServer = () => {
        return;
    }
})(jQuery)

jQuery(document).ready(($) => {
    notification = $('.notification-benzene');
    notification_message = $('.notification-benzene__message');
    // $().disableForm('footer');
    $().changeStateOfNotification(true, 100000, null);
    $('#footer-btn-submit').click(()=>{
        if($().isFormValid('footer')) console.log('ok')
        else console.log(ERROR_MESSAGE);
    })
})