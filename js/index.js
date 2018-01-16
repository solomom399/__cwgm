var myObj = function () {
    this.base_url = 'http://localhost/__em_server/'

    this.show = function (status, url, callback) {
        if (status.status === 'done') {
            callback()
        } else if (status.status === 'expired') {
            swal({
                title: "",
                text: '<small>'+status.text+' <a href="'+this.base_url+url+'">Click to Login</a></small>',
                html: true,
                type: 'warning',
                confirmButtonClass : 'btn btn-danger'
            })
        } else if (status.status === 'error') {
            swal({
                title: "",
                text: '<small>'+status.text+'</small>',
                html: true,
                type: 'warning',
                confirmButtonClass : 'btn btn-danger'
            })
        } else if (status.status === 'warn') {
            swal({
                title: "",
                text: '<small>'+status.text+'</small>',
                html: true,
                type: 'warning',
                confirmButtonClass : 'btn btn-warning'
            })
        }
    }


    this.makeUse = function (pathfile, formData, callback) {
        $.ajax({
            context: this,
            url: this.base_url+pathfile,
            type: "POST",
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            dataType: "JSON",
            success: function(r) {
                this.show(r, '', function () {
                    callback(r)
                })
            },
            error: function(a, b, c){
                console.log(a)
                swal({
                    title: "",
                    text: '<p>Unable to complete...Try again!</p>',
                    html: true,
                    type: 'error',
                    confirmButtonClass : 'btn btn-danger'
                })
            }
        })
    }


    this.load = function (text = null) {
        swal({
            title : '',
            text : text,
            imageUrl: '../img/load.gif',
            html: true,
            showConfirmButton : false
        })
    }


    this.find = function (element) {
        return $('body').find(element)
    }


    this.readURL = function (input, callback = null, width = '200px', height = '200px') {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#previewHolder').css({
                    'width': width,
                    'height': height
                }).attr('src', e.target.result);
                callback(e)
            }

            reader.readAsDataURL(input.files[0]);
        }
    }


    this.validate = function (element, callfunction, r = false) {
        element.validate({

            highlight: function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function(element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorElement: 'span',
            errorClass: 'help-block',
            errorPlacement: function(error, element) {
                if(element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                } else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function (form) {
                callfunction(form)
                //return r
            }
        })
    }


    this.end = function () {
        navigator.app.exitApp();
    }


    this.onBackKeyDown = function (e) {
        e.preventDefault();
        navigator.notification.confirm(
            'Close App!',
            this.end,            
            '',           
            ['Yes','No']     
        );
    }

}



var mo = new myObj()


mo.onBackKeyDown()


mo.find(".hundred").css({
    'height': $(window).height()-140
})


mo.find(".fire-kshow").on('click', function () {
    mo.find(".kshow").toggle()
})


mo.find('.pages').on('click', '.go-back', function () {

    var page = localStorage.getItem('last_page')
    var page_name = page.toUpperCase()
    mo.find(".pages").load(page+'.html', function () {
        swal.close()

        mo.find(".page_name").html(page_name)
    })
})


mo.find('.pages').on('click', '.load-page-nth', function () {

    var page = $(this).attr('page')
    var page_name = page.toUpperCase()
    mo.find(".pages").load(page+'.html', function () {
        swal.close()

        mo.find(".page_name").html(page_name)
    })
})



function pay () {
    mo.validate(mo.find("#payment-form"), function (form) {
        mo.load("Processing..")

        var email = $("input[name=email]").val()
        var fullname = $("input[name=fullname]").val()
        var amount = $("input[name=amount]").val()
        var type = $("input[name=type]").val()
        var phone = $("input[name=phone]").val()

        var handler = PaystackPop.setup({
            key: 'pk_test_627b3212869ed34b3c5dee07082de6ece430cd6a',
            email: email,
            amount: amount+'00',
        ref: 'CWGM_'+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        metadata: {
            custom_fields: [
            {
                display_name: "Fullname",
                variable_name: 'name',
                value: fullname
            },
            {
                display_name: "Phone Number",
                variable_name: 'phone',
                value: phone
            },
            {
                display_name: "Payment Type",
                variable_name: 'type',
                value: type
            }
            ]
        },
        callback: function(response){
            swal({
                title: "",
                text: '<br><br><p>Done!</p>',
                html: true,
                type: 'success',
                confirmButtonClass : 'btn btn-success'
            }, function () {
                mo.find("#payment-form").trigger('reset')
            })
            /*var formData = new FormData(form)

            mo.makeUse('api/hangout.html', formData, function (resp) {

                swal({
                    title: "<p>Thanks!</p>",
                    text: '<p>A reprsentative will get <br> back to you shortly.</p>',
                    html: true,
                    type: 'success',
                    confirmButtonClass : 'btn btn-success'
                }, function () {
                    $(form).trigger('reset')
                })


            })*/

        },
        onClose: function(){
            swal({
                title: "",
                text: 'You cancelled the payment',
                html: true,
                type: 'warning',
                confirmButtonClass : 'btn btn-warning'
            })
        }
    });
        handler.openIframe();
    })    
}



mo.find('.load-page').on('click', function () {

    var page = $(this).attr('page')
    var page_name = page.toUpperCase()
    mo.find(".pages").load(page+'.html', function () {
        if (page === 'pay') {
            pay()
        }
        swal.close()
        localStorage.setItem('last_page', page)
        mo.find(".page_name").html(page_name)
        mo.find(".btn-hamburger").trigger('click')
    })
})



window.onload = function() {
    var slideout = new Slideout({
        'panel': document.getElementById('panel'),
        'menu': document.getElementById('menu'),
        'side': 'left'
    });

    document.querySelector('.js-slideout-toggle').addEventListener('click', function() {
        slideout.toggle();
    });

    document.querySelector('.menu').addEventListener('click', function(eve) {
        if (eve.target.nodeName === 'A') { slideout.close(); }
    });
};