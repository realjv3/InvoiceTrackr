<!DOCTYPE html>
<html>
<head>
    <title>InvoiceTrackr</title>

    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge;" />

    <link href='https://fonts.googleapis.com/css?family=Alegreya+Sans:400,700' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Alegreya+Sans+SC" rel="stylesheet" type="text/css">

    <link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="icon" href="https://www.dropbox.com/s/1x89klicik0olnk/money.png?dl=1">

    <script type="text/javascript">
        var _token = "{{ csrf_token() }}";
        var logged_in = {{$logged_in}};
        var cur_user = {!! $cur_user !!};
    </script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-67521337-2"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-67521337-2');
    </script>

</head>
<body>
    <header id="appbar"></header>

    <div id="content">
        @yield('content')
    </div>

    <div id="overlay">
        <div id="loader"></div>
    </div>

    <footer id="footer">
        @yield('scripts')
    </footer>
</body>
</html>