System.config({
	defaultJSExtensions: true,
  paths: {
    // paths serve as alias
    'npm:': './'
  },
  // map tells the System loader where to look for things
  map: {
    // our app is within the app folder
    app: 'app',

    // angular bundles

    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
    '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
    '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
    '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',

    '@angular/cdk': 'npm:@angular/cdk/bundles/cdk.umd.js',
    '@angular/cdk/a11y': 'npm:@angular/cdk/bundles/cdk-a11y.umd.js',
    '@angular/cdk/bidi': 'npm:@angular/cdk/bundles/cdk-bidi.umd.js',
    '@angular/cdk/coercion': 'npm:@angular/cdk/bundles/cdk-coercion.umd.js',
    '@angular/cdk/collections': 'npm:@angular/cdk/bundles/cdk-collections.umd.js',
    '@angular/cdk/keycodes': 'npm:@angular/cdk/bundles/cdk-keycodes.umd.js',
    '@angular/cdk/observe-content': 'npm:@angular/cdk/bundles/cdk-observe-content.umd.js',
    '@angular/cdk/overlay': 'npm:@angular/cdk/bundles/cdk-overlay.umd.js',
    '@angular/cdk/platform': 'npm:@angular/cdk/bundles/cdk-platform.umd.js',
    '@angular/cdk/portal': 'npm:@angular/cdk/bundles/cdk-portal.umd.js',
    '@angular/cdk/rxjs': 'npm:@angular/cdk/bundles/cdk-rxjs.umd.js',
    '@angular/cdk/scrolling': 'npm:@angular/cdk/bundles/cdk-scrolling.umd.js',
    '@angular/cdk/table': 'npm:@angular/cdk/bundles/cdk-table.umd.js',
    '@angular/cdk/testing': 'npm:@angular/cdk/bundles/cdk-testing.umd.js',

    '@angular/material': 'npm:@angular/material/bundles/material.umd.js',
    '@angular/material/button': 'npm:@angular/material/bundles/material-button.umd.js',
    '@angular/material/button-toggle': 'npm:@angular/material/bundles/material-button-toggle.umd.js',
    '@angular/material/card': 'npm:@angular/material/bundles/material-card.umd.js',
    '@angular/material/checkbox': 'npm:@angular/material/bundles/material-checkbox.umd.js',
    '@angular/material/chips': 'npm:@angular/material/bundles/material-chips.umd.js',
    '@angular/material/datepicker': 'npm:@angular/material/bundles/material-datepicker.umd.js',
    '@angular/material/dialog': 'npm:@angular/material/bundles/material-dialog.umd.js',
    '@angular/material/form-field': 'npm:@angular/material/bundles/material-form-field.umd.js',
    '@angular/material/grid-list': 'npm:@angular/material/bundles/material-grid-list.umd.js',
    '@angular/material/icon': 'npm:@angular/material/bundles/material-icon.umd.js',
    '@angular/material/input': 'npm:@angular/material/bundles/material-input.umd.js',
    '@angular/material/list': 'npm:@angular/material/bundles/material-list.umd.js',
    '@angular/material/menu': 'npm:@angular/material/bundles/material-menu.umd.js',
    '@angular/material/paginator': 'npm:@angular/material/bundles/material-paginator.umd.js',
    '@angular/material/progress-bar': 'npm:@angular/material/bundles/material-progress-bar.umd.js',
    '@angular/material/progress-spinner': 'npm:@angular/material/bundles/material-progress-spinner.umd.js',
    '@angular/material/radio': 'npm:@angular/material/bundles/material-radio.umd.js',
    '@angular/material/select': 'npm:@angular/material/bundles/material-select.umd.js',
    '@angular/material/side-nav': 'npm:@angular/material/bundles/material-side-nav.umd.js',
    '@angular/material/slide-toggle': 'npm:@angular/material/bundles/material-slid-toggle.umd.js',
    '@angular/material/slider': 'npm:@angular/material/bundles/material-slider.umd.js',
    '@angular/material/snack-bar': 'npm:@angular/material/bundles/material-snack-bar.umd.js',
    '@angular/material/sort': 'npm:@angular/material/bundles/material-sort.umd.js',
    '@angular/material/stepper': 'npm:@angular/material/bundles/material-stepper.umd.js',
    '@angular/material/table': 'npm:@angular/material/bundles/material-table.umd.js',
    '@angular/material/tabs': 'npm:@angular/material/bundles/material-tabs.umd.js',
    '@angular/material/toolbar': 'npm:@angular/material/bundles/material-toolbar.umd.js',

    // Client side analytics and error tracking
    'angulartics2': 'npm:angulartics2/dist/core.umd.js',
    'rollbar': 'npm:rollbar/dist/rollbar.noconflict.umd.js',

    // other libraries
    'rxjs':                       'npm:rxjs'
  },
  packages: {
    "/angulartics2": {"defaultExtension": "js"}
  }
});
