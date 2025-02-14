<?php
$msg = json_encode($_POST);
$protocol = $_POST['pt'];
$domain = $_POST['pd'];
$response = "
<html>
    <head>
        <script type='text/javascript'>
            parent.postMessage('".$msg."', '".$protocol."//".$domain."');
        </script>
    </head>
    <body>
    </body>
</html>";

echo $response; 
?>