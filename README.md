# strapi-plugin-api-column-layout-order

This plugin shows api column order in edit layout order.  
If you changed the order of displaying fields in the Content Manager, the order reflects also in the api response.

Install this plugin with package manager and then modify your plugins.js file like this:
```js
module.exports = ({ env }) => ({
  'strapi-plugin-api-column-layout-order': {},
  // ...
});
```
