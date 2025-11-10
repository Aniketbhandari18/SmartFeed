<?php
function generateCuid() {
  return "c" . bin2hex(random_bytes(10));
}
?>
