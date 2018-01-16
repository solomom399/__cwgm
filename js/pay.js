var handler = PaystackPop.setup({
    key: 'pk_test_627b3212869ed34b3c5dee07082de6ece430cd6a',
    email: email,
    amount: amount,
    ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
    metadata: {
        custom_fields: [
            {
                display_name: "Fullname",
                variable_name: 'name',
                value: name
            }
        ]
    },
    callback: function(response){
          // alert('success. transaction ref is ' + response.reference);
    },
    onClose: function(){
          
    }
});
handler.openIframe();