export const validateName =(name:string):string=>{
    if(!name.trim()) return "Name is required"
    if(name.trim().length<5)return "Name must be atleast 5 characters"
    return "";
}

export const validateEmail=(email:string):string=>{
    if(!email.trim())return "Email is required"
    const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email))return "Invalid email format"
    return ""
}


export const validatePhone = (phone: string): string => {
  const phoneStr = phone.toString();
  if (!phoneStr.trim()) return "Phone number is required";
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phoneStr)) return "Phone number must be 10 digits";
  return "";
};


export const validatePassword = (password: string): string => {
  if (!password.trim()) return "Password is required";
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password))
    return "Password must have 8+ chars, uppercase, lowercase, number, and special character";
  return "";
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string => {
  if (!confirmPassword.trim()) return "Confirm Password is required";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};