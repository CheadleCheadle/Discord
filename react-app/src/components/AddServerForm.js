import ServerForm from "../components/ServerForm";

const AddServerForm = ({ user }) => {
 //  return <h1>AddServerForm </h1>;
 return <ServerForm user={user} formType="AddServerForm" />;
};
export default AddServerForm;
