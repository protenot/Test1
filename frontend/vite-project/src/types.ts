export interface User {
name: string;
phone:string;
email:string;
address:string;
hire_date: Date;
position_name:string;
department:string;
addInformation?:string;
}

export interface CustomError {
    message: string;
  }