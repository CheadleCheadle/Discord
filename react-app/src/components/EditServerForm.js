import ServerForm from "../components/ServerForm";

const EditServerForm = ({ server }) => {
 //  return <h1>AddServerForm </h1>;
 return <ServerForm server={server} formType="EditServerForm" />;
};
export default EditServerForm;
