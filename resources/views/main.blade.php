<!DOCTYPE html>
<html>
<head>
    <title>Invoice This</title>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href='https://fonts.googleapis.com/css?family=Alegreya+Sans:400,700' rel='stylesheet' type='text/css'>
    <link rel="icon" href="http://googledrive.com/host/0B1f8PNGaySaRX1ljSDcyajE0d28">

    <script src="{{ URL::asset('js/bundle.js') }}" type="text/javascript"></script>
    <script>
        var _token = "{{ csrf_token() }}";
        var logged_in = {{$logged_in}};
        var cur_user = {!! $cur_user !!};
    </script>
    <script src="{{ URL::asset('js/babel-core_5.8.34.js') }}"></script>
</head>

<body>
    <header id="appbar"></header>

    <div id="content">
        @yield('content')
    </div>
    <footer id="footer">
        <script src="{{ URL::asset('js/main.jsx') }}" type="text/babel"></script>
    </footer>
</body>
</html>