import * as Yup from "yup"

const LoginFormSchema = Yup.object().shape({
    email: Yup.string()
        .email("Email wrong")
        .required("Email required"),
    password: Yup.string()
        .min(2, "Password too short")
        .required("Password required")
});

export default LoginFormSchema;