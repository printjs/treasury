import React from 'react';
import dayjs from 'dayjs';
const time = dayjs().format('YYYY-MM-DD hh:mm:ss');

export default function A(){
  return (<h1>Hello World !!!@# {time} <h1>);
}