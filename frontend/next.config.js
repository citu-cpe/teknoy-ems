/** @type {import('next').NextConfig} */

// https://github.com/fullcalendar/fullcalendar-example-projects/blob/v6/next-scheduler/next.config.js
// for transpiling all ESM @fullcalendar/* packages
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@babel/preset-react',
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/list',
]);

module.exports = withTM({
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ];
  },
});
