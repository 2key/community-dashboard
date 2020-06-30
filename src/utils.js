import moment from "moment";

export const initMonth = () => {
  let i = 1;
  const date = Date.now();
  const dateArrPerMonths = [`${date}`.slice(0, 10)];

  while (i < 5) {
    const substractMonth = moment(date).subtract(i, 'months');
    const formattedTimestamp = `${Date.parse(substractMonth)}`.slice(0, 10)
    dateArrPerMonths.push(formattedTimestamp)
    i += 1;
  }

  return dateArrPerMonths;
}

export const getMonth = (monthArr, index) => moment(+`${monthArr.reverse()[index]}000`).format('MMMM');