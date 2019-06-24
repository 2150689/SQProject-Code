(function() {
    'use strict';

    let array = [];
    let boolean = true;

    window.onload = function () {
        if(sessionStorage.getItem("idsSize") === undefined){
            alert("Returning...");
            window.history.back();
            return;
        }
        for(let pos = 0; pos < sessionStorage.getItem("idsSize"); pos++){
            array.push(sessionStorage.getItem("ids" + pos));
        }

        (function() {
            let url = "http://contactsqs2.apphb.com/Service.svc/rest/contacts";
            $.getJSON(url)
                .done(function(data) {
                    let newData = [];
                    //Remove those removed.
                    data.forEach(function (element) {
                        if(array.indexOf(element.Guid) === -1){
                            newData.push(element)
                        }
                    });
                    array = newData;
                    getListOfSources(newData);
                    filterBySource(newData, $('button', $('#sourceForm')), "All");
                });
        })();

        $('#unfilteredButton').click(function (e) {
            e.preventDefault();
            //Destroy the values received from the filtering part.
            for(let pos = 0; pos < sessionStorage.getItem("idsSize"); pos++){
                sessionStorage.removeItem("ids" + pos);
            }
            sessionStorage.removeItem("idsSize");

            window.location.href = "index.html"
        });
    };


    function updatePanel($panel, results) {
        console.log(results);
        let t = $('#contactsTable').DataTable({
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

        let counter = 1;
        results.forEach( function(dataLine) {
            t.row.add(
                row(dataLine, counter)
            ).draw(false);
            counter++;
        });
    }

    function row(dataLine, counter)
    {
        return [counter, ((dataLine.GivenName != null) ? dataLine.GivenName : "--------------"),
            ((dataLine.Surname == null) ? "--------------" : dataLine.Surname), ((dataLine.Phone == null) ? "--------------" : dataLine.Phone),
            ((dataLine.Source == null) ? "--------------" : dataLine.Source), ((dataLine.City == null) ?  "--------------" : dataLine.City),
        "<a href=\"details.html?id=" + dataLine.Guid + "\" class=\"btn btn-primary\">Details</a>"];
    }
    $('#sourceForm').submit(function (e) {
        e.preventDefault();
        filterBySource(array, $('button', $('#sourceForm')), $('#source').val());
    });


    function filterBySource(data, $buttonSource, source) {
        var $panel = $('#resultPanel');
        $buttonSource.attr('disabled', 'disabled');
        $panel.addClass('hidden');
        var newData = [];
        if(source === "All"){
            newData = data;
        }else{
            data.forEach(function (element) {
                if(element.Source === source){
                    newData.push(element);
                }
            })
        }

        if(!boolean){
            $('#contactsTable').DataTable().clear().destroy();
        }


        updatePanel($panel, newData);
        boolean = false;
        $buttonSource.removeAttr('disabled');
        $panel.removeClass('hidden');
    }

    function getListOfSources(item) {
        //Array that will contain the available sources;
        var arraySources = [];

        //We need to add the .source to all items.
        $('#source').attr('disabled', 'disabled');

        //The first position must contain "ALL"
        arraySources.push("All");
        $('#source').append($('<option>', {"value": "All"}).append("All"));

        //For each item, on the received argument item;
        item.forEach(function(item){
            if(!arraySources.includes(item.Source)){
                //push it to the array, so that it wont get repeated;
                arraySources.push(item.Source);
                //Add it to the SELECT Tag.
                $('#source').append($('<option>', {"value": item.Source}).append(item.Source));
            }
        });
        //Make it available again
        $('#source').removeAttr('disabled');
    }
})();