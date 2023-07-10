import { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import AlignCenter from "../components/AlignCenter";
import SignForm from "../components/SignForm";
import { authActions, useAuth } from "../store/auth/auth.slice";
import Input from "../components/Input";

const registerSchema = yup.object().shape({
	name: yup.string().required("Required"),
	email: yup.string().email("Must be a valid Email").required("Required"),
	password: yup
		.string()
		.min(8, "Must be at least 8 characters")
		.max(32, "Must be less than 32 characters")
		.required("Required"),
	password2: yup
		.string()
		.required("Required")
		.oneOf([yup.ref("password")], "Passwords does not match"),
});
type IRegisterInput = {
	name: string;
	email: string;
	password: string;
	password2: string;
};
function Register() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IRegisterInput>({
		delayError: 300,
		mode: "onChange",
		resolver: yupResolver(registerSchema),
	});

	const { user, isLoading } = useAuth();
	useEffect(() => {
		if (!isLoading && user?.token) navigate("/");
	}, [user, isLoading]);

	const onSubmit: SubmitHandler<IRegisterInput> = (data) => {
		dispatch(
			authActions.register({
				name: data.name,
				email: data.email,
				password: data.password,
			})
		);
	};

	return (
		<AlignCenter>
			<SignForm
				name={"Register"}
				onSubmit={handleSubmit(onSubmit)}
				reRouteText={"Already registered ? Login Here"}
				reRouteTo="/login"
			>
				<Input
					name="name"
					control={control}
					label="Name"
					error={errors.name ? true : false}
					helperText={errors.name?.message}
				/>
				<Input
					name="email"
					control={control}
					label="Email Address"
					error={errors.email ? true : false}
					helperText={errors.email?.message}
				/>
				<Input
					name="password"
					control={control}
					label="Password"
					type="password"
					error={errors.password ? true : false}
					helperText={errors.password?.message}
				/>
				<Input
					name="password2"
					control={control}
					label="Retype Password"
					type="password"
					error={errors.password2 ? true : false}
					helperText={errors.password2?.message}
				/>
			</SignForm>
		</AlignCenter>
	);
}

export default Register;
