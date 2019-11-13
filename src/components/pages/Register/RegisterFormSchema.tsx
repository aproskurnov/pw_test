import * as Yup from "yup"

const RegisterFormSchema = Yup.object().shape({
    username: Yup.string()
        .required("Name required"),
    email: Yup.string()
        .email("Wrong email")
        .required("Email required"),
    password: Yup.string()
        .min(6, "Too short password")
        .required("Password required"),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password confirmation error')
        .required("Password confirmation required")
});

export default RegisterFormSchema;