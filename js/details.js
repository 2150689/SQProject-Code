(function() {
    'use strict';

    window.onload = function () {
        var $plsForm = $('#plsForm');
        $plsForm.submit(function(){
            //the ID needs to be changed;
            $.get("http://contactsqs2.apphb.com/Service.svc/rest/contact/byguid/" + id)
                .done(function(results) {
                    if (results.status=="ok") {
                        //Do this later~ table on vertical~
                        var codeForLine = "<tr><td>" + +"</td><td>" + dataLine.GivenName + "</td></tr>" +
                            dataLine.Surname + "</td></tr>" + dataLine.Phone + "</td></tr>" + dataLine.City + "</td></tr>" +
                            "<img src=\"" + dataLine.Image + "\">";
                        codeForLine = codeForLine + "<a href=\"details.html?id=" + dataLine.Guid +"\" class=\"btn btn-primary\">Details</a>";
                        codeForLine = codeForLine + "</td></tr>";

                        $("#detailsTable").after(codeForLine);
                    }
                }).fail(function(err) {
                console.log(err);
            }).always(function() {
                // $searchButton.removeAttr('disabled');
                // $panel.removeClass('hidden');
            });
        })
    }
})();
