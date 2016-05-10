<!DOCTYPE html>
<html>
    <head>
        <title>Do Stuff</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href='https://fonts.googleapis.com/css?family=Alegreya+Sans:400,700' rel='stylesheet' type='text/css'>
        <script src="{{ URL::asset('js/bundle.js') }}" type="text/javascript"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.24/browser.min.js"></script>
    </head>

    <body>
        <header id="container"></header>
        <div id="content">
            @if (Auth:check())
                @yield('content')
            @else
                @yield('slogan')
            @endif
        </div>
        <script src="{{ URL::asset('js/main.jsx') }}" type="text/babel"></script>
    </body>
</html>