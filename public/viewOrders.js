
function viewOrders() {
    var claimsArray = [];
    return firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/Orders').once('value').then(function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            claimsArray.push(userSnapshot);
        })
        var rows = "";
        var i = 0;
        $.each(claimsArray, function () {
            var patientEmail = claimsArray[i].val();

            rows += '<tr><td>' + patientEmail + '</td></tr>'
            i = i + 1;
        });
        $("#viewClaimsList tbody").empty();

        $(rows).appendTo("#viewClaimsList tbody");


    });
}