<?php
  echo "<script>let metaData = '$metaData';</script>";
?>

<div class="container">
<button class="btn btn-primary" id="addbutton" title="Add"><span class="fa fa-plus-square"></span></button>
  
  <table cellpadding="0" cellspacing="" border="0" class="dataTable table table-striped" id="meta-table">

  </table>

</div>

<div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog">

    <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">JSON Form</h4>
        </div>
        <div class="modal-body">
        <form id ="meta-form"></form>
        </div>
        <div class="modal-footer">
        </div>
      </div>
      
    </div>
  </div>

  </div>
<div class="modal fade" id="deleteModal">
 <div class="modal-dialog">
  <div class="modal-content">
   <div class="modal-header">
    <h5 class="modal-title" id="exampleModalLabel">Delete row</h5>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
   </div>
   <div class="modal-body">
    <p>Are you sure you want to delete?</p>
  </div>
  <div class="modal-footer">
   <button type="button" class="btn btn-secondary" id="close-modal" data-dismiss="modal">No</button>
    <button type="button" class="btn btn-danger" id="submit-modal">Yes</button>
   </div>
  </div>
 </div>
</div>