export const isToday = (dateString: string) => {
  if (!dateString) return false;
  const bookingDate = new Date(dateString);
  const today = new Date();
  
  return (
    bookingDate.getDate() === today.getDate() &&
    bookingDate.getMonth() === today.getMonth() &&
    bookingDate.getFullYear() === today.getFullYear()
  );
};
