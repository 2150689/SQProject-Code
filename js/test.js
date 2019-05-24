window.onload = function() {
    (function() {
        var url = "http://contactsqs2.apphb.com/Service.svc/rest/contacts";
        $.getJSON( url)
            .done(function( data ) {
                console.log(data);
            });
    })();
};
