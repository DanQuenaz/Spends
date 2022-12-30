export const stringDate = (date)=>{
    return `${date.getFullYear()}, ${date.getMonth()+1}, ${date.getDate()}, ${date.getHours()}, ${date.getMinutes()}, ${date.getSeconds()}`; 
};

export const stringDateView = (date)=>{
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear());
};