<?php
  function getdbvalues() {
    $query = 'SELECT * FROM mydb WHERE Id = 1';
    $fetch = mysql_query($query) or die ('Could not find tablerow');
    $row = mysql_fetch_assoc($fetch);

    $textString = $row['Text'];

    return $textString;
  }
?>