<?php

if (preg_match('/^http.*/', $_GET['feed'])) 
  echo file_get_contents($_GET['feed']);