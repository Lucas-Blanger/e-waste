<?php
$conn = new mysqli("localhost", "root", "1234", "nome_do_banco");

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

$feedback = $_POST['feedback'];

$sql = "INSERT INTO feedbacks (texto) VALUES ('$feedback')";

if ($conn->query($sql) === TRUE) {
    echo "Feedback salvo com sucesso";
} else {
    echo "Erro: " . $conn->error;
}

$conn->close();
?>
