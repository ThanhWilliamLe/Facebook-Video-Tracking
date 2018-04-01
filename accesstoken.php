<?php
if (isset($_POST['token'])) {
    $myfile = fopen("accesstoken", "w");
    fwrite($myfile, $_POST['token']);
    fclose($myfile);
    echo "Something";
} else {
    echo "Nothing";
}