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
    '@angular/cdk/keycodes': 'npm:@angular/cdk/bundles/cdk-keycodes.umd.js',
    '@angular/cdk/observe-content': 'npm:@angular/cdk/bundles/cdk-observe-content.umd.js',
    '@angular/cdk/platform': 'npm:@angular/cdk/bundles/cdk-platform.umd.js',
    '@angular/cdk/portal': 'npm:@angular/cdk/bundles/cdk-portal.umd.js',
    '@angular/cdk/rxjs': 'npm:@angular/cdk/bundles/cdk-rxjs.umd.js',
    '@angular/cdk/table': 'npm:@angular/cdk/bundles/cdk-table.umd.js',
    '@angular/cdk/testing': 'npm:@angular/cdk/bundles/cdk-testing.umd.js',

    '@angular/material': 'npm:@angular/material',
    '@angular/material/button': 'npm:@angular/material/bundles/material-button.umd.js',

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
