@extends('header_footer')

@section('content')
    <div id="greeting">
        <h1>Track time.</h1>
        <h1>Create and send invoices.</h1>
        <h1>Get paid.</h1>
    </div>
@endsection

@section('scripts')
    <script src="{{ URL::asset('js/landing.js') }}" type="text/javascript"></script>
@endsection