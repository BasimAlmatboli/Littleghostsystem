export const generateRandomOrderNumber = (): string => {
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return randomNum.toString();
};
