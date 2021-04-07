const DEFAULT_TIMEOUT = 5000; // 4s
const DEFAULT_URL_CONTACT_API = `https://fadi-api.herokuapp.com/api/init-contact`;
const DEFAULT_ELEMENT_PREFIX_ID = `footer`;
const DEFAULT_SUCCESS_MESSAGE = `Yêu cầu của bạn đã được gửi đi, xin cảm ơn!`;
let ERROR_MESSAGE = `Có lỗi xảy ra, vui lòng thử lại sau`;
const contact = {};
let price = "";
const url = window.location;

function Notification(timeOut) {
    this.timeOut = timeOut;
    this.notification = $('.notification-benzene');
    this.notification_message = $('.notification-benzene__message');

    this.show = function() {
        this.notification.css('display', 'flex');
        this.notification.removeClass("slide-right").addClass('slide-left');
    }

    this.hide = function() {
        setTimeout(()=> {
             this.notification.removeClass("slide-left").addClass('slide-right');
            setTimeout(()=> {
                this.notification.css('display', 'none');
            }, 400);
        }, this.timeOut);
    }

    this.setSuccess = function() {
        this.notification_message.html(DEFAULT_SUCCESS_MESSAGE);
        this.notification.removeClass('error').addClass('success');
    }

    this.setError = function() {
        this.notification_message.html(ERROR_MESSAGE);
        this.notification.removeClass('success').addClass('error');
    }

    this.showMessageWithSuccess = function() {
        this.setSuccess();
        this.show();
        this.hide();
    }

    this.showMessageWithError = function() {
        this.setError();
        this.show();
        this.hide();
    }
    return this;
}


function Form(urlContactApi, elementPrefixId, timeOut) {
    let _self = this;

    _self.elementPrefixId = elementPrefixId ? elementPrefixId : DEFAULT_ELEMENT_PREFIX_ID;
    _self.timeOut = timeOut ? timeOut : DEFAULT_TIMEOUT;
    _self.urlContactApi = urlContactApi ? urlContactApi : DEFAULT_URL_CONTACT_API;
    _self.form = $(`#${_self.elementPrefixId}-form`);
    let noti = new Notification(_self.timeOut);
    /**
     * Show then hide notification when submit
     * @param {boolean} isSucess Check respone is success?
     */
     _self.toggleNotificationState = function(isSucess) {
        if(isSucess) {
            noti.showMessageWithSuccess();
        } else {
            noti.showMessageWithError();
        }
    }

    /**
     * Disable form when submit
     * @param {string} elementPrefixId As prefix id of form
     */
     _self.disableForm = function() {
        $(`#${_self.elementPrefixId}-form :input`).prop("disabled", true);
        $(`#${_self.elementPrefixId}-text-btn`).hide();
        $(`#${_self.elementPrefixId}-loading`).show();
    }

    //enable form when recive respone
    _self.enableForm = function() {
        $(`#${_self.elementPrefixId}-form :input`).prop("disabled", false);
        $(`#${_self.elementPrefixId}-text-btn`).show();
        $(`#${_self.elementPrefixId}-loading`).hide();
    }

    //get contact data
    _self.getContactData = function() {
        if($(`#${_self.elementPrefixId}-subject`).val()) {
            contact.text = $(`#${_self.elementPrefixId}-subject`).val();
        } else {
            contact.text = price;
        }
        contact.url = url;
        contact.phone = $(`#${_self.elementPrefixId}-phone`).val();
        contact.fullname =  $(`#${_self.elementPrefixId}-fullname`).val();
        return contact;
    }

    //reset form
    _self.resetForm = function() {
        $(`#${_self.elementPrefixId}-form :input`).val('');
        $(`#${_self.elementPrefixId}-text-btn`).text('Gửi yêu cầu');
    }

    //check every field input not empty 
    _self.isFormValid = function() {
        let isValid = true;
        $(`#${_self.elementPrefixId}-form :input[type="text"]`).each(function() {
            if ($(this).val().trim() === '') {
                ERROR_MESSAGE = `Thông tịn không được để trống.`
                isValid = false;
            return;
            }
        });
        if(!isValid) return isValid;
        $(`#${_self.elementPrefixId}-form :input[type="number"]`).each(function() {
            if (!$.isNumeric($(this).val().trim())) {
                ERROR_MESSAGE = `Nhập sai định dạng số`
                isValid = false;
            return;
            }
        });
        if(!isValid) return isValid;
        let phone = $(`#${_self.elementPrefixId}-phone`);
        if(phone.val().trim().length <= 7) {
            ERROR_MESSAGE = `Nhập sai định dạng số điện thoại.`;
            isValid = false;
        }

        let subject = $(`#${_self.elementPrefixId}-subject`);
        // if(!subject.val()) {
        //     if(price === '') {
        //  handle error here
        //}
        // }

        return isValid;
    }

    //send request to server
    _self.sendRequestToServer = function() {
        _self.disableForm();
        fetch(_self.urlContactApi, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_self.getContactData())
        }).then(function(data) {
            return data.json();
        }).then(function(result) {
            if(result.success) {
                setTimeout(function () {
                    _self.resetForm();
                }, 300);        
                _self.toggleNotificationState(true);
            } else {
                _self.toggleNotificationState(false);
            }
        }).catch(function(err) {
            _self.toggleNotificationState(false);
        }).finally(function() {
            _self.enableForm();
        })
    }

    _self.form.submit(function(e) {
        e.preventDefault(e);
        if(_self.isFormValid()) {
            _self.sendRequestToServer();
        } else {
            _self.toggleNotificationState(false);
        }
    })

    return _self;

}

// (($) => {
//     //hide notification with timeout
//     $.fn.hideNotification = (timeOut) => {
//         notification.removeClass("slide-left").addClass('slide-right');
//        setTimeout(()=> {
//             notification.css('display', 'none');
//        }, timeOut)
//     }

//     //show notification
//     $.fn.showNotification = () => {
//         notification.css('display', 'flex');
//         notification.removeClass("slide-right").addClass('slide-left');
//     }
    
//     $.fn.Form = function(urlContactApi, elementPrefixId, successTimeOut, errorimeOut) {
//         this.elementPrefixId = elementPrefixId ? elementPrefixId : DEFAULT_ELEMENT_PREFIX_ID;
//         this.successTimeOut = successTimeOut ? successTimeOut : DEFAULT_SUCCESS_TIMEOUT;
//         this.urlContactApi = urlContactApi ? urlContactApi : DEFAULT_ERROR_TIMEOUT;
//         /**
//          * Show then hide notification when submit
//          * @param {boolean} isSucess Check respone is success?
//          */
//         this.toggleNotificationState = function(isSucess) {
//             if(isSucess) {
//                 $().showNotification();
//                 notification_message.html(DEFAULT_SUCCESS_MESSAGE);
//                 notification.removeClass('error').addClass('success');
//                 $().hideNotification(this.successTimeOut);
//             } else {
//                 $().showNotification();
//                 notification_message.html(ERROR_MESSAGE);
//                 notification.removeClass('success').addClass('error');
//                 $().hideNotification(this.errorimeOut);
//             }
//         }

//         /**
//          * Disable form when submit
//          * @param {string} elementPrefixId As prefix id of form
//          */
//         this.disableForm = function() {
//             $(`#${this.elementPrefixId}-form :input`).prop("disabled", true);
//             $(`#${this.elementPrefixId}-text-btn`).hide();
//             $(`#${this.elementPrefixId}-loading`).show();
//         }

//         //enable form when recive respone
//         this.enableForm = function() {
//             $(`#${this.elementPrefixId}-form :input`).prop("disabled", false);
//             $(`#${this.elementPrefixId}-text-btn`).show();
//             $(`#${this.elementPrefixId}-loading`).hide();
//         }

//         //get contact data
//         this.getContactData = function() {
//             if($(`#${this.elementPrefixId}-subject`).val()) {
//                 contact.text = $(`#${this.elementPrefixId}-subject`).val();
//             } else {
//                 contact.text = price;
//             }
//             contact.url = url;
//             contact.phone = $(`#${this.elementPrefixId}-phone`).val();
//             contact.fullname =  $(`#${this.elementPrefixId}-fullname`).val();
//             return contact;
//         }

//         //reset form
//         this.resetForm = function() {
//             $(`#${this.elementPrefixId}-form :input`).val('');
//             $(`#${this.elementPrefixId}-text-btn`).text('Gửi yêu cầu');
//         }

//         //check every field input not empty 
//         this.isFormValid = function() {
//             let isValid = true;
//             $(`#${this.elementPrefixId}-form :input[type="text"]`).each(function() {
//                 if ($(this).val().trim() === '') {
//                     ERROR_MESSAGE = `Thông tịn không được để trống.`
//                     isValid = false;
//                 return;
//                 }
//             });
//             console.log(`Check form is valid1 -> ${isValid}`)
//             if(!isValid) return isValid;
//             $(`#${this.elementPrefixId}-form :input[type="number"]`).each(function() {
//                 if (!$.isNumeric($(this).val().trim())) {
//                     ERROR_MESSAGE = `Nhập sai định dạng số`
//                     isValid = false;
//                 return;
//                 }
//             });
//             console.log(`Check form is valid2 -> ${isValid}`)
//             if(!isValid) return isValid;
//             let phone = $(`#${this.elementPrefixId}-phone`);
//             if(phone.val().trim().length <= 7) {
//                 ERROR_MESSAGE = `Nhập sai định dạng số điện thoại.`;
//                 isValid = false;
//             }
//             console.log(`Check form is valid3 -> ${isValid}`)
//             // let subject = $(`#${this.elementPrefixId}-subject`);
//             // if(!subject.val()) {
//             //     if(price === '') let bla = '';
//             // }
//             console.log(`Check form is valid4 -> ${valid}`)
//             return isValid;
//         }

//         //send request to server
//         this.sendRequestToServer = function() {
//             this.disableForm();
//             fetch(this.urlContactApi, {
//                 method: POST,
//                 headers: {
//                     'Accept': 'application/json, text/plain, */*',
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(this.getContactData())
//             }).then(function(data) {
//                 return data.json();
//             }).then(function(result) {
//                 if(result.success) {
//                     setTimeout(function () {
//                         this.resetForm();
//                     }, 300);        
//                     this.toggleNotificationState(true);
//                 } else {
//                     this.toggleNotificationState(false);
//                 }
//             }).catch(function(err) {
//                 this.toggleNotificationState(false);
//             }).finally(function() {
//                 this.enableForm();
//             })
//         }

//         this.initForm = function() {
//             $(`#${this.elementPrefixId}-form`).submit(function(e) {
//                 e.preventDefault(e);
//                 if(this.isFormValid) {
//                     this.sendRequestToServer();
//                 } else {
//                     this.toggleNotificationState(false);
//                 }
//             })
//         }

//         // this.testMethod = function(status) {
//         //     this.test = status;

//         //     //lets call a method of a class
//         //     this.anotherMethod();
//         // };

//         // this.anotherMethod = function() {
//         //     alert("anotherMethod is called by object " + initvar);
//         // };

//         // this.getVars = function() {
//         //     alert("Class var set in testMethod: I am object " + this.test + "\nClass var set in constractor: " + this.class_var);
//         // };

//         // //lets init some variables here, consider it as a class constractor
//         // this.class_var = initvar;

//         //THIS IS VERY IMPORTANT TO KEEP AT THE END
//         return this;
//     };

    /**
     * Show then hide notification when submit
     * @param {boolean} isSucess Check respone is success?
     * @param {number} timeOut time to hide notification. unit: milisecond
     */
    // $.fn.changeStateOfNotification = (isSucess, timeOut) => {
    //     if(isSucess) {
    //         $().showNotification(true);
    //         notification_message.html(SUCCESS_MESSAGE);
    //         notification.removeClass('error').addClass('success');
    //         setTimeout(() => {
    //             $().hideNotification(timeOut);
    //         }, timeOut);
    //     } else {
    //         $().showNotification(true);
    //         notification_message.html(ERROR_MESSAGE);
    //         notification.removeClass('success').addClass('error');
    //         setTimeout(() => {
    //             $().hideNotification(timeOut);
    //         }, timeOut)
    //     }
    // }



    // /**
    //  * Disable form when submit
    //  * @param {string} elementPrefixId As prefix id of form
    //  */
    // $.fn.disableForm = (elementPrefixId) => {
    //     $(`#${elementPrefixId}-form :input`).prop("disabled", true);
    //     $(`#${elementPrefixId}-text-btn`).hide();
    //     $(`#${elementPrefixId}-loading`).show();
    // }

    //  /**
    //  * Enable form when receive respone
    //  * @param {string} elementPrefixId As prefix id of form
    //  */
    // $.fn.enableForm = (elementPrefixId) => {
    //     $(`#${elementPrefixId}-form :input`).prop("disabled", false);
    //     $(`#${elementPrefixId}-text-btn`).show();
    //     $(`#${elementPrefixId}-loading`).hide();
    // }

    //  /**
    //  * get contact data
    //  * @param {string} elementPrefixId As prefix id of form
    //  */
    // $.fn.getContact = (elementPrefixId) => {
    //     $(`#${elementPrefixId}-form :input`).prop("disabled", false);
    //     $(`#${elementPrefixId}-text-btn`).show();
    //     $(`#${elementPrefixId}-loading`).hide();
    // }

    // //reset form
    // $.fn.resetForm = (elementPrefixId) => {
    //     $(`#${elementPrefixId}-form :input`).val('');
    //     $(`#${elementPrefixId}-text-btn`).text('Gửi yêu cầu');
    // }

    // //reset form
    // $.fn.resetForm = (elementPrefixId) => {
    //     $(`#${elementPrefixId}-form :input`).val('');
    //     $(`#${elementPrefixId}-text-btn`).text('Gửi yêu cầu');
    // }

    // //get contact data
    // $.fn.getContactData = (elementPrefixId, isPriceForm) => {
    //     if(isPriceForm) {
    //         contact.text = price;
    //     } else {
    //         contact.text = $(`#${elementPrefixId}-subject`).val('');
    //     }
    //     contact.url = url;
    //     contact.phone = $(`#${elementPrefixId}-phone`).val('');
    //     contact.fullname =  $(`#${elementPrefixId}-fullname`).val('');
    //     return contact;
    // }

    // //check every field input not empty 
    // $.fn.isFormValid = (elementPrefixId) => {
    //     let isValid = true;
    //     $(`#${elementPrefixId}-form :input[type="text"]`).each(function() {
    //         if ($(this).val().trim() === '') {
    //             ERROR_MESSAGE = `Thông tịn không được để trống.`
    //             isValid = false;
    //            return;
    //         }
    //      });
    //     if(!isValid) return isValid;
    //     $(`#${elementPrefixId}-form :input[type="number"]`).each(function() {
    //         if (!$.isNumeric($(this).val().trim())) {
    //             ERROR_MESSAGE = `Nhập sai định dạng số`
    //             isValid = false;
    //            return;
    //         }
    //      });
    //     if(!isValid) return isValid;
    //     let phone = $(`#${elementPrefixId}-phone`)
    //     if(phone.val().trim().length <= 7) {
    //         ERROR_MESSAGE = `Nhập sai định dạng số điện thoại.`
    //         isValid = false;
    //     }
    //     return isValid;
    // }
    // $.fn.sendRequestToServer = (elementPrefixId) => {
    //     $(`#${elementPrefixId}-form :input`)
    // }
// })(jQuery)

jQuery(document).ready(($) => {
    let form = new Form();
})