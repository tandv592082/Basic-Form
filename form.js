const DEFAULT_TIMEOUT = 3000; // 4s
const DEFAULT_URL_CONTACT_API = `https://fxi-api.herokuapp.com/api/init-contact`;
const DEFAULT_ELEMENT_PREFIX_ID = `footer`;
const DEFAULT_SUCCESS_MESSAGE = `Yêu cầu của bạn đã được gửi đi, xin cảm ơn!`;
let ERROR_MESSAGE = `Có lỗi xảy ra, vui lòng thử lại sau`;
const contact = {};
var price = "";
const url = window.location;

(function($) {
    $.fn.Notification = (timeOut) => {
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
    
    $.fn.Form = (urlContactApi, elementPrefixId, timeOut) => {
        let _self = this;
        _self.elementPrefixId = elementPrefixId ? elementPrefixId : DEFAULT_ELEMENT_PREFIX_ID;
        _self.timeOut = timeOut ? timeOut : DEFAULT_TIMEOUT;
        _self.urlContactApi = urlContactApi ? urlContactApi : DEFAULT_URL_CONTACT_API;
        _self.form = $(`.${_self.elementPrefixId}-form`);
        let noti = $().Notification(_self.timeOut);
    
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
            $(`.${_self.elementPrefixId}-form :input`).prop("disabled", true);
            $(`#${_self.elementPrefixId}-text-btn`).hide();
            $(`#${_self.elementPrefixId}-loading`).show();
        }
    
        //enable form when recive respone
        _self.enableForm = function() {
            $(`.${_self.elementPrefixId}-form :input`).prop("disabled", false);
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
            $(`.${_self.elementPrefixId}-form :input`).val('');
            $(`#${_self.elementPrefixId}-text-btn`).text('Gửi yêu cầu');
        }
    
        //check every field input not empty 
        _self.isFormValid = function() {
            let isValid = true;
            $(`.${_self.elementPrefixId}-form :input[type="text"]`).each(function() {
                if ($(this).val().trim() === '') {
                    ERROR_MESSAGE = `Thông tịn không được để trống.`
                    isValid = false;
                return;
                }
            });
            if(!isValid) return isValid;
            $(`.${_self.elementPrefixId}-form :input[type="number"]`).each(function() {
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
            if(!subject.val()) {
                if(price === '') {
                    ERROR_MESSAGE = `Bạn chưa chọn bảng giá nào cả.`;
                    isValid = false;
                }
            }
    
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
                ERROR_MESSAGE = `NETWORK ERROR!`;
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
        });
    
        return _self;
    
    }
})(jQuery)

jQuery(document).ready(function($) {
    
    let footerForm = $().Form();
});
