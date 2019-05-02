(function() {
    'use strict';

    $(function() {
        var $plsForm = $('#plsForm');
       $plsForm.submit(function(e){
           $.get('http://contactsqs2.apphb.com/Service.svc/rest/contacts')
               .done(function(results) {
                   if (results.status=="ok") {
                       console.log(results);
                   }
               }).fail(function(err) {
               console.log(err);
           }).always(function() {
               // $searchButton.removeAttr('disabled');
               // $panel.removeClass('hidden');
           });
       })

    });
})();
