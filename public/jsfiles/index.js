$('#timer').countdown({
    until: new Date(2017, 6 - 1, 12),
    compact: true,
    format: 'YODHMS', //we can always set the format we want 'HMS' 'DHMS' etc
    expiryText: '<p class="text-danger">Your time has elapsed</p>',
    expiryUrl: '/remove/123453788', //url to redirect to after countdown reaches 0. mostly a remove url to perform action
    description: 'Your validity period'
});