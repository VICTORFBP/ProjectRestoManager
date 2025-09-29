<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Roles</title>
</head>
<body>
    <h1>Lista de Roles</h1>

    @if($roles->isEmpty())
        <p>No hay roles registrados.</p>
    @else
        <ul>
            @foreach ($roles as $role)
                <li>{{ $role->name }} - {{ $role->description }}</li>
            @endforeach
        </ul>
    @endif
</body>
</html>
