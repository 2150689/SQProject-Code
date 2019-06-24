(function () {
    'use strict';

    function fetchSources(item) {
        //Array that will contain the sources avaliable;
        var arrayToAdd = [];

        //Part that will get the SELECT Tag.
        var $select = $('#source');
        //We need to add the .source to all items.
        $select.attr('disabled', 'disabled');

        //The first position must contain "ALL"
        arrayToAdd.push("All");
        $select.append($('<option>', {"value": "All"}).append("All"));

        //For each item, on the received argument item;
        item.forEach(function(item){
            if(!arrayToAdd.includes(item.Source)){
                //push it to the array, so that it wont get repeated;
                arrayToAdd.push(item.Source);
                //Add it to the SELECT Tag.
                $select.append($('<option>', {"value": item.Source}).append(item.Source));
            }
        });
        //Make it available again
        $select.removeAttr('disabled');
    }


    function filterBySource(data, $buttonSource, source) {
        var $panel = $('#resultPanel');
        $buttonSource.attr('disabled', 'disabled');
        $panel.addClass('hidden');
        var url = "";
        if (data == null) {
            if (source !== "All") {
                url = "http://contactsqs2.apphb.com/Service.svc/rest/contacts/bysource/" + source;
            } else {
                url = "http://contactsqs2.apphb.com/Service.svc/rest/contacts";
            }
            $.getJSON(url)
                .done(function (results) {
                    $('#contactsTable').DataTable().clear().destroy();
                    updatePanel($panel, results);
                })
                .fail(function (err) {
                    console.log(err);
                })
                .always(function () {
                    $buttonSource.removeAttr('disabled');
                    $panel.removeClass('hidden');
                });
        }else{
            updatePanel($panel, data);
            $buttonSource.removeAttr('disabled');
            $panel.removeClass('hidden');
        }
    }

    function updatePanel($panel, results) {
        console.log(results);
        var t = $('#contactsTable').DataTable({
            "order": [],
            "columns": [
                {"title": "ID", "name": "ID", "orderable": true},
                {"title": "GivenName", "name": "GivenName", "orderable": true},
                {"title": "Surname", "name": "Surname", "orderable": true},
                {"title": "Phone", "name": "Phone", "orderable": true},
                {"title": "Source", "name": "Source", "orderable": true},
                {"title": "City", "name": "City", "orderable": true},
                {"title": "Details", "name": "Details", "orderable": false, "searchable": false}
            ]
        });

        var counter = 1;
        results.forEach( function(dataLine) {
            t.row.add( [
                counter,
                ((dataLine.GivenName != null) ? dataLine.GivenName : "--------------"),
                ((dataLine.Surname != null) ? dataLine.Surname : "--------------"),
                ((dataLine.Phone != null) ? dataLine.Phone : "--------------"),
                ((dataLine.Source != null) ? dataLine.Source : "--------------"),
                ((dataLine.City != null) ? dataLine.City : "--------------"),
                "<a href=\"details.html?id=" + dataLine.Guid +"\" class=\"btn btn-primary\">Details</a>"
            ]).draw( false );
            counter++;
        });
    }

    var $source = $('#sourceForm');
    var $buttonSource = $('button', $source);
    (function() {
        let url = "http://contactsqs2.apphb.com/Service.svc/rest/contacts";
        $.getJSON(url)
            .done(function(data) {
                fetchSources(data);
                filterBySource(data, $buttonSource, "All");
            });
    })();

    $source.submit(function (e) {
        e.preventDefault();
        filterBySource(null, $buttonSource, $('#source').val());
    });

})();
