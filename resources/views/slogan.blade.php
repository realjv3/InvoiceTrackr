@extends('main')
@section('slogan')

<script type="text/babel">

    ReactDOM.render(
    <div id="greeting">
            <h1>Make a list of stuff to do.</h1>
    <h1>Then do stuff.</h1>
    </div>, document.getElementById('content'));
</script>

@endsection