/**
 * Fisher-Yates shuffle
 */
export const shuffle = (arr1: any[], arr2: any[]) => {
  let ret1 = [...arr1];
  let ret2 = [...arr2];
  let index = ret1.length;
  let rnd, tmp1, tmp2;

  while (index) {
    rnd = Math.floor(Math.random() * index);
    index -= 1;
    tmp1 = ret1[index];
    tmp2 = ret2[index];
    ret1[index] = ret1[rnd];
    ret2[index] = ret2[rnd];
    ret1[rnd] = tmp1;
    ret2[rnd] = tmp2;
  }

  return [...ret1, ...ret2];
};
