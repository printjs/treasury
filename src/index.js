import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
// import dayjs from 'dayjs';
// import { A } from './component';

// import('./test').then(({ test }) => {
//   test();
// })
// test();

const OtherComponent = lazy(() => import('./component'));

ReactDOM.render(
  <Suspense fallback={<div>Loading...</div>}>
    <OtherComponent />
  </Suspense>,
  document.getElementById('root')
);
