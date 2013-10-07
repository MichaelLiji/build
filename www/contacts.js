document.addEventListener("deviceready", onDeviceReady, false);
//
function onDeviceReady() {
//    alert("hello123")

    function trim(str){
        return str.replace(/^\s+|\s+$/g, "");
    }
    
    Contacts = {
        read: function(callback) {
            var options = new ContactFindOptions();
            options.multiple = true;
//            options.filter = "0501200000","123";
//            var fields = ["*"];
            var fields = ["id","name", "displayName", "organizations","emails","phoneNumbers","addresses"];
//            var fields = ["name", "displayName", "nickname", "emails", "phoneNumbers"];
            navigator.contacts.find(fields, onSuccess, onError, options);


            function onSuccess(contacts) {
                var result = [];
                if (contacts.length > 0){
                    contacts.forEach(function(c) {
                        //get name starts
                        var name = "";
                        if (c.displayName != null) {
                            name = c.displayName;
                        } else {
                            for (var i in c.name) {
                                if (c.name[i] != null)name += c.name[i] + " ";
                                
                            }
//                            if (trim(name) == "" && c.nickname != null) {
//                                name = c.nickname;
//                            }
                        }
                        //get name ends
                        
                        //get phones starts
                        var phones = [];
                        if (c.phoneNumbers != null && c.phoneNumbers.length > 0){
                            c.phoneNumbers.forEach(function(ph) {
                                if (ph.value != null)
                                    phones.push(ph.value);
                            });
                        }
                        //get phones ends

                        //get emails starts
                        var emails = [];
                        if (c.emails != null && c.emails.length > 0){
                            c.emails.forEach(function(em) {
                                if (em.value != null)
                                    emails.push(em.value);
                            });
                        }
                        //get emails ends
                        result.push({
                            name: trim(name),
                            phones: phones,
                            emails: emails
                        });
                    });
                }
                callback(result);
//                callback(contacts);
            }

            function onError(contactError) {
                alert('onError!');
                console.log(contactError);
            }

        }

    };

    Contacts.read(function(data) {
        console.log(data);
    });


}

//
//document.addEventListener("deviceready", onDeviceReady, false);
//
//    // PhoneGap is ready
//    //
//    function onDeviceReady() {
//        // find all contacts with 'Bob' in any name field
//        var options = new ContactFindOptions();
//        options.filter="Bob"; 
//        var fields = ["displayName", "name"];
//        navigator.contacts.find(fields, onSuccess, onError, options);
//    }
//
//    // onSuccess: Get a snapshot of the current contacts
//    //
//    function onSuccess(contacts) {
//        for (var i=0; i<contacts.length; i++) {
//            console.log("Display Name = " + contacts[i].displayName);
//        }
//    }
//
//    // onError: Failed to get the contacts
//    //
//    function onError(contactError) {
//        alert('onError!');
//    }
