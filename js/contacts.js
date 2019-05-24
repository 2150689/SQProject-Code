(function() {
    'use strict';

    function fetchSources (item) {
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
        $select.removeAttr('disabled')
    }

    function filterBySource ($buttonSource, source){
        var $panel = $('#resultPanel');
        $buttonSource.attr('disabled', 'disabled');
        $panel.addClass('hidden');
        var url = "";
        if(source !== "All"){
            url = "http://contactsqs2.apphb.com/Service.svc/rest/contacts/bysource/" + source;
        }else{
            url = "http://contactsqs2.apphb.com/Service.svc/rest/contacts";
        }
        $.getJSON( url)
            .done(function(results) {
                console.log(results);
                updatePanel($panel, results);
            }).fail(function(err) {
                console.log(err);
            }).always(function() {
                $buttonSource.removeAttr('disabled');
                $panel.removeClass('hidden');
            });
    }

    function updatePanel($panel, results) {
        console.log(results);
        $panel.removeClass('disabled');
        results.forEach(function(dataLine) {
            var codeForLine = "<tr>" +
                     "<td>" + ((dataLine.GivenName != null) ? dataLine.GivenName : "--------------") +
                "</td><td>" + ((dataLine.Surname != null) ? dataLine.Surname : "--------------") +
                "</td><td>" + ((dataLine.Phone != null) ? dataLine.Phone : "--------------") +
                "</td><td>" + ((dataLine.City != null) ? dataLine.City : "--------------") +
                "</td><td>" + ((dataLine.Source != null) ? dataLine.Source : "--------------") +
                "</td><td>" + ((dataLine.PhotoUrl != null) ? "<img src=\"" + dataLine.PhotoUrl + "\">" : "<img src=\" https://upload.wikimedia.org/wikipedia/en/e/ee/Unknown-person.gif \">") +
                "</td><td>" + "<a href=\"details.html?id=" + dataLine.Guid +"\" class=\"btn btn-primary\">Details</a></td>" + "</td></tr>";

            $("#contactsTable").after(codeForLine);
            //Indexação
        });
    }

    function createThumbnail(imageUrl, url) {
        var img = imageUrl === null ? 'http://placehold.it/64x85' : imageUrl;
        var $image = $('<img/>', {src: img, 'class': 'media-object', width:140, height:80});
        var $anchor = $('<a/>', {href: url})
            .append($image);
        return $('<div/>', {'class': 'media-left'})
            .append($anchor);
    }

    window.onload = function () {
        (function() {
            var url = "http://contactsqs2.apphb.com/Service.svc/rest/contacts";
            $.getJSON( url)
                .done(function(data) {
                    fetchSources(data);
                    console.log(data);
                });
        })();
        var $sourceForm = $('#sourceForm');
        var $buttonSource = $('button', $sourceForm);

        $sourceForm.submit(function (e) {
            e.preventDefault();
            var source = $('#source').val();
            filterBySource($buttonSource, source);
        });
    };
})();
