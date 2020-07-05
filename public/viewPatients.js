
function viewPatients() {
    var patientsArray = [];
    return firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/Patients').once('value').then(function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            patientsArray.push(userSnapshot);
        })
        var rows = "";
        var i = 0;
        $.each(patientsArray, function () {
            var patientEmail = patientsArray[i].val();

            console.log(patientEmail);
            rows += "<tr><td>" + patientEmail + "</td><td><button id='loginModalOpen' onclick='updateReport(" + (i + 1) + ")' class='btn btn-primary ml-3'>Update Report</button></td><td><input id='fileid' name='fileid' type='file' hidden /></td></tr>";
            i = i + 1;
        });
        $("#listOfPatients tbody").empty();

        $(rows).appendTo("#listOfPatients tbody");


    });
}
$('updateReport').click(function () {
    fileupload.click();
});
// document.getElementById('buttonid').addEventListener('click', openDialog);

// $(document).ready(function(){
//     $('input[type="file"]').change(function(e){
//         var fileName = e.target.files[0].name;
//         alert('The file "' + fileName +  '" has been selected.');
//     });
// });

function openDialog() {
    document.getElementById('fileid').click();
    $('#fileid').on('change', function () {
        // output raw value of file input
        // $('#filename').html($(this).val()); 

        // or, manipulate it further with regex etc.
        var filename = $(this).val();
        // .. do your magic
        console.log(filename);

        //  $('#filename').html(filename);
    });
}

// function getReport(i) {
//     table = document.getElementById("listOfPatients");
//     tr = table.getElementsByTagName("tr");
//     td = tr[i].getElementsByTagName("td")[0];
//     clickedPatient = td.textContent || td.innerText;
//     console.log(clickedPatient);



//     window.location.href = '/fetch/' + clickedPatient + '/' + firebase.auth().currentUser.email;


// }

function updateReport(i) {

    table = document.getElementById("listOfPatients");
    tr = table.getElementsByTagName("tr");
    td = tr[i].getElementsByTagName("td")[0];
    clickedPatient = td.textContent || td.innerText;
    console.log(clickedPatient);
    firebase.database().ref('Users').orderByChild('Email').equalTo(clickedPatient).once('value').then(function (snapshot) {
        if (snapshot) {
            snapshot.forEach(function (userSnapshot) {
                $('#loginModalOpen').click(function () {

        $('#loginModal').modal('show');
        document.getElementById('patientuid').value = userSnapshot.key;
        document.getElementById("loggedinuser").value = firebase.auth().currentUser.uid;
        document.getElementById('patientEmail').value = userSnapshot.val().Email;
        document.getElementById('doctorEmail').value = firebase.auth().currentUser.email;


      });


            })
        }
    })
    

    $('#loginModalClose').click(function () {
        $('#loginModal').modal('hide');
    });
    // document.getElementById("loggedinuser").value = firebase.auth().currentUser.email;





}