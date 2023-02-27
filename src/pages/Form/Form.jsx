import { useFormik } from "formik";
import React from "react";
import Divider from "../../components/Divider/Divider";
import Heading from "../../components/Heading/Heading";
import FormContainer from "../../Layout/Containers/FormContainer";
import FirstSection from "./sub-components/FirstSection/FirstSection";
import * as yup from "yup";
import { addDoc, collection } from "firebase/firestore";
import database from "../../firebase";
import { toast } from "react-hot-toast";

const Form = () => {
  const formik = useFormik({
    initialValues: {
      fillingType: "half-day-filling",
      leaveDateRange: null,
      leaveBalance: null,
      proRatedLeave: null,
      reason: "",
      employeeName: "",
      employeeId: "",
    },
    validationSchema: yup.object({
      leaveDateRange: yup.array().min(2).required("Date Range is required!"),
      reason: yup.string().required("Reason is required!"),
      employeeName: yup.string().required("Name is required!"),
      employeeId: yup.string().required("ID is required!"),
    }),
    onSubmit: async (values) => {
      const leaveDataCollectionRef = collection(database, "leave_requests");
      await addDoc(leaveDataCollectionRef, values)
        .then(() => {
          toast.success("Leave Submitted, waiting for approval");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch(() => {
          toast.error("There is an error submitting your leave!");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
    },
  });
  console.log(formik.values);
  return (
    <FormContainer>
      <Heading size={"6xl"} text={"Leave Form"} />
      <FirstSection formik={formik} />
      <Divider />
    </FormContainer>
  );
};

export default Form;
