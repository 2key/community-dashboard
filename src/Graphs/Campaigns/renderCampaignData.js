export default ({ token, cpc, donation }) => ([
  {
    id: 'Token sale',
    color: 'hsla(140, 45%, 35%, 1)',
    data: token
  },
  {
    id: 'SmartLink',
    color: 'hsl(217, 70%, 50%)',
    data: cpc
  },
  {
    id: 'Donation',
    color: 'hsl(117, 70%, 50%)',
    data: donation
  }
]);