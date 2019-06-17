(function() {
    'use strict';

    window.onload = function () {
        $.getJSON("http://contactsqs2.apphb.com/Service.svc/rest/contacts")
            .done(function(results) {
                let mapToIterate = handleMap(results);
                if(mapToIterate.size === 0){
                    //Advance.
                }else{
                    createTables(mapToIterate);
                    createButtonsForDefaultActions(mapToIterate);
                }
            }).fail(function(err) {
            console.log(err);
        }).always(function() {
        });
    };

    /**
     * Main function that will handle the Map.
     * It will call for other functions, that will further decompose what we are doing.
     * @param results - results gotten from the API call
     */
    function handleMap(results) {
        //Create a new map, for the possible duplicates.
        let differencesMap = new Map();
        //For all the results gotten on the call to the API
        for(let positionResults = 0; positionResults < results.length; positionResults++){
            if(!findInMap(differencesMap, results[positionResults])){
                //Aren't we on the first iteration?   [This was switched; More optimized this way.]
                if(differencesMap.size !== 0){
                    //Is this contact already in any sort of way on our map?
                    let response = verifyIfContainsOnMap(differencesMap, results[positionResults]);
                    if ( response[0] ) {

                        //Yes it is. Add it to the corresponding key.
                        differencesMap = addToArrayOnMap(differencesMap, results[positionResults], response[1]);

                        //We need to reset AFTER adding it to the map.
                        positionResults = -1;
                    } else {
                        //No it isn't. Add it to a new key.
                        differencesMap = addToMap(differencesMap, results[positionResults]);
                    }
                }else{
                    //Lets add the position
                    differencesMap = addToMap(differencesMap, results[positionResults]);
                }
            }

        }
        //Presenting the answer of duplicates
        return clearMapForDuplicates(differencesMap);

    }

    /**
     * Function that will add data to the map, on the next position.
     * @param map - map used. Normally its the differencesMap.
     * @param contact - current contact on the iteration.
     * @returns - the modified map.
     */
    function addToMap(map, contact){
        //Create a new key and a new value, which is a Array
        map.set(map.size+1, []);
        //Push the contact into the Array
        map.get(map.size).push(contact);
        return map;
    }

    /**
     * Function that will add data to a position on the map.
     * @param map - map used. Normally its the differencesMap.
     * @param contact - current contact on the iteration.
     * @param position - the position to add the contact.
     * @returns - the modified map.
     */
    function addToArrayOnMap(map, contact, position){
        //Push the contact into the Array on the already created position.
        map.get(position).push(contact);
        return map;
    }

    /**
     * Function that will verify if the variable is contained on the map.
     * @param differencesMap - map to check upon.
     * @param contact - current contact on the iteration.
     * @returns [boolean, int] - True if it exists, and the position in the map.
     */
    function verifyIfContainsOnMap(differencesMap, contact) {
        for(let sizeOfMap = 1; sizeOfMap <= differencesMap.size; sizeOfMap++){
            //Does it exist in the array?
            if(verifyIfContainsOnArray(differencesMap.get(sizeOfMap), contact)){
                //Return true and the position
                return [true, sizeOfMap];
            }
        }
        //Doesn't exist. Return false
        return [false, 0];
    }

    /**
     * Function that will verify if the variable is contained on the array
     * @param array - array to check upon.
     * @param contact - current contact on the iteration.
     * @returns boolean if if it exists.
     */
    function verifyIfContainsOnArray(array, contact) {
        for(let arrayPosition = 0; arrayPosition < array.length; arrayPosition++){

            //Matching Emails -- High Probability!
            if(array[arrayPosition].Email === contact.Email){
                return true;
            }

            //Matching cellphones -- High probability!
            if(array[arrayPosition].Phone === contact.Phone){
                return true;
            }

            /*if(array[arrayPosition].GivenName === contact.GivenName && array[arrayPosition].Surname === contact.Surname){
                return true;
            }*/

            /*if(array[arrayPosition].Phone === contact.Phone || array[arrayPosition].Email === contact.Email){
                return true;
            }*/
        }
        return false;
    }

    /**
     * Function that will clear the map, returning a new Map with only the duplicates.
     * @param differencesMap - map used. Normally its the differencesMap.
     * @returns {Map<Int, Array()>}
     */
    function clearMapForDuplicates(differencesMap) {

        let newMap = new Map();
        let counter = 1;
        let asd = 0;
        for(let key = 1; key < differencesMap.size; key++) {
            //They don't have the size equal to 1? Add them to the map of duplicates.
            if (differencesMap.get(key).length !== 1) {
                asd += differencesMap.get(key).length;
                newMap.set(counter, differencesMap.get(key));
                counter++;
            }
        }
        return newMap;
    }

    function createTables(mapToIterate){
        let formArea = $('#FormTableArea');
        let stringToAdd = "";
        let counter = 1;
        let arrayOfKeys = Object.keys(mapToIterate.get(1)[0]);
        let arrayColumns = [];
        for(let keyPosition = 1; keyPosition <= mapToIterate.size; keyPosition++) {
            arrayColumns = getColumns(mapToIterate.get(keyPosition), arrayOfKeys);
            if (arrayColumns.length !== 0) {

                //Sections
                if (counter % 2 === 0) {
                    stringToAdd += '<section class="mb-5">';
                } else {
                    stringToAdd += '<section class="mb-5">';
                }

                //Creation of table itself
                stringToAdd += '<table class="table mb-5 table-hover table-bordered ';
                //Sections
                if (counter % 2 === 0) {
                    stringToAdd += 'sectionWhite">';
                } else {
                    stringToAdd += 'sectionColor">';
                }
                //Creation of Header
                if (counter % 2 === 0){
                    stringToAdd += '<thead class="thead-light">';
                }else{
                    stringToAdd += '<thead class="thead-dark">';
                }
                stringToAdd += '<tr><th style="text-align:center">#</th>';
                for (let columnsPos = 0; columnsPos < arrayColumns.length; columnsPos++) {
                    stringToAdd += '<th style="text-align:center">' + arrayColumns[columnsPos] + '</th>'
                }
                stringToAdd += '</tr>';

                //Creation of Body
                stringToAdd += '<tbody>';
                for (let position = 0; position < mapToIterate.get(keyPosition).length; position++){
                    stringToAdd += '<tr><th scope="row" align="center">' + (position + 1) + '</th>';
                    for (let columnsPos = 0; columnsPos < arrayColumns.length - 2; columnsPos++) {
                        if(mapToIterate.get(keyPosition)[position][arrayColumns[columnsPos]] === null){
                            stringToAdd += '<td style="text-align:center">' + "- - - -" + '</td>';
                        }else{
                            stringToAdd += '<td style="text-align:center">' + mapToIterate.get(keyPosition)[position][arrayColumns[columnsPos]] + '</td>';
                        }
                    }
                    //Creating
                    stringToAdd += '<td style="text-align:center">' +
                        '<div class="custom-control custom-radio">' +
                        '<input value="1" type="radio" id="customRadio' + keyPosition + '.' + position + 'A" name="customRadio' + keyPosition + '.' + position + '" class="custom-control-input">' +
                        '<label class="custom-control-label" for="customRadio' + keyPosition + '.' + position + 'A"></label>' +
                        '</div>' +
                        '</td>' +
                        '<td style="text-align:center">' +
                        '<div class="custom-control custom-radio">' +
                        '<input value="0" type="radio" id="customRadio' + keyPosition + '.' + position + 'B" name="customRadio' + keyPosition + '.' + position + '" class="custom-control-input">' +
                        '<label class="custom-control-label" for="customRadio' + keyPosition + '.' + position + 'B"></label>' +
                        '</div></td>';

                    stringToAdd += '</tr>';
                }
                stringToAdd += '</tbody>';

                stringToAdd += '</table>';
                //Ending Sections
                stringToAdd += '</section>';

                //Pushing table
                formArea.append(stringToAdd);

                //Resetting all variables
                stringToAdd = "";
                counter++;
            }
        }
    }

    function getColumns(array, arrayOfKeys){
        let arrayColumns = [];
        for(let keys = 0; keys < arrayOfKeys.length; keys++) {
            //Lets ignore both GUID and Photo
            if (!(arrayOfKeys[keys] === "Guid" || arrayOfKeys[keys] === "PhotoUrl" || arrayOfKeys[keys] === "Birthday" || arrayOfKeys[keys] === "Company")){
                for (let position = 0; position < array.length; position++) {
                    if (array[position][arrayOfKeys[keys]] != null) {
                        if (!arrayColumns.includes(arrayOfKeys[keys])) {
                            arrayColumns.push(arrayOfKeys[keys]);
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        //Add the Radio Buttons
        if(arrayColumns.length !== 0){
            arrayColumns.push("Accept","Reject");
        }
        return reOrderColumns(arrayColumns);
    }

    function reOrderColumns(array){
        let sortedColumns = [
            {GivenName: "GivenName"},
            {Surname: "Surname"},
            {Email: "Email"},
            {Phone: "Phone"},
            {City: "City"},
            {StreetAddress: "StreetAddress"},
            {Source: "Source"},
            {Occupation: "Occupation"},
            {Accept: "Accept"},
            {Decline: "Decline"}
        ];

        let referenceArray= [];
        for (let key in sortedColumns) {
            for (let j in sortedColumns[key]){
                if(array[j] !== "null"){
                    referenceArray.push(j);
                }
            }
        }
        return referenceArray;
    }


    function findInMap(map, val){
        for (let v of map.values()) {
            if (v.includes(val)) {
                return true;
            }
        }
        return false;
    }

    function createButtonsForDefaultActions(mapToIterate) {
        $('#option1').click(function (e) {
            e.preventDefault();
            $('#labelOption1').addClass("active");
            $('#labelOption2').removeClass("active");
        });

        $('#option2').click(function (e) {
            e.preventDefault();
            $('#labelOption2').addClass("active");
            $('#labelOption1').removeClass("active");
        });

        $('#confirmButton').click(function (e) {
            e.preventDefault();

            let idsToIgnore = [];

            if($('#labelOption1').hasClass("active")){
                //We are on the label which states the manual.
                let inputs = document.getElementsByTagName("input");
                let uniqueInputs = [];
                $.each(inputs, function(i, el){
                    if($.inArray(el.name, uniqueInputs) === -1) uniqueInputs.push(el.name);
                });

                let input;
                let boolean = false;
                let keyPosition = 0;
                for(let i = 1; i < uniqueInputs.length; i++) {
                    boolean = false;
                    input = document.getElementsByName(uniqueInputs[i]);

                    for(let nodePosition = 0; nodePosition < input.length; nodePosition++){
                        if(input[nodePosition].checked){
                            boolean = true;
                            //Does is not end with a .0? Then it means the keyPosition is increased.
                            if(uniqueInputs[i].endsWith(".0")){
                                keyPosition++;
                            }

                            for(let position = 0; position < input.length; position++) {
                                if(position!==nodePosition){
                                    idsToIgnore.push(mapToIterate.get(keyPosition)[position].Guid);
                                }
                            }
                            break;
                        }
                    }
                    if(!boolean){
                        alert("WRONG. Fill everything, please");
                        return;
                    }
                }
            }else{
                //First iteration -- Lets just accept the 1st one, and decline the rest.
                for(let keyPosition = 1; keyPosition <= mapToIterate.size; keyPosition++) {
                    for(let position = 1; position < mapToIterate.get(keyPosition).length; position++){
                        idsToIgnore.push(mapToIterate.get(keyPosition)[position].Guid);
                    }
                }
            }
            redirection(idsToIgnore);
        });
    }

    function redirection(idsToIgnore){
        window.sessionStorage.setItem("idsSize", idsToIgnore.length.toString());
        for(let pos = 0; pos < idsToIgnore.length; pos++){
            window.sessionStorage.setItem("ids" + pos, idsToIgnore[pos]);
        }
        window.location.href = "duplicateFree.html";
    }

})();
