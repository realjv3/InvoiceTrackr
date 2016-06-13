@extends('main')
@section('content')

<script type="text/babel">

    ReactDOM.render(
    <div id="greeting">
        <h1>Track time.</h1>
        <h1>Create and send invoices.</h1>
        <h1>Get money.</h1>
    </div>, document.getElementById('content'));
</script>

@endsection