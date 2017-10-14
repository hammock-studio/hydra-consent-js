var usersDataTable = (users) => {
  return users.reduce((usersData, user) => {
    usersData.push(
      [
        user.id,
        user.username,
        user.email,
        user.admin,
        user.createdAt,
        user.updatedAt
      ]
    );
    return usersData;
  }, []);
}

$(document).ready(function() {
  $.ajax({
    url: "http://localhost:3000/v1/admin/users",
    success: function(users) {
      $('#users-table').dataTable(
        {
          destroy: true,
          paging: false,
          searching: false,
          data: usersDataTable(users),
        }
      );
    }
  });

  $('#next').on('click', function() {
    $.ajax({
      url: "http://localhost:3000/v1/admin/users?offset=10",
      success: function(users) {
        $('#users-table').dataTable(
          {
            destroy: true,
            paging: false,
            searching: false,
            data: usersDataTable(users),
          }
        );
      }
    });
  });

  $('#back').on('click', function() {
    $.ajax({
      url: "http://localhost:3000/v1/admin/users?offset=0",
      success: function(users) {
        $('#users-table').dataTable(
          {
            destroy: true,
            paging: false,
            searching: false,
            data: usersDataTable(users),
          }
        );
      }
    });
  });

  $('#users-table tbody').on('click', 'tr', function (event) {
    var table = $('#users-table').DataTable({
      destroy: true,
      paging: false,
      searching: false,
    });

    var data = table.row(this).data();
    $('#users-edit-user').modal('show');
    $('#users-edit-user').find('#username').val(data[1]);
    $('#users-edit-user').find('#email').val(data[2]);
    $('#users-edit-user').find('#admin').val(data[3]);
  });

  $('#users-add-user').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body input').val(recipient)
  })

  // $('#users-table tbody').on('click', 'tr', function () {
  //   $(this).toggleClass('table-info');
  // });
});
