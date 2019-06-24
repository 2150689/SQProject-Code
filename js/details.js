(function() {
    'use strict';

    window.onload = function () {
        //Case some error has occurred
        if(getUrlVars()["id"] === undefined){
            alert("Some error occurred. Going back");
            window.history.back();
            return;
        }

        //Get the correct contact
        $.getJSON("http://contactsqs2.apphb.com/Service.svc/rest/contact/byguid/" + getUrlVars()["id"])
            .done(function(results) {
                //For each key/value gotten, which only gets the ones that aren't NULL
                populateTable(handleArray(results));
                //Add the photo case there is a photoURL
                fetchContactPhoto(results.PhotoUrl)
                $('#backButton').click(function (e) {
                    window.history.back();
                });


            }).fail(function(err) {
            console.log(err);
            alert("Some error occurred. Going back");
            window.history.back();
        }).always(function() {
        });
    };

    function fetchContactPhoto(photoURL) {

        if (photoURL != null){
            //get user image via imaginary service
            var url = "http://34.90.129.208/resize?width=180&height=180&type=jpeg&url=" + photoURL;
            $.ajax({
                url : url,
                cache: true,
                processData : false,
            }).always(function(photo){
                //the always will try until it gets the correct value
                $("#photoHolder").attr("src", url).fadeIn();
            });
        } else {
            //get default image via imaginary service
            var url = "http://34.90.129.208/resize?width=180&height=180&type=jpeg&url=https://www.seekpng.com/png/detail/115-1150053_avatar-png-transparent-png-royalty-free-default-user.png";
            $.ajax({
                url : url,
                cache: true,
                processData : false,
            }).always(function(){
                $("#photoHolder").attr("src", url).fadeIn();
            });

        }


    }


    function populateTable(data){
        let table = document.getElementById("detailsTable");
        for(const key of data.keys()){
            let row = table.insertRow();
            let cell1 = row.insertCell(0);
            let text1 = document.createTextNode(key);
            cell1.appendChild(text1);
            let cell2 = row.insertCell(1);
            let text2 = document.createTextNode(data.get(key));
            cell2.appendChild(text2);
        }
    }

    function getUrlVars() {
        var vars = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

    function createThumbnail(imageUrl, url) {
        var img = imageUrl === null ? 'http://placehold.it/64x85' : imageUrl;
        var $image = $('<img/>', {src: img, 'class': 'media-object', width:140, height:80});
        var $anchor = $('<a/>', {href: url})
            .append($image);
        return $('<div/>', {'class': 'media-left'})
            .append($anchor);
    }

    function handleArray(results){
        let arrayOfValues = new Map();

        if(results.GivenName !== null){
            arrayOfValues.set("GivenName", results.GivenName);
        }
        if(results.Surname !== null){
            arrayOfValues.set("Surname", results.Surname);
        }
        if(results.Birthday !== null){
            arrayOfValues.set("Birthday", results.Birthday);
        }
        if(results.Phone !== null){
            arrayOfValues.set("Phone", results.Phone);
        }
        if(results.Email !== null){
            arrayOfValues.set("Email", results.Email);
        }
        if(results.StreetAddress !== null){
            arrayOfValues.set("StreetAddress", results.StreetAddress);
        }
        if(results.City !== null){
            arrayOfValues.set("City", results.City);
        }
        if(results.Occupation !== null){
            arrayOfValues.set("Occupation", results.Occupation);
        }
        if(results.Company !== null){
            arrayOfValues.set("Company", results.Company);
        }
        return arrayOfValues;
    }
})();
